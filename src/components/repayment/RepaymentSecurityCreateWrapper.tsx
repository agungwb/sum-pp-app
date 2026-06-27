// src/components/repayment/RepaymentSecurityCreateWrapper.tsx
import React, { useState } from 'react';
import RepaymentSecurityForm from './RepaymentSecurityForm';
import { useSidePanel } from '../../context/SidePanelContext';

export default function RepaymentSecurityCreateWrapper() {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      console.log('Create Data Baru Payload:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi network delay
      
      closePanel();
    } catch (error) {
      console.error("Gagal membuat data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RepaymentSecurityForm 
      onSubmit={handleCreateSubmit} 
      isLoading={isSubmitting} 
    />
  );
}