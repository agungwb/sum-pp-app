import React, { useState } from 'react';
import { SecurityCollateralRequest } from '../../dtos/security-collateral.dto';
import { CollateralType, CollateralStatus, VerificationStatus } from '../../types/security-collateral.enum';

// Sesuaikan path import komponen UI di bawah ini dengan struktur folder Anda
import { NumericInput, FormGroup, ConfirmModal, Select, Input, NumberField, Toggle, TextArea } from '../../../../components/forms/index';
import { formatDateForInput } from '../../../../utils/date';

type TabType = 'document' | 'legal' | 'field' | 'value';

interface SecurityCollateralFormProps {
  mode: 'add' | 'edit';
  initialData: SecurityCollateralRequest;
  onSubmit: (data: SecurityCollateralRequest) => void;
  isLoading?: boolean;
}

export default function SecurityCollateralForm({ mode, initialData, onSubmit, isLoading }: SecurityCollateralFormProps) {
  const [formData, setFormData] = useState<SecurityCollateralRequest>(initialData);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('document'); // State untuk fitur Tab

  const handleChange = (field: keyof SecurityCollateralRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleChange('documentUrl', e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const confirmSubmit = () => {
    setIsConfirmModalOpen(false);
    onSubmit(formData);
  };

  // Helper untuk me-render Group Verifikasi secara dinamis sesuai active tab
  const renderVerificationGroup = (group: 'Document' | 'Legal' | 'Field' | 'Value', title: string) => (
    <FormGroup title={`Verifikasi ${title}`} colRatio="1:1">
      <Input 
        label="Waktu Verifikasi" 
        type="date" 
        value={formatDateForInput(formData[`verification${group}At` as keyof SecurityCollateralRequest] || '')} 
        onChange={(e: any) => handleChange(`verification${group}At` as keyof SecurityCollateralRequest, e.target.value)} 
      />
  
      <Input 
        label="Diverifikasi Oleh" 
        type="text" 
        value={formData[`verification${group}By` as keyof SecurityCollateralRequest] || ''} 
        onChange={(e: any) => handleChange(`verification${group}By` as keyof SecurityCollateralRequest, e.target.value)} 
      />
      <Select 
        label="Status Verifikasi" 
        value={formData[`verification${group}Status` as keyof SecurityCollateralRequest] || ''} 
        onChange={(e: any) => handleChange(`verification${group}Status` as keyof SecurityCollateralRequest, e.target.value)}
      >
        <option value="">-- Pilih Status --</option>
        {Object.values(VerificationStatus).map(status => (
          <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
        ))}
      </Select>

      <TextArea 
        label="Catatan" 
        colSpan="1" 
        value={formData[`verification${group}Notes` as keyof SecurityCollateralRequest] || ''} 
        onChange={(e: any) => handleChange(`verification${group}Notes` as keyof SecurityCollateralRequest, e.target.value)} 
      />
    </FormGroup>
  );

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex flex-col h-full bg-white">
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* BAGIAN INFORMASI UTAMA: TIDAK ADA YANG DIUBAH */}
          <FormGroup title="Informasi Utama Kolateral" colRatio="1:1">
            <Select 
              label="Tipe Kolateral" 
              value={formData.collateralType} 
              onChange={(e: any) => handleChange('collateralType', e.target.value)}
            >
              <option value="">-- Pilih Tipe --</option>
              {Object.values(CollateralType).map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </Select>
            <Select 
              label="Status Kolateral" 
              value={formData.collateralStatus} 
              onChange={(e: any) => handleChange('collateralStatus', e.target.value)}
            >
              <option value="">-- Pilih Status --</option>
              {Object.values(CollateralStatus).map(status => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </Select>

            <div className="col-span-2">
               <label className="block text-[10px] font-semibold text-slate-600 mb-1">Upload Dokumen (PDF/JPG/PNG)</label>
               <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 border border-slate-200 rounded-md"
               />
               {typeof formData.documentUrl === 'string' && formData.documentUrl !== '' && (
                 <p className="text-[10px] text-blue-500 mt-1 hover:underline">
                   <a href={formData.documentUrl} target="_blank" rel="noreferrer">Lihat dokumen saat ini</a>
                 </p>
               )}
            </div>
            
            <TextArea 
              label="Deskripsi Kolateral" 
              colSpan="2" 
              value={formData.collateralDescription || ''} 
              onChange={(e: any) => handleChange('collateralDescription', e.target.value)} 
              placeholder="Jelaskan kondisi, letak, ukuran, dll..." 
            />
            <NumberField 
              label="Estimasi Nilai Kolateral" 
              value={Number(formData.collateralValueEstimated)} 
              onValueChange={(val: number) => handleChange('collateralValueEstimated', val.toString())} 
            />
            <Input 
              label="Waktu Eksekusi" 
              type="date" 
              value={formatDateForInput(formData.executionTime || '')} 
              onChange={(e: any) => handleChange('executionTime', e.target.value)} 
            />
          </FormGroup>

          {/* TAB MENU VERIFIKASI */}
          <div className="mt-8 border-b border-slate-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {[
                { id: 'document', label: 'Dokumen' },
                { id: 'legal', label: 'Legal' },
                { id: 'field', label: 'Lapangan' },
                { id: 'value', label: 'Nilai' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-xs transition-colors focus:outline-none
                    ${activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* TAB CONTENTS (RENDER KONDISIONAL) */}
          <div className="mt-6">
            {activeTab === 'document' && renderVerificationGroup('Document', 'Dokumen')}
            {activeTab === 'legal' && renderVerificationGroup('Legal', 'Legal')}
            {activeTab === 'field' && renderVerificationGroup('Field', 'Lapangan')}
            {activeTab === 'value' && renderVerificationGroup('Value', 'Nilai')}
          </div>

        </div>

        <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-4 py-2 text-xs font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : (mode === 'edit' ? 'Simpan Perubahan' : 'Tambahkan Kolateral')}
          </button>
        </div>
      </form>

      <ConfirmModal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmSubmit}
        title="Konfirmasi Penyimpanan"
        message="Apakah Anda yakin ingin menyimpan data kolateral ini?"
      />
    </>
  );
}