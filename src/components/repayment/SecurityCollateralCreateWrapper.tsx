// src/components/repayment/SecurityCollateralCreateWrapper.tsx
import React, { useState } from 'react';
import SecurityCollateralForm from './SecurityCollateralForm';
import { useSidePanel } from '../../context/SidePanelContext'; // Sesuaikan path

interface CreateWrapperProps {
  collateralId?: string; // Optional: Buat auto-fill ID parent kontraknya
}

export default function SecurityCollateralCreateWrapper({ collateralId }: CreateWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // TODO: Ganti dengan logic hit API POST NestJS lu di sini
      console.log('Payload Kolateral Baru:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi network delay
      
      closePanel(); // Tutup panel sukses
    } catch (error) {
      console.error("Gagal membuat kolateral baru", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto inject foreign key ID jika form dipanggil dari tabel kontrak spesifik
  const initialData = collateralId ? { repayment_security_id: collateralId } : undefined;

  return (
    <SecurityCollateralForm 
      initialData={initialData}
      onSubmit={handleCreateSubmit} 
      isLoading={isSubmitting} 
    />
  );
}