// src/components/repayment/RepaymentReceiptForm.tsx
import React, { useState, useEffect } from 'react';
import { useSidePanel } from '../../../../contexts/SidePanelContext'; // Sesuaikan path jika berbeda

interface RepaymentReceiptFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

// State awal form kosong
const defaultFormState = {
  id: '',
  repayment_schedule_id: '',
  receipt_date: '',
  receipt_status: 'SUCCESS', // Default state
  receipt_notes: '',
  receipt_fee_administration: '',
  receipt_fee_administration_tax: '',
  receipt_fee_provision: '',
  receipt_fee_provision_tax: '',
  receipt_fee_platform: '',
  receipt_fee_platform_tax: '',
  receipt_fee_servicing: '',
  receipt_fee_servicing_tax: '',
  receipt_fee_monitoring: '',
  receipt_fee_monitoring_tax: '',
  receipt_fee_other: '',
  receipt_fee_other_tax: '',
  receipt_sinking_fund: '',
  receipt_yield: '',
  receipt_actual_loss: '',
  receipt_penalty: '',
  receipt_total: '',
  receipt_total_tax: '',
  receipt_total_with_tax: ''
};

export default function RepaymentReceiptForm({ initialData, onSubmit, isLoading }: RepaymentReceiptFormProps) {
  const { closePanel } = useSidePanel();
  const [formData, setFormData] = useState(defaultFormState);

  // Auto-fill state kalau ada initialData (Mode Edit)
  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormState, ...initialData });
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
      {/* Header (Fixed Atas) */}
      <div className="border-b border-slate-200 p-4 shrink-0">
        <h2 className="text-sm font-bold text-slate-800">
          {initialData?.id ? 'Ubah Riwayat Penerimaan' : 'Tambahkan Penerimaan Baru'}
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {initialData?.id ? 'Perbarui data penerimaan pembayaran yang sudah ada' : 'Masukkan detail penerimaan pembayaran tagihan ini'}
        </p>
      </div>

      {/* Body / Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Section: Informasi Utama */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3">
            Informasi Utama
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="ID Jadwal Pembayaran" name="repayment_schedule_id" value={formData.repayment_schedule_id} onChange={handleChange} disabled={!!initialData?.repayment_schedule_id} />
            <Input label="Tanggal Penerimaan" type="datetime-local" name="receipt_date" value={formData.receipt_date} onChange={handleChange} />
            
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Status Penerimaan</label>
              <select
                name="receipt_status"
                value={formData.receipt_status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
              >
                <option value="SUCCESS">SUCCESS</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Catatan (Notes)</label>
              <textarea
                name="receipt_notes"
                value={formData.receipt_notes}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
              />
            </div>
          </div>
        </section>

        {/* Section: Pokok & Yield */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3">
            Pokok & Yield
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pokok (Sinking Fund)" name="receipt_sinking_fund" type="number" value={formData.receipt_sinking_fund} onChange={handleChange} />
            <Input label="Imbal Hasil (Yield)" name="receipt_yield" type="number" value={formData.receipt_yield} onChange={handleChange} />
            <Input label="Actual Loss" name="receipt_actual_loss" type="number" value={formData.receipt_actual_loss} onChange={handleChange} />
            <Input label="Penalti" name="receipt_penalty" type="number" value={formData.receipt_penalty} onChange={handleChange} />
          </div>
        </section>

        {/* Section: Rincian Biaya (Fees) */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3">
            Rincian Biaya (Fees)
          </h3>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-md border border-slate-100">
            <Input label="Biaya Administrasi" name="receipt_fee_administration" type="number" value={formData.receipt_fee_administration} onChange={handleChange} />
            <Input label="Pajak Administrasi" name="receipt_fee_administration_tax" type="number" value={formData.receipt_fee_administration_tax} onChange={handleChange} />
            
            <Input label="Biaya Provisi" name="receipt_fee_provision" type="number" value={formData.receipt_fee_provision} onChange={handleChange} />
            <Input label="Pajak Provisi" name="receipt_fee_provision_tax" type="number" value={formData.receipt_fee_provision_tax} onChange={handleChange} />
            
            <Input label="Biaya Platform" name="receipt_fee_platform" type="number" value={formData.receipt_fee_platform} onChange={handleChange} />
            <Input label="Pajak Platform" name="receipt_fee_platform_tax" type="number" value={formData.receipt_fee_platform_tax} onChange={handleChange} />
            
            <Input label="Biaya Servicing" name="receipt_fee_servicing" type="number" value={formData.receipt_fee_servicing} onChange={handleChange} />
            <Input label="Pajak Servicing" name="receipt_fee_servicing_tax" type="number" value={formData.receipt_fee_servicing_tax} onChange={handleChange} />
            
            <Input label="Biaya Monitoring" name="receipt_fee_monitoring" type="number" value={formData.receipt_fee_monitoring} onChange={handleChange} />
            <Input label="Pajak Monitoring" name="receipt_fee_monitoring_tax" type="number" value={formData.receipt_fee_monitoring_tax} onChange={handleChange} />
            
            <Input label="Biaya Lainnya" name="receipt_fee_other" type="number" value={formData.receipt_fee_other} onChange={handleChange} />
            <Input label="Pajak Lainnya" name="receipt_fee_other_tax" type="number" value={formData.receipt_fee_other_tax} onChange={handleChange} />
          </div>
        </section>

        {/* Section: Total */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3">
            Total Penerimaan
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total (Tanpa Pajak)" name="receipt_total" type="number" value={formData.receipt_total} onChange={handleChange} />
            <Input label="Total Pajak" name="receipt_total_tax" type="number" value={formData.receipt_total_tax} onChange={handleChange} />
            <div className="col-span-2">
              <Input label="Total Keseluruhan (With Tax)" name="receipt_total_with_tax" type="number" value={formData.receipt_total_with_tax} onChange={handleChange} />
            </div>
          </div>
        </section>

      </div>

      {/* Footer (Fixed Bawah) */}
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
          {isLoading ? 'Menyimpan...' : (initialData?.id ? 'Simpan Perubahan' : 'Tambahkan Penerimaan')}
        </button>
      </div>
    </form>
  );
}

// Komponen Helper Mini (DRY Principle) - FIX: Pakai <input> biasa!
const Input = ({ label, type = 'text', ...props }: any) => (
  <div>
    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
    <input
      type={type}
      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
      {...props}
    />
  </div>
);