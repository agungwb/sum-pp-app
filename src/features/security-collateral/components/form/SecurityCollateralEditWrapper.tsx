import React, { useState, useEffect } from 'react';
import SecurityCollateralForm from './SecurityCollateralForm';
import { securityCollateralService } from '../../services/securityCollateralService';
import { SecurityCollateralRequest } from '../../dtos/security-collateral.dto';
import { useSidePanel } from '../../../../contexts/SidePanelContext'; // Sesuaikan

interface EditWrapperProps {
  securityId: string;
  collateralId: string;
}

export default function SecurityCollateralEditWrapper({ securityId, collateralId }: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<SecurityCollateralRequest | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await securityCollateralService.getCollateralsBySecurityId(securityId);
        const collateralData = response.data.items.find(item => item.id === collateralId);
        
        if (collateralData) {
          const requestData: SecurityCollateralRequest = {
            repaymentSecurityId: collateralData.repaymentSecurityId,
            collateralType: collateralData.collateralType || 'INVOICE',
            collateralDescription: collateralData.collateralDescription || '',
            collateralValueEstimated: collateralData.collateralValueEstimated || '0',
            collateralStatus: collateralData.collateralStatus || 'IDLE',
            executionTime: collateralData.executionTime ? collateralData.executionTime.split('T')[0] : '', 
            documentUrl: collateralData.documentUrl || '',
            
            verificationDocumentStatus: collateralData.verificationDocumentStatus || 'SUBMITTED',
            verificationDocumentNotes: collateralData.verificationDocumentNotes || '',
            verificationDocumentBy: collateralData.verificationDocumentBy || '',
            verificationDocumentAt: collateralData.verificationDocumentAt ? collateralData.verificationDocumentAt.slice(0, 16) : '',
            
            verificationFieldStatus: collateralData.verificationFieldStatus || 'SUBMITTED',
            verificationFieldNotes: collateralData.verificationFieldNotes || '',
            verificationFieldBy: collateralData.verificationFieldBy || '',
            verificationFieldAt: collateralData.verificationFieldAt ? collateralData.verificationFieldAt.slice(0, 16) : '',
            
            verificationLegalStatus: collateralData.verificationLegalStatus || 'SUBMITTED',
            verificationLegalNotes: collateralData.verificationLegalNotes || '',
            verificationLegalBy: collateralData.verificationLegalBy || '',
            verificationLegalAt: collateralData.verificationLegalAt ? collateralData.verificationLegalAt.slice(0, 16) : '',
            
            verificationValueStatus: collateralData.verificationValueStatus || 'SUBMITTED',
            verificationValueNotes: collateralData.verificationValueNotes || '',
            verificationValueBy: collateralData.verificationValueBy || '',
            verificationValueAt: collateralData.verificationValueAt ? collateralData.verificationValueAt.slice(0, 16) : ''
          };
          setInitialData(requestData);
        }
      } catch (error) {
        console.error("Gagal menarik data kolateral", error);
      }
    };
    fetchData();
  }, [securityId, collateralId]);

  const handleEditSubmit = async (formData: SecurityCollateralRequest) => {
    setIsSubmitting(true);
    try {
      await securityCollateralService.updateCollateral(collateralId, formData);
      closePanel();
    } catch (error) {
      console.error("Gagal update kolateral", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialData) {
    return <div className="flex items-center justify-center h-full w-full text-xs text-slate-500">Memuat data...</div>;
  }

  return (
    <SecurityCollateralForm 
      mode="edit"
      initialData={initialData}
      onSubmit={handleEditSubmit} 
      isLoading={isSubmitting} 
    />
  );
}