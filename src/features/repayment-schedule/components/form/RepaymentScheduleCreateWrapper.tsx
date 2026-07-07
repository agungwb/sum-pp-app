// src/components/repayment/RepaymentScheduleCreateWrapper.tsx
import React, { useState } from 'react';
import RepaymentScheduleForm from './RepaymentScheduleForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';

interface CreateWrapperProps {
  repaymentSecurityId?: string; // Optional: Lempar ID contract jika di-klik dari halaman detail
}

export default function RepaymentScheduleCreateWrapper({ repaymentSecurityId }: CreateWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Logic nge-hit API POST ntar disini
      console.log('Payload Jadwal Baru:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi network delay
      
      closePanel(); // Tutup jika sukses
    } catch (error) {
      console.error("Gagal membuat jadwal baru", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mengisikan initialData securityId jika dilempar dari page detail (biar otomatis terisi)
  const initialData = repaymentSecurityId ? { repayment_security_id: repaymentSecurityId } : undefined;

  return (
    <RepaymentScheduleForm 
      initialData={initialData}
      onSubmit={handleCreateSubmit} 
      isLoading={isSubmitting} 
    />
  );
}