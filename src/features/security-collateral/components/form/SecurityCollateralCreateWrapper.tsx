import React, { useState } from 'react';
import SecurityCollateralForm from './SecurityCollateralForm';
import { securityCollateralService } from '../../services/securityCollateralService';
import { SecurityCollateralRequest } from '../../dtos/security-collateral.dto';
import { CollateralType, CollateralStatus, VerificationStatus } from '../../types/security-collateral.enum';
import { useSidePanel } from '../../../../contexts/SidePanelContext'; // Sesuaikan

interface CreateWrapperProps {
  repaymentSecurityId: string;
}

export default function SecurityCollateralCreateWrapper({ repaymentSecurityId }: CreateWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialData: SecurityCollateralRequest = {
    repaymentSecurityId: securityId,
    collateralType: CollateralType.INVOICE,
    collateralDescription: '',
    collateralValueEstimated: '0',
    collateralStatus: CollateralStatus.IDLE,
    executionTime: '',
    documentUrl: '',
    
    verificationDocumentStatus: VerificationStatus.SUBMITTED,
    verificationDocumentNotes: '',
    verificationDocumentBy: '',
    verificationDocumentAt: '',
    
    verificationFieldStatus: VerificationStatus.SUBMITTED,
    verificationFieldNotes: '',
    verificationFieldBy: '',
    verificationFieldAt: '',
    
    verificationLegalStatus: VerificationStatus.SUBMITTED,
    verificationLegalNotes: '',
    verificationLegalBy: '',
    verificationLegalAt: '',
    
    verificationValueStatus: VerificationStatus.SUBMITTED,
    verificationValueNotes: '',
    verificationValueBy: '',
    verificationValueAt: ''
  };

  const handleCreateSubmit = async (formData: SecurityCollateralRequest) => {
    setIsSubmitting(true);
    try {
      if (!repaymentSecurityId) throw new Error("Security ID tidak ditemukan");
      await securityCollateralService.createCollateral(repaymentSecurityId, formData);
      closePanel();
    } catch (error) {
      console.error("Gagal membuat kolateral baru", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SecurityCollateralForm 
      mode="add"
      initialData={initialData}
      onSubmit={handleCreateSubmit} 
      isLoading={isSubmitting} 
    />
  );
}