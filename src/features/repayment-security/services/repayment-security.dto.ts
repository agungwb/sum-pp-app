export interface SecurityLookupItem {
    id: string;
    investeeId: string;
    investeeName: string;
    investeeNameLegal: string;
    investeeIconUrl: string;
    securityId: string;
    securityType: string;
    securityName: string;
    securityCode: string;
    securitySeries: number;
    securityPhase: number;
    securitySequence: number;
  }
  
  export interface RepaymentSecurityDTO {
    id: string | null;
    investeeId: string;
    investeeName: string;
    investeeNameLegal: string;
    investeeIconUrl: string;
    securityId: string;
    securityType: string;
    securityName: string;
    securityCode: string;
    securitySeries: number;
    securityPhase: number;
    securitySequence: number;
  
    contractStartDate: string;
    contractEndDate: string;
    contractDurationInMonths: number;
    contractStatus: string;
  
    contractUnderlyingFund: number;
    contractYieldAmount: number;
    contractYieldRateAnnually: number;
    contractFeeAdministration: number;
    contractFeeAdministrationPercentage: number;
    contractFeeProvision: number;
    contractFeeProvisionPercentage: number;
    contractFeePlatform: number;
    contractFeePlatformPercentage: number;
    contractFeeServicing: number;
    contractFeeServicingPercentage: number;
    contractFeeMonitoringMonthly: number;
    contractFeeMonitoringPercentageMonthly: number;
    contractFeeMonitoring: number;
    contractFeeMonitoringPercentage: number;
  
    contractTaxPpn: string;
    contractTaxFactor: string;
    contractTaxYield: string;
    contractPenaltyPercentageDaily: string;
  
    contractEscrowBank: string;
    contractEscrowAccount: string;
    contractVaBank: string;
    contractVaNumber: string;
    contractContactEmail: string;
    contractContactWhatsapp: string;
  
    contractDocumentTitle: string;
    contractDocumentNumber: string;
    contractDocumentUrl: File | null;
    restructOrder: number | null;
    restructParentSecurityId: string | null;
    restructOriginalSecurityId: string | null;

    scheduleUpfrontFlag: boolean;
    scheduleInstallmentFlag: boolean;
    scheduleUpfrontDate: string;
    scheduleInstallmentDate: string;

  }