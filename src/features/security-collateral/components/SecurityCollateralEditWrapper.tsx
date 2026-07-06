// src/components/repayment/SecurityCollateralEditWrapper.tsx
import React, { useState, useEffect } from 'react';
import SecurityCollateralForm from './SecurityCollateralForm';
import { useSidePanel } from '../../../contexts/SidePanelContext'; // Sesuaikan path

interface EditWrapperProps {
  collateralId: string;
}

export default function SecurityCollateralEditWrapper({ collateralId }: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    // Simulasi fetch data dari endpoint /security-collaterals/:collateralId
    const fetchDummyData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay loading spinner/text
      
      // Data dummy menyesuaikan field yang diminta
      setInitialData({
        id: collateralId,
        repayment_security_id: 'sec-8899-0011',
        collateral_type: 'CEK_MUNDUR',
        collateral_description: 'Cek Mundur Bank BCA No. 882934 atas nama PT. Solusi Teknologi Digital',
        collateral_value_estimated: '4500000000',
        collateral_status: 'HELD_BY_PLATFORM',
        execution_time: '',
        document_url: 'https://storage.xflow.com/collateral/CEK_MUNDUR_398.pdf',
        
        verification_document_status: 'VERIFIED',
        verification_document_notes: 'Dokumen Asli Lengkap',
        verification_document_by: 'risk_agent_1',
        verification_document_at: '2026-06-22T22:57', // Format YYYY-MM-DDThh:mm aman utk input datetime-local
        
        verification_field_status: 'VERIFIED',
        verification_field_notes: 'Kondisi Fisik Sesuai',
        verification_field_by: 'risk_agent_1',
        verification_field_at: '2026-06-22T22:57',
        
        verification_legal_status: 'VERIFIED',
        verification_legal_notes: 'Legalitas clean and clear',
        verification_legal_by: 'legal_agent_1',
        verification_legal_at: '2026-06-23T10:00',
        
        verification_value_status: 'VERIFIED',
        verification_value_notes: 'Sesuai dengan appraisal independen',
        verification_value_by: 'risk_agent_2',
        verification_value_at: '2026-06-24T14:30'
      });
    };

    fetchDummyData();
  }, [collateralId]);

  const handleEditSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // TODO: Ganti logic hit API PUT/PATCH NestJS
      console.log('Update Kolateral ID:', collateralId, 'Payload:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      closePanel();
    } catch (error) {
      console.error("Gagal update kolateral", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialData) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-white">
        <p className="text-sm text-slate-500 animate-pulse">Memuat data kolateral...</p>
      </div>
    );
  }

  return (
    <SecurityCollateralForm 
      initialData={initialData}
      onSubmit={handleEditSubmit} 
      isLoading={isSubmitting} 
    />
  );
}