// src/components/repayment/RepaymentReceiptForm.tsx
import React, { useState, useEffect } from 'react';
import { Big } from 'big.js';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { FormGroup, ConfirmModal, Select, Input, NumberField, Toggle } from '../../../../components/forms/index';
import { RepaymentReceiptFormRequest } from '../../dtos/repayment-receipt.dto';
import { ReceiptMethod, ReceiptStatus, ScheduleType } from '../../types/repayment-receipt.enum';
import { InvoiceSummaryWithPenaltyBig } from '../../../repayment-schedule/types/repayment-schedule.type';
import { formatDateForInput } from '../../../../utils/date';
import { toSafeBig } from '../../../../utils/number';

interface Props {
  mode: 'add' | 'edit';
  initialData: RepaymentReceiptFormRequest;
  invoiceSummary: InvoiceSummaryWithPenaltyBig; // Dummy/Target Schedule data for waterfall limits
  onSubmit: (data: RepaymentReceiptFormRequest) => void;
  isLoading?: boolean;
}

export default function RepaymentReceiptForm({ mode, initialData, invoiceSummary, onSubmit, isLoading }: Props) {
  const { closePanel } = useSidePanel();
  const [formData, setFormData] = useState<RepaymentReceiptFormRequest>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Pastikan initialData yang masuk dikalkulasi ulang untuk memastikan sinkronisasi total
      setFormData(calculateTaxesAndTotals(initialData));
    }
  }, [initialData]);

  const precision = 0;
  const precisionTax = 4;

  const taxRate = invoiceSummary.taxPpn.times(invoiceSummary.taxFactor).round(precisionTax);
  const isEditMode = mode === 'edit';

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kalkulasi Sentral: Menghitung pajak individu dan merekap semua total
  // Tambahkan 'isTopDown' dengan default false
  const calculateTaxesAndTotals = (formData: RepaymentReceiptFormRequest, isTopDown: boolean = false): RepaymentReceiptFormRequest => {
    
    // ... (Bagian ambil data Base & Non-Taxable tetap sama)
    const feeAdmin = toSafeBig(formData.receiptFeeAdministration).round(precision);
    const feeProv = toSafeBig(formData.receiptFeeProvision).round(precision);
    const feePlat = toSafeBig(formData.receiptFeePlatform).round(precision);
    const feeServ = toSafeBig(formData.receiptFeeServicing).round(precision);
    const feeMon = toSafeBig(formData.receiptFeeMonitoring).round(precision);
    const feeOther = toSafeBig(formData.receiptFeeOther).round(precision);
    
    const sinkingFund = toSafeBig(formData.receiptSinkingFund).round(precision);
    const yieldVal = toSafeBig(formData.receiptYield).round(precision);
    const actualLoss = toSafeBig(formData.receiptActualLoss).round(precision);
    const penalty = toSafeBig(formData.receiptPenalty).round(precision);
  
    const totalBase = feeAdmin.plus(feeProv).plus(feePlat).plus(feeServ)
      .plus(feeMon).plus(feeOther).plus(sinkingFund).plus(yieldVal)
      .plus(actualLoss).plus(penalty).round(precision);
  
    // Kalkulasi Tax Awal
    let taxAdmin = feeAdmin.times(taxRate).round(precision);
    let taxProv = feeProv.times(taxRate).round(precision);
    let taxPlat = feePlat.times(taxRate).round(precision);
    let taxServ = feeServ.times(taxRate).round(precision);
    let taxMon = feeMon.times(taxRate).round(precision);
    let taxOther = feeOther.times(taxRate).round(precision);
  
    let totalTax = taxAdmin.plus(taxProv).plus(taxPlat).plus(taxServ)
      .plus(taxMon).plus(taxOther).round(precision);
  
    // Ambil target Total With Tax (jika isTopDown, nilai ini jadi single source of truth)
    let totalWithTax = toSafeBig(formData.receiptTotalWithTax).round(precision);

    if (isTopDown) {
      // --- TOP DOWN MODE (Waterfall) ---
      // Kunci totalWithTax dari input, paksa Tax-nya yang mengalah mencari selisih!
      const expectedTotalTax = totalWithTax.minus(totalBase);
      
      if (!expectedTotalTax.eq(totalTax)) {
        const diff = expectedTotalTax.minus(totalTax);
        
        // Distribusi selisih murni ke tax pertama yang nilainya ada
        if (taxAdmin.gt(0)) taxAdmin = taxAdmin.plus(diff);
        else if (taxProv.gt(0)) taxProv = taxProv.plus(diff);
        else if (taxPlat.gt(0)) taxPlat = taxPlat.plus(diff);
        else if (taxServ.gt(0)) taxServ = taxServ.plus(diff);
        else if (taxMon.gt(0)) taxMon = taxMon.plus(diff);
        else taxOther = taxOther.plus(diff); // Fallback terakhir
        
        totalTax = expectedTotalTax;
      }
    } else {
      // --- BOTTOM UP MODE (Manual Edit Component) ---
      // Biarkan totalWithTax dihitung normal mengikuti totalBase + totalTax 
      totalWithTax = totalBase.plus(totalTax).round(precision);
    }
  
    return {
      ...formData,
      receiptFeeAdministrationTax: taxAdmin.round(precision).toString(),
      receiptFeeProvisionTax: taxProv.round(precision).toString(),
      receiptFeePlatformTax: taxPlat.round(precision).toString(),
      receiptFeeServicingTax: taxServ.round(precision).toString(),
      receiptFeeMonitoringTax: taxMon.round(precision).toString(),
      receiptFeeOtherTax: taxOther.round(precision).toString(),
      receiptTotal: totalBase.round(precision).toString(),
      receiptTotalTax: totalTax.round(precision).toString(),
      receiptTotalWithTax: totalWithTax.round(precision).toString(), // Nilainya aman tidak akan berkurang!
    };
  };

  // Logic Hitung Otomatis (Top-Down / Waterfall)
  const handleCalculateWaterfall = (val: Big) => {
    let remTotalWithTax = toSafeBig(val);
    
    // Sisihkan dulu porsi Penalty dan Actual Loss agar tidak tertimpa waterfall
    const penalty = toSafeBig(formData.receiptPenalty);
    const actualLoss = toSafeBig(formData.receiptActualLoss);
    remTotalWithTax = remTotalWithTax.minus(penalty).minus(actualLoss);
    if (remTotalWithTax.lt(0)) remTotalWithTax = new Big(0);

    // Reset base components supaya bersih dari manual input sebelumnya
    const newForm = {
      ...formData,
      receiptTotalWithTax: val.toFixed(precision),
      receiptFeeAdministration: '0',
      receiptFeeProvision: '0',
      receiptFeePlatform: '0',
      receiptFeeServicing: '0',
      receiptFeeMonitoring: '0',
      receiptSinkingFund: '0',
      receiptYield: '0',
      receiptFeeOther: '0',
    };

    if (!invoiceSummary) {
      // 👈 Tembak "true" parameter Top-Down
      setFormData(calculateTaxesAndTotals(newForm, true)); 
      return;
    }

    // if (!invoiceSummary) {
    //   setFormData(calculateTaxesAndTotals({ ...newForm, receiptTotalWithTax: val.toString() }));
    //   return;
    // }

    // Helper: Alokasi proporsional berdasarkan cap tagihan (Invoice)
    const allocComponentBase = (invBase: Big | undefined | null, hasTax: boolean = true) => {
      if (remTotalWithTax.lte(0)) return '0';
      
      const maxBase = toSafeBig(invBase);
      const maxTax = hasTax ? maxBase.times(taxRate) : new Big(0);
      const maxWithTax = maxBase.plus(maxTax);

      if (remTotalWithTax.gte(maxWithTax)) {
        // Alokasikan full
        remTotalWithTax = remTotalWithTax.minus(maxWithTax);
        return maxBase.round(precision).toString();
      } else {
        // Proporsi jika dana tidak cukup
        let allocBase;
        if (hasTax) {
          allocBase = remTotalWithTax.div(new Big(1).plus(taxRate));
        } else {
          allocBase = remTotalWithTax;
        }
        remTotalWithTax = new Big(0);
        return allocBase.round(precision).toString();
      }
    };

    // 3. Distribusi biaya berdasar ScheduleType
    if (invoiceSummary.scheduleType === ScheduleType.UPFRONT) {
      newForm.receiptFeeAdministration = allocComponentBase(invoiceSummary.invoiceFeeAdministration, true);
      newForm.receiptFeeProvision = allocComponentBase(invoiceSummary.invoiceFeeProvision, true);
      newForm.receiptFeePlatform = allocComponentBase(invoiceSummary.invoiceFeePlatform, true);
      newForm.receiptFeeServicing = allocComponentBase(invoiceSummary.invoiceFeeServicing, true);
      
      // Jika masih ada sisa/excess dana, distribusikan semua ke Fee Other
      const otherBaseLimit = invoiceSummary.invoiceFeeOther;
      if (remTotalWithTax.gt(0)) {
         const allocBaseExcess = remTotalWithTax.div(new Big(1).plus(taxRate));
         newForm.receiptFeeOther = otherBaseLimit.plus(allocBaseExcess).round(precision).toString();
         remTotalWithTax = new Big(0);
      } else {
         newForm.receiptFeeOther = allocComponentBase(invoiceSummary.invoiceFeeOther, true);
      }

    } else if (invoiceSummary.scheduleType === ScheduleType.INSTALLMENT) {
      newForm.receiptFeeMonitoring = allocComponentBase(invoiceSummary.invoiceFeeMonitoring, true);
      newForm.receiptSinkingFund = allocComponentBase(invoiceSummary.invoiceSinkingFund, false);
      newForm.receiptYield = allocComponentBase(invoiceSummary.invoiceYield, false);
      
      // Jika masih ada sisa/excess dana, distribusikan semua ke Fee Other
      const otherBaseLimit = invoiceSummary.invoiceFeeOther;
      if (remTotalWithTax.gt(0)) {
         const allocBaseExcess = remTotalWithTax.div(new Big(1).plus(taxRate));
         newForm.receiptFeeOther = otherBaseLimit.plus(allocBaseExcess).round(precision).toString();
         remTotalWithTax = new Big(0);
      } else {
         newForm.receiptFeeOther = allocComponentBase(invoiceSummary.invoiceFeeOther, true);
      }
    }

    // Wrap-up dengan menghitung ulang semua pajak dan grand total secara presisi
    // setFormData(calculateTaxesAndTotals(newForm));
    setFormData(calculateTaxesAndTotals(newForm, true));
  };

  // Di dalam UseEffect initialData
  useEffect(() => {
    if (initialData) {
      setFormData(calculateTaxesAndTotals(initialData, false)); // 👈 false
    }
  }, [initialData]);

  // Di dalam handler ubah manual
  const handleManualNumber = (name: keyof RepaymentReceiptFormRequest) => (val: number) => {
    const newForm = { ...formData, [name]: val.toString() };
    setFormData(calculateTaxesAndTotals(newForm, false)); // 👈 false
  };

  // Logic Jika User Mengedit Manual Field Base Tertentu
  // const handleManualNumber = (name: keyof RepaymentReceiptFormRequest) => (val: number) => {
  //   const newForm = { ...formData, [name]: val.toString() };
  //   setFormData(calculateTaxesAndTotals(newForm));
  // };
  

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <form className="h-full w-full flex flex-col bg-white" onSubmit={handleSubmitClick}>
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-slate-200 bg-white">
          <h2 className="text-sm font-bold text-slate-800">
            {isEditMode ? 'Edit Receipt' : 'Buat Receipt Baru'}
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Perhitungan Otomatis dilakukan berdasarkan jumlah total.
          </p>
        </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* GROUP 1: Informasi Dasar */}
        <FormGroup title="INFORMASI PENERIMAAN DANA" colRatio="1:1">
          <NumberField label="Jumlah Total Tagihan" value={Number(invoiceSummary?.invoiceTotalWithTax.round(precision).toString()) || 0} disabled={true} colSpan="1" />
          <Input label="Tanggal Penerimaan" name="receiptDate" type="date" value={formatDateForInput(formData.receiptDate)} onChange={handleChange} colSpan="1" />
          <Select label="Metode Penerimaan" name="receiptMethod" value={formData.receiptMethod ?? ""} onChange={handleChange} colSpan="1">
            <option key="default" value="">-- Pilih Metode Transfer --</option>
            {Object.values(ReceiptMethod).map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
          </Select>
          <Select label="Status Penerimaan" name="receiptStatus" value={formData.receiptStatus} onChange={handleChange} colSpan="1">
            {Object.values(ReceiptStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          
          <div className="col-span-2">
            <label className={`block text-[10px] font-semibold mb-1`}>Catatan</label>
            <textarea 
              name="receiptNotes" 
              value={formData.receiptNotes} 
              onChange={handleChange} 
              rows={2} 
              className={`w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 transition-colors bg-white `} 
            />
          </div>
          <div className="col-span-2 border-slate-200 px-6 py-4 border-b-2 rounded-lg">
            <label className="block text-[10px] font-semibold text-slate-600 mb-1">Document URL</label>
            <input name="receiptDocumentUrl" type="file" className="w-full text-xs" onChange={(e) => setFormData({...formData, receiptDocumentUrl: e.target.files ? e.target.files[0] : null})} />
          </div>
        </FormGroup>

        {/* GROUP 2: Rincian Nilai Penerimaan */}
        <FormGroup title="TOTAL DANA DITERIMA" colRatio="1:1">
          <NumberField 
            label="Total Penerimaan (With Tax)" 
            value={Number(formData.receiptTotalWithTax) || 0} 
            onValueChange={handleCalculateWaterfall} 
            colSpan="2" 
            className="font-semibold text-lg text-emerald-700 bg-emerald-50 border-emerald-200" 
          />
          <NumberField label="Receipt Total (Pokok)" value={Number(formData.receiptTotal) || 0} disabled colSpan="1" />
          <NumberField label="Receipt Tax (Pajak)" value={Number(formData.receiptTotalTax) || 0} disabled colSpan="1" />
        </FormGroup>

        {/* Rincian Spesifik Sesuai Schedule */}
        {invoiceSummary.scheduleType === ScheduleType.UPFRONT && (
          <FormGroup title="UPFRONT FEE" colRatio="1:1">
            {invoiceSummary.invoiceFeeAdministration.gt(0) && 
            <>
              <NumberField label="Fee Administration" value={Number(formData.receiptFeeAdministration) || 0} onValueChange={handleManualNumber('receiptFeeAdministration')} />
              <NumberField label="Fee Administration Tax" value={Number(formData.receiptFeeAdministrationTax) || 0} disabled />
            </>}

            {invoiceSummary.invoiceFeeProvision.gt(0) && 
            <>
              <NumberField label="Fee Provision" value={Number(formData.receiptFeeProvision) || 0} onValueChange={handleManualNumber('receiptFeeProvision')} />
              <NumberField label="Fee Provision Tax" value={Number(formData.receiptFeeProvisionTax) || 0} disabled />
            </>}

            {invoiceSummary.invoiceFeePlatform.gt(0) && 
            <>
               <NumberField label="Fee Platform" value={Number(formData.receiptFeePlatform) || 0} onValueChange={handleManualNumber('receiptFeePlatform')} />
              <NumberField label="Fee Platform Tax" value={Number(formData.receiptFeePlatformTax) || 0} disabled />
            </>}

            {invoiceSummary.invoiceFeeServicing.gt(0) && 
            <>
              <NumberField label="Fee Servicing" value={Number(formData.receiptFeeServicing) || 0} onValueChange={handleManualNumber('receiptFeeServicing')} />
              <NumberField label="Fee Servicing Tax" value={Number(formData.receiptFeeServicingTax) || 0} disabled />
            </>}
            
            {/* Pemisah untuk kelompok Fee Other */}
            <div className="col-span-2 w-full border-b border-slate-200 mt-2 pt-4"></div>
            <NumberField label="Fee Other" value={Number(formData.receiptFeeOther) || 0} onValueChange={handleManualNumber('receiptFeeOther')} />
            <NumberField label="Fee Other Tax" value={Number(formData.receiptFeeOtherTax) || 0} disabled />
          </FormGroup>
        )}

        {invoiceSummary.scheduleType === ScheduleType.INSTALLMENT && (
          <FormGroup title="INSTALLMENT FEE" colRatio="1:1">
            <NumberField label="Fee Monitoring" value={Number(formData.receiptFeeMonitoring) || 0} onValueChange={handleManualNumber('receiptFeeMonitoring')} />
            <NumberField label="Fee Monitoring Tax" value={Number(formData.receiptFeeMonitoringTax) || 0} disabled />
            <NumberField label="Sinking Fund" value={Number(formData.receiptSinkingFund) || 0} onValueChange={handleManualNumber('receiptSinkingFund')} />
            <NumberField label="Yield" value={Number(formData.receiptYield) || 0} onValueChange={handleManualNumber('receiptYield')} />
            {/* Pemisah untuk kelompok Fee Other */}
            <div className="col-span-2 w-full border-b border-slate-200 mt-2 pt-4"></div>
            <NumberField label="Fee Other" value={Number(formData.receiptFeeOther) || 0} onValueChange={handleManualNumber('receiptFeeOther')} />
            <NumberField label="Fee Other Tax" value={Number(formData.receiptFeeOtherTax) || 0} disabled />
          </FormGroup>
        )}

        <FormGroup title="DENDA & KERUGIAN RIIL" colRatio="1:1">
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