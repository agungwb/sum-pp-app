// src/components/repayment/RepaymentSecurityForm.tsx
import React, { useState } from 'react';
import { useSidePanel } from '../../context/SidePanelContext'; // Sesuaikan path

interface RepaymentSecurityFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

// State awal kosong untuk form Create
const defaultFormState = {
  investee_id: '', investee_name: '', investee_name_legal: '',
  security_id: '', security_type: 'SUKUK', security_name: '',
  contract_document_title: '', contract_document_number: '', contract_document_url: '',
  contract_underlying_fund: '', contract_start_date: '', contract_end_date: '',
  contract_duration_in_months: '', contract_status: 'PERFORMING',
  contract_yield_amount: '', contract_yield_rate_annually: '',
  contract_fee_administration: '', contract_fee_provision: '', contract_fee_platform: '',
  contract_fee_servicing: '', contract_fee_servicing_percentage: '',
  contract_fee_monitoring: '', contract_fee_monitoring_percentage_monthly: '',
  contract_penalty_percentage_daily: '', contract_tax_ppn: '', contract_tax_yield: ''
};

export default function RepaymentSecurityForm({ initialData, onSubmit, isLoading }: RepaymentSecurityFormProps) {
  const { closePanel } = useSidePanel();
  const [formData, setFormData] = useState(initialData || defaultFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
      
      {/* Header (Fixed Atas) */}
      <div className="border-b border-slate-200 p-5 bg-white shrink-0">
        <h2 className="text-sm font-bold text-slate-800">
          {initialData ? 'Edit Data Repayment Security' : 'Tambah Repayment Security Baru'}
        </h2>
        <p className="text-[11px] text-slate-500 mt-1">
          {initialData 
            ? 'Perbarui informasi dan parameter kontrak dari repayment security ini.' 
            : 'Lengkapi formulir di bawah ini untuk mendaftarkan kontrak repayment security baru.'}
        </p>
      </div>

      {/* Area Tengah (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* GROUP 1: Informasi Investee */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b pb-1">Informasi Investee</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Input label="Investee ID" name="investee_id" value={formData.investee_id} onChange={handleChange} /></div>
            <div><Input label="Nama Investee" name="investee_name" value={formData.investee_name} onChange={handleChange} /></div>
            <div><Input label="Nama Legal" name="investee_name_legal" value={formData.investee_name_legal} onChange={handleChange} /></div>
          </div>
        </section>

        {/* GROUP 2: Informasi Security */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b pb-1">Informasi Efek / Security</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Input label="Security ID" name="security_id" value={formData.security_id} onChange={handleChange} /></div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Tipe Security</label>
              <select name="security_type" value={formData.security_type} onChange={handleChange} className="w-full text-xs p-2 border border-slate-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all">
                <option value="SUKUK">Sukuk</option>
                <option value="SAHAM">Saham</option>
              </select>
            </div>
            <div><Input label="Nama Security" name="security_name" value={formData.security_name} onChange={handleChange} /></div>
          </div>
        </section>

        {/* GROUP 3: Dokumen Kontrak */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b pb-1">Dokumen Kontrak</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Input label="Judul Dokumen" name="contract_document_title" value={formData.contract_document_title} onChange={handleChange} /></div>
            <div><Input label="Nomor Dokumen" name="contract_document_number" value={formData.contract_document_number} onChange={handleChange} /></div>
            <div className="col-span-2"><Input label="URL Dokumen" name="contract_document_url" type="url" value={formData.contract_document_url} onChange={handleChange} /></div>
          </div>
        </section>

        {/* GROUP 4: Nilai Pendanaan & Tenor */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b pb-1">Nilai & Tenor</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Input label="Nilai Pendanaan (Rp)" name="contract_underlying_fund" type="number" value={formData.contract_underlying_fund} onChange={handleChange} /></div>
            <div><Input label="Tanggal Mulai" name="contract_start_date" type="date" value={formData.contract_start_date} onChange={handleChange} /></div>
            <div><Input label="Tanggal Berakhir" name="contract_end_date" type="date" value={formData.contract_end_date} onChange={handleChange} /></div>
            <div><Input label="Durasi (Bulan)" name="contract_duration_in_months" type="number" value={formData.contract_duration_in_months} onChange={handleChange} /></div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Status Kontrak</label>
              <select name="contract_status" value={formData.contract_status} onChange={handleChange} className="w-full text-xs p-2 border border-slate-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all">
                <option value="PERFORMING">Performing</option>
                <option value="OBSERVATION">Observation</option>
                <option value="DEFAULTED">Defaulted</option>
              </select>
            </div>
          </div>
        </section>

        {/* GROUP 5: Yield & Denda */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b pb-1">Yield & Denda</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Input label="Nominal Yield (Rp)" name="contract_yield_amount" type="number" value={formData.contract_yield_amount} onChange={handleChange} /></div>
            <div><Input label="Yield Rate Tahunan (%)" name="contract_yield_rate_annually" type="number" step="0.01" value={formData.contract_yield_rate_annually} onChange={handleChange} /></div>
            <div className="col-span-2"><Input label="Persentase Denda Harian (%)" name="contract_penalty_percentage_daily" type="number" step="0.01" value={formData.contract_penalty_percentage_daily} onChange={handleChange} /></div>
          </div>
        </section>

        {/* GROUP 6: Struktur Biaya (Fee) */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b pb-1">Struktur Biaya</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Input label="Fee Administrasi" name="contract_fee_administration" type="number" value={formData.contract_fee_administration} onChange={handleChange} /></div>
            <div><Input label="Fee Provisi" name="contract_fee_provision" type="number" value={formData.contract_fee_provision} onChange={handleChange} /></div>
            <div><Input label="Fee Platform" name="contract_fee_platform" type="number" value={formData.contract_fee_platform} onChange={handleChange} /></div>
            <div><Input label="Fee Servicing (Rp)" name="contract_fee_servicing" type="number" value={formData.contract_fee_servicing} onChange={handleChange} /></div>
            <div><Input label="Fee Servicing (%)" name="contract_fee_servicing_percentage" type="number" step="0.01" value={formData.contract_fee_servicing_percentage} onChange={handleChange} /></div>
            <div><Input label="Fee Monitoring (Rp)" name="contract_fee_monitoring" type="number" value={formData.contract_fee_monitoring} onChange={handleChange} /></div>
            <div><Input label="Fee Monitoring (%)" name="contract_fee_monitoring_percentage_monthly" type="number" step="0.01" value={formData.contract_fee_monitoring_percentage_monthly} onChange={handleChange} /></div>
          </div>
        </section>

        {/* GROUP 7: Pajak */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b pb-1">Pajak</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Input label="Pajak PPN (Rp)" name="contract_tax_ppn" type="number" value={formData.contract_tax_ppn} onChange={handleChange} /></div>
            <div><Input label="Pajak Yield (Rp)" name="contract_tax_yield" type="number" value={formData.contract_tax_yield} onChange={handleChange} /></div>
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
          {isLoading ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Tambahkan Data')}
        </button>
      </div>
    </form>
  );
}

// Komponen Input Mini 
const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
    <input 
      {...props} 
      className="w-full text-xs p-2 border border-slate-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-300" 
    />
  </div>
);