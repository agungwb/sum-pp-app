import React, { useState } from 'react';
import RepaymentSecurityForm from './RepaymentSecurityForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentSecurityService } from '../../services/repaymentSecurityService'; // Sesuaikan path

export default function RepaymentSecurityCreateWrapper() {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleCreateSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setGlobalError(null); 

    try {
      // Panggil API lewat Service
      await repaymentSecurityService.create(formData);
      
      console.log('Data berhasil disimpan');
      closePanel(); // Menutup panel setelah sukses
    } catch (error: any) {
      console.error("Gagal membuat data:", error);
      setGlobalError(
        error?.response?.data?.message || "Terjadi kesalahan saat menyimpan data."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full">
      {globalError && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {globalError}
        </div>
      )}
      <RepaymentSecurityForm 
        onSubmit={handleCreateSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}