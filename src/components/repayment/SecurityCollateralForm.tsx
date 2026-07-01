// src/components/repayment/SecurityCollateralForm.tsx
import React, { useState, useEffect } from 'react';
import { useSidePanel } from '../../context/SidePanelContext'; // Sesuaikan path lo

interface SecurityCollateralFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

// State awal form kosong
const defaultFormState = {
  id: '',
  repayment_security_id: '',
  collateral_type: 'CEK_MUNDUR', 
  collateral_description: '',
  collateral_value_estimated: '',
  collateral_status: 'HELD_BY_PLATFORM',
  execution_time: '',
  document_url: '',
  
  verification_document_status: 'SUBMITTED',
  verification_document_notes: '',
  verification_document_by: '',
  verification_document_at: '',
  
  verification_field_status: 'SUBMITTED',
  verification_field_notes: '',
  verification_field_by: '',
  verification_field_at: '',
  
  verification_legal_status: 'SUBMITTED',
  verification_legal_notes: '',
  verification_legal_by: '',
  verification_legal_at: '',
  
  verification_value_status: 'SUBMITTED',
  verification_value_notes: '',
  verification_value_by: '',
  verification_value_at: ''
};

export default function SecurityCollateralForm({ initialData, onSubmit, isLoading }: SecurityCollateralFormProps) {
  const { closePanel } = useSidePanel();
  const [formData, setFormData] = useState(defaultFormState);

  // Auto-fill state kalau ada initialData (Mode Edit / Inject ID)
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
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
    <form onSubmit={handleSubmit} className="h-full w-full flex flex-col bg-white">
      {/* Header (Fixed Atas) */}
      <div className="shrink-0 border-b border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-800">
          {initialData?.id ? 'Edit Data Kolateral' : 'Tambah Kolateral Baru'}
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Pastikan semua informasi aset jaminan dan hasil verifikasi diisi dengan benar.
        </p>
      </div>

      {/* Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        <section>
          <h3 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">Informasi Jaminan</h3>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipe Kolateral" name="collateral_type" value={formData.collateral_type} onChange={handleChange}>
              <option value="CEK_MUNDUR">Cek Mundur</option>
              <option value="PERSONAL_GUARANTEE">Personal Guarantee</option>
              <option value="CORPORATE_GUARANTEE">Corporate Guarantee</option>
              <option value="FIXED_ASSET">Fixed Asset / Tanah & Bangunan</option>
            </Select>
            <Select label="Status Kolateral" name="collateral_status" value={formData.collateral_status} onChange={handleChange}>
              <option value="HELD_BY_PLATFORM">Ditahan Platform</option>
              <option value="RETURNED">Dikembalikan</option>
              <option value="EXECUTED">Dieksekusi</option>
            </Select>
            <div className="col-span-2">
              <Textarea label="Deskripsi Kolateral" name="collateral_description" value={formData.collateral_description} onChange={handleChange} rows={2} />
            </div>
            <Input label="Estimasi Nilai (Rp)" name="collateral_value_estimated" type="number" value={formData.collateral_value_estimated} onChange={handleChange} />
            <Input label="Waktu Eksekusi (Opsional)" name="execution_time" type="datetime-local" value={formData.execution_time} onChange={handleChange} />
            <div className="col-span-2">
              <Input label="URL Dokumen Jaminan" name="document_url" type="url" value={formData.document_url} onChange={handleChange} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">Verifikasi Dokumen</h3>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status Verifikasi Dokumen" name="verification_document_status" value={formData.verification_document_status} onChange={handleChange}>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </Select>
            <Input label="Diverifikasi Oleh" name="verification_document_by" type="text" value={formData.verification_document_by} onChange={handleChange} />
            <div className="col-span-2">
              <Input label="Waktu Verifikasi Dokumen" name="verification_document_at" type="datetime-local" value={formData.verification_document_at} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Textarea label="Catatan Verifikasi Dokumen" name="verification_document_notes" value={formData.verification_document_notes} onChange={handleChange} rows={2} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">Verifikasi Lapangan (Field)</h3>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status Verifikasi Lapangan" name="verification_field_status" value={formData.verification_field_status} onChange={handleChange}>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </Select>
            <Input label="Diverifikasi Oleh" name="verification_field_by" type="text" value={formData.verification_field_by} onChange={handleChange} />
            <div className="col-span-2">
              <Input label="Waktu Verifikasi Lapangan" name="verification_field_at" type="datetime-local" value={formData.verification_field_at} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Textarea label="Catatan Verifikasi Lapangan" name="verification_field_notes" value={formData.verification_field_notes} onChange={handleChange} rows={2} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">Verifikasi Legal</h3>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status Verifikasi Legal" name="verification_legal_status" value={formData.verification_legal_status} onChange={handleChange}>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </Select>
            <Input label="Diverifikasi Oleh" name="verification_legal_by" type="text" value={formData.verification_legal_by} onChange={handleChange} />
            <div className="col-span-2">
              <Input label="Waktu Verifikasi Legal" name="verification_legal_at" type="datetime-local" value={formData.verification_legal_at} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Textarea label="Catatan Verifikasi Legal" name="verification_legal_notes" value={formData.verification_legal_notes} onChange={handleChange} rows={2} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">Verifikasi Nilai (Value)</h3>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status Verifikasi Nilai" name="verification_value_status" value={formData.verification_value_status} onChange={handleChange}>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </Select>
            <Input label="Diverifikasi Oleh" name="verification_value_by" type="text" value={formData.verification_value_by} onChange={handleChange} />
            <div className="col-span-2">
              <Input label="Waktu Verifikasi Nilai" name="verification_value_at" type="datetime-local" value={formData.verification_value_at} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Textarea label="Catatan Verifikasi Nilai" name="verification_value_notes" value={formData.verification_value_notes} onChange={handleChange} rows={2} />
            </div>
          </div>
        </section>
        
      </div>

      {/* Footer (Fixed Bawah) */}
      <div className="shrink-0 border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3">
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
          {isLoading ? 'Menyimpan...' : (initialData?.id ? 'Simpan Perubahan' : 'Tambahkan Kolateral')}
        </button>
      </div>
    </form>
  );
}

// Helper Components (DRY)
const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[10px] font-medium text-slate-500 mb-1">{label}</label>
    <input 
      {...props} 
      className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" 
    />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div>
    <label className="block text-[10px] font-medium text-slate-500 mb-1">{label}</label>
    <select 
      {...props} 
      className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
    >
      {children}
    </select>
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[10px] font-medium text-slate-500 mb-1">{label}</label>
    <textarea 
      {...props} 
      className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" 
    />
  </div>
);