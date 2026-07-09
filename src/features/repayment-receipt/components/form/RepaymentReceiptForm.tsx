// src/components/repayment/RepaymentReceiptForm.tsx
import React, { useState, useEffect } from 'react';
import Big from 'big.js';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { NumericInput, FormGroup, ConfirmModal, Select, Input, NumberField, Toggle } from '../../../../components/forms/index';
import { RepaymentReceiptRequest } from '../../dtos/repayment-receipt.dto';
import { ReceiptMethod, ReceiptStatus, ScheduleType } from '../../types/repayment-receipt.enum';
import { InvoiceSummary } from '../../../repayment-schedule/types/repayment-schedule.type';
import { formatDateForInput } from '../../../../utils/date';

interface Props {
   mode: 'add' | 'edit';
  initialData: RepaymentReceiptRequest;
  invoiceSummary: InvoiceSummary; // Dummy/Target Schedule data for waterfall limits
  scheduleType: ScheduleType;
  onSubmit: (data: RepaymentReceiptRequest) => void;
  isLoading?: boolean;
}

export default function RepaymentReceiptForm({ mode, initialData, invoiceSummary, scheduleType, onSubmit, isLoading }: Props) {
  const { closePanel } = useSidePanel();
  const [formData, setFormData] = useState<RepaymentReceiptRequest>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Logic Hitung Otomatis (Waterfall)
  const handleCalculateWaterfall = (val: number) => {
    const valStr = val.toString();
    const newForm = { ...formData, receiptTotalWithTax: valStr };

    if (!invoiceSummary) {
      setFormData(newForm);
      return;
    }

    const totalWithTax = new Big(val || 0);
    const invTotal = new Big(invoiceSummary.invoiceTotal || 0);
    const invTotalTax = new Big(invoiceSummary.invoiceTotalTax || 0);

    // 1. calculateTotal() -> Mengambil dari max tagihan utama
    const receiptTotal = totalWithTax.gte(invTotal) ? invTotal : totalWithTax;
    newForm.receiptTotal = receiptTotal.toFixed(2);

    // 2. calculateTax() -> Sisa dialokasikan ke pajak
    const remainingTax = totalWithTax.minus(receiptTotal);
    const receiptTax = remainingTax.gte(invTotalTax) ? invTotalTax : remainingTax;
    newForm.receiptTotalTax = receiptTax.toFixed(2);

    // Persiapan calculateAllFee() & calculateAllFeeTax()
    let remFee = new Big(receiptTotal);
    let remTax = new Big(receiptTax);

    const allocFee = (invVal: string) => {
      const max = new Big(invVal || 0);
      const alloc = remFee.gte(max) ? max : remFee;
      remFee = remFee.minus(alloc);
      return alloc.toFixed(2);
    };

    const allocTax = (invVal: string) => {
      const max = new Big(invVal || 0);
      const alloc = remTax.gte(max) ? max : remTax;
      remTax = remTax.minus(alloc);
      return alloc.toFixed(2);
    };

    // 3. Distribusi biaya berdasar ScheduleType
    if (scheduleType === ScheduleType.UPFRONT) {
      newForm.receiptFeeAdministration = allocFee(invoiceSummary.invoiceFeeAdministration);
      newForm.receiptFeeProvision = allocFee(invoiceSummary.invoiceFeeProvision);
      newForm.receiptFeePlatform = allocFee(invoiceSummary.invoiceFeePlatform);
      newForm.receiptFeeServicing = allocFee(invoiceSummary.invoiceFeeServicing);
      newForm.receiptFeeOther = allocFee(invoiceSummary.invoiceFeeOther);

      newForm.receiptFeeAdministrationTax = allocTax(invoiceSummary.invoiceFeeAdministrationTax);
      newForm.receiptFeeProvisionTax = allocTax(invoiceSummary.invoiceFeeProvisionTax);
      newForm.receiptFeePlatformTax = allocTax(invoiceSummary.invoiceFeePlatformTax);
      newForm.receiptFeeServicingTax = allocTax(invoiceSummary.invoiceFeeServicingTax);
      newForm.receiptFeeOtherTax = allocTax(invoiceSummary.invoiceFeeOtherTax);
    } else if (scheduleType === ScheduleType.INSTALLMENT) {
      newForm.receiptFeeMonitoring = allocFee(invoiceSummary.invoiceFeeMonitoring);
      newForm.receiptSinkingFund = allocFee(invoiceSummary.invoiceSinkingFund);
      newForm.receiptYield = allocFee(invoiceSummary.invoiceYield);
      newForm.receiptFeeOther = allocFee(invoiceSummary.invoiceFeeOther);

      newForm.receiptFeeMonitoringTax = allocTax(invoiceSummary.invoiceFeeMonitoringTax);
      newForm.receiptFeeOtherTax = allocTax(invoiceSummary.invoiceFeeOtherTax);
    }

    setFormData(newForm);
  };

  const handleManualNumber = (name: keyof RepaymentReceiptRequest) => (val: number) => {
    setFormData({ ...formData, [name]: val.toString() });
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <form className="h-full w-full flex flex-col bg-white" onSubmit={handleSubmitClick}>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* GROUP 1: Informasi Dasar */}
        <FormGroup title="Informasi Penerimaan" colRatio="1:1">
          <Input label="Tanggal Penerimaan" name="receiptDate" type="date" value={formatDateForInput(formData.receiptDate)} onChange={handleChange} colSpan="1" />
          <Select label="Status Penerimaan" name="receiptStatus" value={formData.receiptStatus} onChange={handleChange} colSpan="1">
            {Object.values(ReceiptStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select label="Metode Penerimaan" name="receiptMethod" value={formData.receiptMethod} onChange={handleChange} colSpan="1">
            {Object.values(ReceiptMethod).map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
          </Select>
          <Input label="Dokumen URL" name="receiptDocumentUrl" value={formData.receiptDocumentUrl} onChange={handleChange} colSpan="1" />
          <Input label="Catatan" name="receiptNotes" value={formData.receiptNotes} onChange={handleChange} colSpan="2" />
        </FormGroup>

        {/* GROUP 2: Rincian Nilai Penerimaan */}
        <FormGroup title="Rincian Nilai Penerimaan (Auto-Calculate)" colRatio="1:1">
          <NumberField label="Total Penerimaan (With Tax)" value={Number(formData.receiptTotalWithTax) || 0} onValueChange={handleCalculateWaterfall} colSpan="2" />
          <NumberField label="Receipt Total (Pokok)" value={Number(formData.receiptTotal) || 0} disabled colSpan="1" />
          <NumberField label="Receipt Tax (Pajak)" value={Number(formData.receiptTotalTax) || 0} disabled colSpan="1" />
        </FormGroup>

        {/* Rincian Spesifik Sesuai Schedule */}
        {scheduleType === ScheduleType.UPFRONT && (
          <FormGroup title="Distribusi UPFRONT" colRatio="1:1">
            <NumberField label="Fee Administration" value={Number(formData.receiptFeeAdministration) || 0} disabled />
            <NumberField label="Fee Administration Tax" value={Number(formData.receiptFeeAdministrationTax) || 0} disabled />
            <NumberField label="Fee Provision" value={Number(formData.receiptFeeProvision) || 0} disabled />
            <NumberField label="Fee Provision Tax" value={Number(formData.receiptFeeProvisionTax) || 0} disabled />
            <NumberField label="Fee Platform" value={Number(formData.receiptFeePlatform) || 0} disabled />
            <NumberField label="Fee Platform Tax" value={Number(formData.receiptFeePlatformTax) || 0} disabled />
            <NumberField label="Fee Servicing" value={Number(formData.receiptFeeServicing) || 0} disabled />
            <NumberField label="Fee Servicing Tax" value={Number(formData.receiptFeeServicingTax) || 0} disabled />
          </FormGroup>
        )}

        {scheduleType === ScheduleType.INSTALLMENT && (
          <FormGroup title="Distribusi INSTALLMENT" colRatio="1:1">
            <NumberField label="Fee Monitoring" value={Number(formData.receiptFeeMonitoring) || 0} disabled />
            <NumberField label="Fee Monitoring Tax" value={Number(formData.receiptFeeMonitoringTax) || 0} disabled />
            <NumberField label="Sinking Fund" value={Number(formData.receiptSinkingFund) || 0} disabled />
            <NumberField label="Yield" value={Number(formData.receiptYield) || 0} disabled />
          </FormGroup>
        )}

        <FormGroup title="Biaya Lainnya & Denda" colRatio="1:1">
          <NumberField label="Fee Other" value={Number(formData.receiptFeeOther) || 0} disabled />
          <NumberField label="Fee Other Tax" value={Number(formData.receiptFeeOtherTax) || 0} disabled />
          <NumberField label="Actual Loss" value={Number(formData.receiptActualLoss) || 0} onValueChange={handleManualNumber('receiptActualLoss')} />
          <NumberField label="Penalty" value={Number(formData.receiptPenalty) || 0} onValueChange={handleManualNumber('receiptPenalty')} />
        </FormGroup>

      </div>

      <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3 shrink-0">
        <button type="button" onClick={closePanel} className="px-4 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors">Batal</button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 text-xs font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50">
          {isLoading ? 'Menyimpan...' : 'Simpan Penerimaan'}
        </button>
      </div>

      <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { setIsModalOpen(false); onSubmit(formData); }} />
    </form>
  );
}