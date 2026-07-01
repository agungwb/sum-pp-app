// src/components/repayment/RepaymentReceiptCreateWrapper.tsx
import React, { useState } from 'react';
import RepaymentReceiptForm from './RepaymentReceiptForm';
import { useSidePanel } from '../../context/SidePanelContext'; // Sesuaikan path lo

interface CreateWrapperProps {
  repaymentScheduleId?: string; // Optional: Buat auto-fill ID Jadwal 
}

export default function RepaymentReceiptCreateWrapper({ repaymentScheduleId }: CreateWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // TODO: Ganti logic hit API POST NestJS lu di sini
      console.log('Payload Penerimaan Baru:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi network delay
      
      closePanel(); // Tutup side-panel kalau sukses insert db
    } catch (error) {
      console.error("Gagal membuat penerimaan baru", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mengisi ID Schedule otomatis jika form ini dipanggil dari baris/tabel spesifik
  const initialData = repaymentScheduleId ? { repayment_schedule_id: repaymentScheduleId } : undefined;

  return (
    <RepaymentReceiptForm 
      initialData={initialData}
      onSubmit={handleCreateSubmit} 
      isLoading={isSubmitting} 
    />
  );
}