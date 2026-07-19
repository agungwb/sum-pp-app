import React, { useState, useEffect } from 'react';
import SecurityCollateralForm from './SecurityCollateralForm';
import { securityCollateralService } from '../../services/securityCollateralService';
import { SecurityCollateralFormRequest } from '../../dtos/security-collateral.dto';
import { useSidePanel } from '../../../../contexts/SidePanelContext'; // Sesuaikan
import { RepaymentSecuritySummaryResponse } from '../../../repayment-security/dtos/repayment-security.dto';

interface EditWrapperProps {
  collateralId: string;
  repaymentSecuritySummary: RepaymentSecuritySummaryResponse;
}

export default function SecurityCollateralEditWrapper({ collateralId, repaymentSecuritySummary }: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<SecurityCollateralFormRequest | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await securityCollateralService.getCollateralsByRepaymentSecurityId(repaymentSecuritySummary.id);
        const collateralData = response.data.items.find(item => item.id === collateralId);
        
        if (collateralData) {
          const requestData: SecurityCollateralFormRequest = {
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
  }, [repaymentSecuritySummary.id, collateralId]);

  const handleEditSubmit = async (formData: SecurityCollateralFormRequest) => {
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