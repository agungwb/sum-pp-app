import React, { useState } from 'react';
import RepaymentSecurityForm from './RepaymentSecurityForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentSecurityService } from '../../services/repaymentSecurityService'; // Sesuaikan path
import { RepaymentSecurityFormRequest } from '../../dtos/repayment-security.dto';
import { SecurityType } from '../../types/repayment-security.enum';



export default function RepaymentSecurityCreateWrapper() {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const repaymentSecurityData : RepaymentSecurityFormRequest = {
    investeeId: '',
    investeeName: '',
    investeeNameLegal: '',
    investeeIconUrl: '',
    securityId: '',
    securityType: null,
    securityName: '',
    securityCode: '',
    securitySeries: null,
    securityPhase: null,
    securitySequence: null,
    
    contractStartDate: '',
    contractEndDate: '',
    contractDurationInMonths: 0,
    contractStatus: null,
    
    contractUnderlyingFund: '',
    contractYieldAmount: '',
    contractYieldRateAnnually: '',
    contractFeeAdministration: '',
    contractFeeAdministrationPercentage: '',
    contractFeeProvision: '',
    contractFeeProvisionPercentage: '',
    contractFeePlatform: '',
    contractFeePlatformPercentage: '',
    contractFeeServicing: '',
    contractFeeServicingPercentage: '',
    contractFeeMonitoringMonthly: '',
    contractFeeMonitoringPercentageMonthly: '',
    contractFeeMonitoring: '',
    contractFeeMonitoringPercentage: '',

    contractTaxPpn: '',
    contractTaxFactor: '',
    contractTaxYield: '',
    contractPenaltyPercentageDaily: '',
    
    contractEscrowBank: '',
    contractEscrowAccount: '',
    contractVaBank: '',
    contractVaNumber: '',
    contractContactEmail: '',
    contractContactWhatsapp: '',
    
    contractDocumentTitle: '',
    contractDocumentNumber: '',
    contractDocumentUrl: null,
    restructOrder: 0,
    restructParentSecurityId: null,
    restructOriginalSecurityId:  null,

    scheduleUpfrontFlag: true,
    scheduleUpfrontDate: '',
    scheduleInstallmentFlag: true,
    scheduleInstallmentDate: '',
  }

  const handleCreateSubmit = async (formData: RepaymentSecurityFormRequest) => {
    setIsSubmitting(true);
    setGlobalError(null); 

    const payloadData : RepaymentSecurityFormRequest = {
      ...formData,
      securityType: formData.securityType === '' ? null : formData.securityType,
      contractStatus: formData.contractStatus === '' ? null : formData.contractStatus,
    };

    try {
      // Panggil API lewat Service
      await repaymentSecurityService.createRepaymentSecurity(payloadData);
      
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
        mode='add'
        initialData={repaymentSecurityData}
        onSubmit={handleCreateSubmit} 
        onCancel={closePanel} 
        isLoading={isSubmitting}
      />
    </div>
  );
}