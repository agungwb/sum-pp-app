import React, { useState } from 'react';
import SecurityCollateralForm from './SecurityCollateralForm';
import { securityCollateralService } from '../../services/securityCollateralService';
import { SecurityCollateralFormRequest } from '../../dtos/security-collateral.dto';
import { CollateralType, CollateralStatus, VerificationStatus } from '../../types/security-collateral.enum';
import { useSidePanel } from '../../../../contexts/SidePanelContext'; // Sesuaikan
import { RepaymentSecuritySummaryResponse } from '../../../repayment-security/dtos/repayment-security.dto';

interface CreateWrapperProps {
  repaymentSecuritySummary : RepaymentSecuritySummaryResponse;
}

export default function SecurityCollateralCreateWrapper({ repaymentSecuritySummary }: CreateWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialData: SecurityCollateralFormRequest = {
    repaymentSecurityId: repaymentSecuritySummary.id,
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

  const handleCreateSubmit = async (formData: SecurityCollateralFormRequest) => {
    setIsSubmitting(true);
    try {
      if (!repaymentSecuritySummary.id) throw new Error("Security ID tidak ditemukan");
      await securityCollateralService.createCollateral(repaymentSecuritySummary.id, formData);
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