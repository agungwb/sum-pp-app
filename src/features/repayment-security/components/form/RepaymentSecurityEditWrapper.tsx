import React, { useState, useEffect } from 'react';
import RepaymentSecurityForm from './RepaymentSecurityForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentSecurityService } from '../../services/repaymentSecurityService'; // Sesuaikan path
import { RepaymentSecurityEditFormResponse, RepaymentSecurityFormRequest } from '../../dtos/repayment-security.dto';
import { formatDateForInput } from '../../../../utils/date';
import { Big } from 'big.js';

interface EditWrapperProps {
  repaymentId: string;
}

export default function RepaymentSecurityEditWrapper({ repaymentId }: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<RepaymentSecurityFormRequest | null>(null);
  const [errorFetch, setErrorFetch] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrorFetch(null);
        // Memanggil API GET lewat Service
        const response = await repaymentSecurityService.getRepaymentSecurityEditForm(repaymentId);

        // console.log('[RepaymentSecurityEditWrapper] response : ',response);

        if (response.data && response.data.item) {

          const repaymentSecurityRes = response.data.item;

          const durationInmonths = Number (repaymentSecurityRes?.contractDurationInMonths || 0);
          const underlyingFund = new Big(repaymentSecurityRes?.contractUnderlyingFund || '0');
          const yieldAmount = new Big(repaymentSecurityRes?.contractYieldAmount || '0');
          const yieldRateAnnually = new Big(repaymentSecurityRes?.contractYieldRateAnnually || '0').times(100);
          const feeAdministration = new Big(repaymentSecurityRes?.contractFeeAdministration || '0');
          const feeAdministrationPercentage = new Big(repaymentSecurityRes?.contractFeeAdministrationPercentage || '0').times(100);
          const feeProvision = new Big(repaymentSecurityRes?.contractFeeProvision || '0');
          const feeProvisionPercentage = new Big(repaymentSecurityRes?.contractFeeProvisionPercentage || '0').times(100);
          const feePlatform = new Big(repaymentSecurityRes?.contractFeePlatform || '0');
          const feePlatformPercentage = new Big(repaymentSecurityRes?.contractFeePlatformPercentage || '0').times(100);
          const feeServicing = new Big(repaymentSecurityRes?.contractFeeServicing || '0');
          const feeServicingPercentage = new Big(repaymentSecurityRes?.contractFeeServicingPercentage || '0').times(100);
          const feeMonitoring = new Big(repaymentSecurityRes?.contractFeeMonitoring || '0');
          const feeMonitoringPercentageMonthly = new Big(repaymentSecurityRes?.contractFeeMonitoringPercentageMonthly || '0').times(100);
          const feeMonitoringMonthly = feeMonitoringPercentageMonthly.times(underlyingFund).div(100);
          const feeMonitoringPercentage = feeMonitoringPercentageMonthly.times(durationInmonths);

          const maxPrecision = 2;
          const maxPrecisionPct = 4;

          const currentData: RepaymentSecurityFormRequest = {
            id: repaymentSecurityRes?.id || null, // hidden, null/0 if add mode
            investeeId: repaymentSecurityRes?.investeeId || '',
            investeeName: repaymentSecurityRes?.investeeName || '',
            investeeNameLegal: repaymentSecurityRes?.investeeNameLegal || '',
            investeeIconUrl: repaymentSecurityRes?.investeeIconUrl || '',
            securityId: repaymentSecurityRes?.securityId || '',
            securityType: repaymentSecurityRes?.securityType || '',
            securityName: repaymentSecurityRes?.securityName || '',
            securityCode: repaymentSecurityRes?.securityCode || '',
            securitySeries: repaymentSecurityRes?.securitySeries || 0,
            securityPhase: repaymentSecurityRes?.securityPhase || 0,
            securitySequence: repaymentSecurityRes?.securitySequence || 0,
            
            contractStartDate: formatDateForInput(repaymentSecurityRes?.contractStartDate) || '',
            contractEndDate: formatDateForInput(repaymentSecurityRes?.contractEndDate) || '',
            contractDurationInMonths: repaymentSecurityRes?.contractDurationInMonths || 0,
            contractStatus: repaymentSecurityRes?.contractStatus || '',
            
            contractUnderlyingFund: underlyingFund.round(maxPrecision).toString(),
            contractYieldAmount: yieldAmount.round(maxPrecision).toString(),
            contractYieldRateAnnually: yieldRateAnnually.round(maxPrecisionPct).toString(),
            contractFeeAdministration: feeAdministration.round(maxPrecision).toString(),
            contractFeeAdministrationPercentage: feeAdministrationPercentage.round(maxPrecisionPct).toString(),
            contractFeeProvision: feeProvision.round(maxPrecision).toString(),
            contractFeeProvisionPercentage: feeProvisionPercentage.round(maxPrecisionPct).toString(),
            contractFeePlatform: feePlatform.round(maxPrecision).toString(),
            contractFeePlatformPercentage: feePlatformPercentage.round(maxPrecisionPct).toString(),
            contractFeeServicing: feeServicing.round(maxPrecision).toString(),
            contractFeeServicingPercentage: feeServicingPercentage.round(maxPrecisionPct).toString(),
            contractFeeMonitoringMonthly: feeMonitoringMonthly.round(maxPrecision).toString(),
            contractFeeMonitoringPercentageMonthly: feeMonitoringPercentageMonthly.round(maxPrecisionPct).toString(),
            contractFeeMonitoring: feeMonitoring.round(maxPrecision).toString(),
            contractFeeMonitoringPercentage: feeMonitoringPercentage.round(maxPrecisionPct).toString(),
  
            contractTaxPpn: repaymentSecurityRes?.contractTaxPpn || '',
            contractTaxFactor: repaymentSecurityRes?.contractTaxFactor || '',
            contractTaxYield: repaymentSecurityRes?.contractTaxYield || '',
            contractPenaltyPercentageDaily: repaymentSecurityRes?.contractPenaltyPercentageDaily || '',
            
            contractEscrowBank: repaymentSecurityRes?.contractEscrowBank || '',
            contractEscrowAccount: repaymentSecurityRes?.contractEscrowAccount || '',
            contractVaBank: repaymentSecurityRes?.contractVaBank || '',
            contractVaNumber: repaymentSecurityRes?.contractVaNumber || '',
            contractContactEmail: repaymentSecurityRes?.contractContactEmail || '',
            contractContactWhatsapp: repaymentSecurityRes?.contractContactWhatsapp || '',
            
            contractDocumentTitle: repaymentSecurityRes?.contractDocumentTitle || '',
            contractDocumentNumber: repaymentSecurityRes?.contractDocumentNumber || '',
            contractDocumentUrl: null,
            restructOrder: repaymentSecurityRes?.restructOrder || 0,
            restructParentSecurityId: repaymentSecurityRes?.restructParentSecurityId || null,
            restructOriginalSecurityId: repaymentSecurityRes?.restructOriginalSecurityId || null,
  
            scheduleUpfrontFlag: true,
            scheduleUpfrontDate: '',
            scheduleInstallmentFlag: true,
            scheduleInstallmentDate: '',
            };

            console.log('[RepaymentSecurityEditWrapper] currentData : ',currentData);
          
          setInitialData(currentData);
          
          console.log('[RepaymentSecurityEditWrapper] initialData : ',initialData);

        }
      
      } catch (error: any) {
        console.error("Gagal memuat detail kontrak:", error);
        setErrorFetch(error?.response?.data?.message || "Gagal memuat data dari server.");
      }
    };

    if (repaymentId) {
      fetchData();
    }
  }, [repaymentId]);

  const handleEditSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Memanggil API PUT lewat Service
      await repaymentSecurityService.updateRepaymentSecurity(repaymentId, formData);
      
      closePanel();
    } catch (error: any) {
      console.error("Gagal update data", error);
      alert(error?.response?.data?.message || "Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (Logika error handling dan skeleton loading tetap sama seperti sebelumnya)

  if (!initialData) return <div>Loading...</div>;

  return (
    <RepaymentSecurityForm
      mode='edit'
      initialData={initialData}
      onSubmit={handleEditSubmit}
      isLoading={isSubmitting}
      onCancel={closePanel}
    />
  );
}