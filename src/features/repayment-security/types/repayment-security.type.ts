import { ContractStatus, SecurityType } from "./repayment-security.enum";

export interface RepaymentSecurity {
  // Identifiers & Relations
  id: string; 
  investeeId: string; 
  securityId: string; 

  // Investee Info
  investeeName: string;
  investeeNameLegal: string;
  investeeIconUrl: string | null;

  // Security Core Info
  securityType: SecurityType;
  securityName: string;
  securityCode: string;
  
  // Hierarchy & Sorting
  securitySeries: number;
  securityPhase: number;
  securitySequence: number;

  // Legal & Documents
  contractDocumentTitle: string | null;
  contractDocumentNumber: string | null;
  contractDocumentUrl: string | null;

  // Base Investment & Timing
  contractUnderlyingFund: number;
  contractStartDate: string | null; 
  contractEndDate: string | null; 
  contractDurationInMonths: number | null;
  contractStatus: ContractStatus | null;

  // Yields & Projections
  contractYieldAmount: number;
  contractYieldRateAnnually: number;

  // Fees (Administration, Provision, Platform, Servicing, Monitoring)
  contractFeeAdministration: number;
  contractFeeAdministrationPercentage: number;
  contractFeeProvision: number;
  contractFeeProvisionPercentage: number;
  contractFeePlatform: number;
  contractFeePlatformPercentage: number;
  contractFeeServicing: number;
  contractFeeServicingPercentage: number;
  contractFeeMonitoring: number;
  contractFeeMonitoringPercentageMonthly: number;

  // Penalties & Taxes
  contractPenaltyPercentageDaily: number;
  contractTaxPpn: number;
  contractTaxYield: number;
  contractTaxFactor: number;

  // Payments & Routing
  contractEscrowBank: string | null;
  contractEscrowAccount: string | null;
  contractVaBank: string | null;
  contractVaNumber: string | null;

  // Notifications
  contractContactEmail: string | null;
  contractContactWhatsapp: string | null;

  // Restructuring
  restructOrder: number;
  restructParentSecurityId: string | null; 
  restructOriginalSecurityId: string | null; 

  // Audit Trails
  createdBy: string;
  createdAt: string; 
  updatedBy: string;
  updatedAt: string; 
  deletedBy: string | null;
  deletedAt: string | null; 
}


// export interface RepaymentSecurity {
//   id: string;
//   investeeId: string;
//   investeeName: string;
//   investeeNameLegal: string;
//   investeeIconUrl?: string;
//   securityId: string;
//   securityType: SecurityType;
//   securityName: string;
//   securityCode: string;
//   securitySeries: number;
//   securityPhase: number;
//   securitySequence: number;
//   contractStartDate: string;
//   contractEndDate: string;
//   contractDurationInMonths: number;
//   contractStatus: ContractStatus;
//   // tambahkan sisa field numerik finansial lainnya...
// }
  