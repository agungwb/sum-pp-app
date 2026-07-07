// src/components/repayment/RepaymentScheduleForm.tsx
import React, { useState } from 'react';
import { useSidePanel } from '../../../../contexts/SidePanelContext'; // Sesuaikan path jika berbeda

interface RepaymentScheduleFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

// State awal kosong untuk form Create (menampung semua field spesifikasi lo)
const defaultFormState = {
  id: '',
  repayment_security_id: '',
  schedule_order: '',
  schedule_date: '',
  invoice_date: '',
  invoice_status: 'UNPAID', // Default state
  invoice_notes: '',
  invoice_fee_administration: '',
  invoice_fee_administration_tax: '',
  invoice_fee_provision: '',
  invoice_fee_provision_tax: '',
  invoice_fee_platform: '',
  invoice_fee_platform_tax: '',
  invoice_fee_servicing: '',
  invoice_fee_servicing_tax: '',
  invoice_fee_monitoring: '',
  invoice_fee_monitoring_tax: '',
  invoice_fee_other: '',
  invoice_fee_other_tax: '',
  invoice_sinking_fund: '',
  invoice_yield: '',
  invoice_actual_loss: '',
  invoice_penalty: '',
  invoice_total: '',
  invoice_total_tax: '',
  invoice_total_with_tax: ''
};

export default function RepaymentScheduleForm({ initialData, onSubmit, isLoading }: RepaymentScheduleFormProps) {
  const { closePanel } = useSidePanel();
  const [formData, setFormData] = useState(initialData || defaultFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
      {/* Header (Fixed Atas) */}
      <div className="shrink-0 p-4 border-b border-slate-200 bg-white">
        <h2 className="text-sm font-bold text-slate-800">
          {initialData?.id ? 'Edit Jadwal Pembayaran' : 'Tambah Jadwal Baru'}
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {initialData?.id 
            ? 'Perbarui informasi dan komponen tagihan jadwal ini.' 
            : 'Lengkapi formulir di bawah untuk membuat jadwal angsuran / tagihan baru.'}
        </p>
      </div>

      {/* Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Section 1: Informasi Dasar */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-700 mb-3 uppercase tracking-wider">Informasi Dasar</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Repayment Security ID" name="repayment_security_id" value={formData.repayment_security_id} onChange={handleChange} placeholder="Contoh: sec-9876-5432" />
            </div>
            <div>
              <Input label="Jadwal Ke- (Order)" name="schedule_order" type="number" value={formData.schedule_order} onChange={handleChange} placeholder="Contoh: 1" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600">Status Invoice</label>
              <select 
                name="invoice_status" 
                value={formData.invoice_status} 
                onChange={handleChange} 
                className="mt-1 w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-700"
              >
                <option value="UNPAID">UNPAID</option>
                <option value="PARTIAL">PARTIAL</option>
                <option value="PAID">PAID</option>
              </select>
            </div>
            <div>
              <Input label="Tanggal Jatuh Tempo (Schedule Date)" name="schedule_date" type="date" value={formData.schedule_date} onChange={handleChange} />
            </div>
            <div>
              <Input label="Tanggal Invoice" name="invoice_date" type="date" value={formData.invoice_date} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-slate-600">Catatan Invoice</label>
              <textarea 
                name="invoice_notes" 
                value={formData.invoice_notes} 
                onChange={handleChange} 
                rows={2} 
                className="mt-1 w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-700" 
                placeholder="Tulis catatan di sini..."
              />
            </div>
          </div>
        </section>

        {/* Section 2: Komponen Dasar (Pokok & Yield) */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-700 mb-3 uppercase tracking-wider">Komponen Dasar (Rp)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Input label="Sinking Fund (Pokok)" name="invoice_sinking_fund" type="number" value={formData.invoice_sinking_fund} onChange={handleChange} /></div>
            <div><Input label="Yield (Kupon)" name="invoice_yield" type="number" value={formData.invoice_yield} onChange={handleChange} /></div>
            <div><Input label="Actual Loss" name="invoice_actual_loss" type="number" value={formData.invoice_actual_loss} onChange={handleChange} /></div>
            <div><Input label="Penalty" name="invoice_penalty" type="number" value={formData.invoice_penalty} onChange={handleChange} /></div>
          </div>
        </section>

        {/* Section 3: Rincian Biaya (Fee & Tax) */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-700 mb-3 uppercase tracking-wider">Rincian Fee & Pajak (Rp)</h3>
          <div className="grid grid-cols-2 gap-3 border border-slate-100 bg-slate-50/50 p-3 rounded-md">
            <div><Input label="Fee Administration" name="invoice_fee_administration" type="number" value={formData.invoice_fee_administration} onChange={handleChange} /></div>
            <div><Input label="Tax Administration" name="invoice_fee_administration_tax" type="number" value={formData.invoice_fee_administration_tax} onChange={handleChange} /></div>
            
            <div><Input label="Fee Provision" name="invoice_fee_provision" type="number" value={formData.invoice_fee_provision} onChange={handleChange} /></div>
            <div><Input label="Tax Provision" name="invoice_fee_provision_tax" type="number" value={formData.invoice_fee_provision_tax} onChange={handleChange} /></div>
            
            <div><Input label="Fee Platform" name="invoice_fee_platform" type="number" value={formData.invoice_fee_platform} onChange={handleChange} /></div>
            <div><Input label="Tax Platform" name="invoice_fee_platform_tax" type="number" value={formData.invoice_fee_platform_tax} onChange={handleChange} /></div>
            
            <div><Input label="Fee Servicing" name="invoice_fee_servicing" type="number" value={formData.invoice_fee_servicing} onChange={handleChange} /></div>
            <div><Input label="Tax Servicing" name="invoice_fee_servicing_tax" type="number" value={formData.invoice_fee_servicing_tax} onChange={handleChange} /></div>
            
            <div><Input label="Fee Monitoring" name="invoice_fee_monitoring" type="number" value={formData.invoice_fee_monitoring} onChange={handleChange} /></div>
            <div><Input label="Tax Monitoring" name="invoice_fee_monitoring_tax" type="number" value={formData.invoice_fee_monitoring_tax} onChange={handleChange} /></div>
            
            <div><Input label="Fee Other" name="invoice_fee_other" type="number" value={formData.invoice_fee_other} onChange={handleChange} /></div>
            <div><Input label="Tax Other" name="invoice_fee_other_tax" type="number" value={formData.invoice_fee_other_tax} onChange={handleChange} /></div>
          </div>
        </section>
        
        {/* Section 4: Kalkulasi Total */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-700 mb-3 uppercase tracking-wider">Total Tagihan (Rp)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Input label="Total (Base)" name="invoice_total" type="number" value={formData.invoice_total} onChange={handleChange} /></div>
            <div><Input label="Total Pajak (Tax)" name="invoice_total_tax" type="number" value={formData.invoice_total_tax} onChange={handleChange} /></div>
            <div className="col-span-2"><Input label="Total Keseluruhan (With Tax)" name="invoice_total_with_tax" type="number" value={formData.invoice_total_with_tax} onChange={handleChange} /></div>
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
          {isLoading ? 'Menyimpan...' : (initialData?.id ? 'Simpan Perubahan' : 'Tambahkan Jadwal')}
        </button>
      </div>
    </form>
  );
}

// Komponen Helper Mini (Dry Principle)
const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[10px] font-semibold text-slate-600">{label}</label>
    <input 
      className="mt-1 w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-700" 
      {...props} 
    />
  </div>
);