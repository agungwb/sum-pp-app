import React, { useState } from 'react';
import Big from 'big.js';
import { useSidePanel } from '../../../../contexts/SidePanelContext';

import { ScheduleType, InvoiceStatus } from '../../types/repayment-schedule.enum';
import { RepaymentScheduleFormRequest } from '../../dtos/repayment-schedule.dto';
import { RepaymentSecuritySummary } from '../../../repayment-security/types/repayment-security.type';

// Import Custom Components
import { NumericInput, FormGroup, ConfirmModal, Select, Input, NumberField, Toggle } from '../../../../components/forms/index';
import { formatDateForInput } from '../../../../utils/date';

interface RepaymentScheduleFormProps {
  mode: 'add' | 'edit';
  initialData: RepaymentScheduleFormRequest;
  repaymentSecuritySummary: RepaymentSecuritySummary;
  onSubmit: (data: RepaymentScheduleFormRequest) => void;
  isLoading?: boolean;
}

const TAX_RATE = new Big('0.11'); // 11% PPN (Sesuaikan jika 12%)

export default function RepaymentScheduleForm({ mode, initialData, repaymentSecuritySummary, onSubmit, isLoading }: RepaymentScheduleFormProps) {
  const { closePanel } = useSidePanel();
  const [formData, setFormData] = useState<RepaymentScheduleFormRequest>(initialData);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Cek apakah modenya edit, field-field tertentu akan di disable
  const isEditMode = mode === 'edit';

  // Helper aman buat konversi ke Big
  const safeBig = (val: string | number | undefined | null) => {
    try {
      return new Big(val || '0');
    } catch {
      return new Big('0');
    }
  };

  const calculateTaxesAndTotals = (data: RepaymentScheduleFormRequest): RepaymentScheduleFormRequest => {
    const feeAdmin = safeBig(data.invoiceFeeAdministration);
    const feeProv = safeBig(data.invoiceFeeProvision);
    const feePlat = safeBig(data.invoiceFeePlatform);
    const feeServ = safeBig(data.invoiceFeeServicing);
    const feeMon = safeBig(data.invoiceFeeMonitoring);
    const feeOther = safeBig(data.invoiceFeeOther);
    const sinkingFund = safeBig(data.invoiceSinkingFund);
    const yieldVal = safeBig(data.invoiceYield);
    const actualLoss = safeBig(data.invoiceActualLoss);
    const penalty = safeBig(data.invoicePenalty);

    const taxAdmin = feeAdmin.times(TAX_RATE);
    const taxProv = feeProv.times(TAX_RATE);
    const taxPlat = feePlat.times(TAX_RATE);
    const taxServ = feeServ.times(TAX_RATE);
    const taxMon = feeMon.times(TAX_RATE);
    const taxOther = feeOther.times(TAX_RATE);

    const totalBase = feeAdmin.plus(feeProv).plus(feePlat).plus(feeServ)
      .plus(feeMon).plus(feeOther).plus(sinkingFund).plus(yieldVal)
      .plus(actualLoss).plus(penalty);

    const totalTax = taxAdmin.plus(taxProv).plus(taxPlat).plus(taxServ)
      .plus(taxMon).plus(taxOther);

    const totalWithTax = totalBase.plus(totalTax);

    return {
      ...data,
      invoiceFeeAdministrationTax: taxAdmin.toFixed(2),
      invoiceFeeProvisionTax: taxProv.toFixed(2),
      invoiceFeePlatformTax: taxPlat.toFixed(2),
      invoiceFeeServicingTax: taxServ.toFixed(2),
      invoiceFeeMonitoringTax: taxMon.toFixed(2),
      invoiceFeeOtherTax: taxOther.toFixed(2),
      invoiceTotal: totalBase.toFixed(2),
      invoiceTotalTax: totalTax.toFixed(2),
      invoiceTotalWithTax: totalWithTax.toFixed(2),
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'scheduleType') {
      let newData = { ...formData, [name]: value };
      
      // Jika diubah via form Select, reset nilai grup yang tidak relevan menjadi 0
      if (value === ScheduleType.UPFRONT) {
        newData.invoiceFeeMonitoring = '0';
        newData.invoiceFeeMonitoringTax = '0';
        newData.invoiceSinkingFund = '0';
        newData.invoiceYield = '0';
      } else if (value === ScheduleType.INSTALLMENT) {
        newData.invoiceFeeAdministration = '0';
        newData.invoiceFeeAdministrationTax = '0';
        newData.invoiceFeeProvision = '0';
        newData.invoiceFeeProvisionTax = '0';
        newData.invoiceFeePlatform = '0';
        newData.invoiceFeePlatformTax = '0';
        newData.invoiceFeeServicing = '0';
        newData.invoiceFeeServicingTax = '0';
      }
      
      // Kalkulasi ulang total ketika form di-reset menjadi 0
      setFormData(calculateTaxesAndTotals(newData));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNumericChange = (name: keyof RepaymentScheduleFormRequest, val: number) => {
    const newData = { ...formData, [name]: val.toString() };
    setFormData(calculateTaxesAndTotals(newData));
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmOpen(false);
    onSubmit(formData);
  };


  return (
    <>
      <form onSubmit={handleSubmitClick} className="flex flex-col h-full bg-white ">
        {/* Header */}
        <div className="shrink-0 p-4 border-b border-slate-200 bg-white">
          <h2 className="text-sm font-bold text-slate-800">
            {isEditMode ? 'Review & Edit Jadwal Pembayaran' : 'Tambah Jadwal Pembayaran Baru'}
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Komponen pajak dan total akan terkalkulasi secara otomatis (Asumsi PPN 11%).
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">
          
          {/* Hidden Fields */}
          <input type="hidden" name="id" value={(formData as any).id} />
          <input type="hidden" name="repaymentSecurityId" value={formData.repaymentSecurityId} />

          {/* Info Dasar */}
          <FormGroup title="INFORMASI DASAR">
            <Select label="Tipe Jadwal" name="scheduleType" value={formData.scheduleType} onChange={handleChange} disabled={isEditMode} colSpan="1">
              <option value={ScheduleType.UPFRONT}>UPFRONT</option>
              <option value={ScheduleType.INSTALLMENT}>INSTALLMENT</option>
            </Select>

            <Input label="Urutan Jadwal" name="scheduleSequence" type="number" value={formData.scheduleSequence} onChange={handleChange} disabled={isEditMode} colSpan="1" />
            <Input label="Tanggal Jadwal" name="scheduleDate" type="date" value={formatDateForInput(formData.scheduleDate)} onChange={handleChange} disabled={isEditMode} colSpan="1" />
            <Input label="Tanggal Invoice" name="invoiceDate" type="date" value={formatDateForInput(formData.invoiceDate)} onChange={handleChange} disabled={isEditMode} colSpan="1" />
            <Input label="Nomor Invoice" name="invoiceNumber" value={formData.invoiceNumber || ''} onChange={handleChange} disabled={isEditMode} colSpan="1" />
            <Input label="Invoice Sent Trial" name="invoiceSentTrial" type="number" value={formData.invoiceSentTrial} onChange={handleChange} disabled={isEditMode} colSpan="1" />
            
            <Select label="Status Invoice" name="invoiceStatus" value={formData.invoiceStatus} onChange={handleChange} disabled={isEditMode} colSpan="2">
              {Object.values(InvoiceStatus).map(status => (
                 <option key={status} value={status}>{status}</option>
              ))}
            </Select>

            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Catatan Invoice</label>
              <textarea 
                name="invoiceNotes" 
                value={formData.invoiceNotes} 
                onChange={handleChange} 
                rows={2} 
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-slate-700" 
              />
            </div>
          </FormGroup>

          {/* UPFRONT FEE */}
          {formData.scheduleType === ScheduleType.UPFRONT && (
            <FormGroup title="UPFRONT FEE">
              <NumberField label="Fee Administration" value={Number(formData.invoiceFeeAdministration || 0)} onValueChange={(val: number) => handleNumericChange('invoiceFeeAdministration', val)} />
              <NumberField label="Tax Administration" value={Number(formData.invoiceFeeAdministrationTax || 0)} onValueChange={() => {}} disabled />
              
              <NumberField label="Fee Provision" value={Number(formData.invoiceFeeProvision || 0)} onValueChange={(val: number) => handleNumericChange('invoiceFeeProvision', val)} />
              <NumberField label="Tax Provision" value={Number(formData.invoiceFeeProvisionTax || 0)} onValueChange={() => {}} disabled />

              <NumberField label="Fee Platform" value={Number(formData.invoiceFeePlatform || 0)} onValueChange={(val: number) => handleNumericChange('invoiceFeePlatform', val)} />
              <NumberField label="Tax Platform" value={Number(formData.invoiceFeePlatformTax || 0)} onValueChange={() => {}} disabled />

              <NumberField label="Fee Servicing" value={Number(formData.invoiceFeeServicing || 0)} onValueChange={(val: number) => handleNumericChange('invoiceFeeServicing', val)} />
              <NumberField label="Tax Servicing" value={Number(formData.invoiceFeeServicingTax || 0)} onValueChange={() => {}} disabled />

              {/* invoiceFeeOther ikut gabung di grup UPFRONT */}
              <NumberField label="Fee Other" value={Number(formData.invoiceFeeOther || 0)} onValueChange={(val: number) => handleNumericChange('invoiceFeeOther', val)} />
              <NumberField label="Tax Other" value={Number(formData.invoiceFeeOtherTax || 0)} onValueChange={() => {}} disabled />
            </FormGroup>
          )}

          {/* INSTALLMENT FEE & OTHERS */}
          {formData.scheduleType === ScheduleType.INSTALLMENT && (
            <FormGroup title="INSTALLMENT FEE">
              <NumberField label="Fee Monitoring" value={Number(formData.invoiceFeeMonitoring || 0)} onValueChange={(val: number) => handleNumericChange('invoiceFeeMonitoring', val)} />
              <NumberField label="Tax Monitoring" value={Number(formData.invoiceFeeMonitoringTax || 0)} onValueChange={() => {}} disabled />

              <NumberField label="Sinking Fund (Pokok)" value={Number(formData.invoiceSinkingFund || 0)} onValueChange={(val: number) => handleNumericChange('invoiceSinkingFund', val)} />
              <NumberField label="Yield (Kupon)" value={Number(formData.invoiceYield || 0)} onValueChange={(val: number) => handleNumericChange('invoiceYield', val)} />

              {/* invoiceFeeOther ikut gabung di grup INSTALLMENT */}
              <NumberField label="Fee Other" value={Number(formData.invoiceFeeOther || 0)} onValueChange={(val: number) => handleNumericChange('invoiceFeeOther', val)} />
              <NumberField label="Tax Other" value={Number(formData.invoiceFeeOtherTax || 0)} onValueChange={() => {}} disabled />
            </FormGroup>
          )}

          {/* DENDA & KERUGIAN */}
          <FormGroup title="Denda & Kerugian">
            <NumberField label="Actual Loss" value={Number(formData.invoiceActualLoss || 0)} onValueChange={(val: number) => handleNumericChange('invoiceActualLoss', val)} disabled={isEditMode} />
            <NumberField label="Penalty" value={Number(formData.invoicePenalty || 0)} onValueChange={(val: number) => handleNumericChange('invoicePenalty', val)} disabled={isEditMode} />
          </FormGroup>

          {/* TOTAL */}
          <FormGroup title="TOTAL">
            <NumberField label="Total Tagihan" value={Number(formData.invoiceTotal || 0)} onValueChange={() => {}} disabled className="font-medium text-amber-700" />
            <NumberField label="Total Pajak" value={Number(formData.invoiceTotalTax || 0)} onValueChange={() => {}} disabled className="font-medium text-rose-600" />
            
            <NumberField 
              colSpan="2" 
              label="Total Tagihan Beserta Pajak" 
              value={Number(formData.invoiceTotalWithTax || 0)} 
              onValueChange={() => {}} 
              disabled 
              className="font-bold text-lg text-emerald-700 bg-emerald-50 border-emerald-200" 
            />
          </FormGroup>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={closePanel}
            className="px-4 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-4 py-2 text-xs font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleConfirmSubmit} 
      />
    </>
  );
}