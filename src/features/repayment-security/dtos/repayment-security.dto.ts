import { ContractStatus, SecurityType } from "../types/repayment-security.enum";

export interface RepaymentSecurityDetailResponse {
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
  
  // Dokumen kontrak (bisa null)
  contractDocumentTitle: string | null;
  contractDocumentNumber: string | null;
  contractDocumentUrl: string | null;
  
  // Nilai finansial (berupa string dari backend)
  contractUnderlyingFund: string;
  contractStartDate: string; // ISO 8601 Date string
  contractEndDate: string; // ISO 8601 Date string
  contractDurationInMonths: number;
  contractStatus: string; // Bisa menggunakan Enum jika ada (misal: 'PERFORMING' dll)
  
  contractYieldAmount: string;
  contractYieldRateAnnually: string;
  contractFeeAdministration: string;
  contractFeeAdministrationPercentage: string;
  contractFeeProvision: string;
  contractFeeProvisionPercentage: string;
  contractFeePlatform: string;
  contractFeePlatformPercentage: string;
  contractFeeServicing: string;
  contractFeeServicingPercentage: string;
  contractFeeMonitoring: string;
  contractFeeMonitoringPercentageMonthly: string;
  contractPenaltyPercentageDaily: string;
  contractTaxPpn: string;
  contractTaxYield: string;
  contractTaxFactor: string;
  
  // Info Bank
  contractEscrowBank: string;
  contractEscrowAccount: string;
  contractVaBank: string;
  contractVaNumber: string;
  
  // Kontak
  contractContactEmail: string;
  contractContactWhatsapp: string;
  
  // Restrukturisasi
  restructOrder: number;
  restructParentSecurityId: string | null;
  restructOriginalSecurityId: string | null;
  
  // Audit trails
  createdBy: string;
  createdAt: string; // ISO 8601 Date string
  updatedBy: string;
  updatedAt: string; // ISO 8601 Date string
  deletedBy: string | null;
  deletedAt: string | null;
}

// 1. DTO untuk masing-masing item (fokus ke isi data.items)
export interface RepaymentSecurityCardResponse {
  id: string;
  investeeId: string;
  investeeName: string;
  investeeNameLegal: string;
  securityId: string;
  securityType: string;
  securityName: string;
  contractUnderlyingFund: number;
  contractStartDate: string; // Menggunakan string untuk format ISO Date (YYYY-MM-DDTHH:mm:ss.sssZ)
  contractEndDate: string;   // Menggunakan string untuk format ISO Date
  contractDurationInMonths: number;
  contractStatus: string;
  contractYieldAmount: number;
  contractYieldRateAnnually: number;
  sumReceiptSinkingFund: number;
}

export interface SecurityLookupResponse {
  id: string;
  investeeId: string;
  investeeName: string;
  investeeNameLegal: string;
  investeeIconUrl: string;
  securityId: string;
  securityType: SecurityType | null; // Bisa diganti dengan union/enum jika fix (misal: 'Sukuk' | 'Saham')
  securityName: string;
  securityCode: string;
  securitySeries: number;
  securityPhase: number;
  securitySequence: number;
}

export interface RepaymentSecurityRequest {
    id: string | null;
    investeeId: string;
    investeeName: string;
    investeeNameLegal: string;
    investeeIconUrl: string;
    securityId: string;
    securityType: SecurityType | '';
    securityName: string;
    securityCode: string;
    securitySeries: number;
    securityPhase: number;
    securitySequence: number;
  
    contractStartDate: string;
    contractEndDate: string;
    contractDurationInMonths: number;
    contractStatus: ContractStatus | '';
  
    contractUnderlyingFund: string;
    contractYieldAmount: string;
    contractYieldRateAnnually: string;
    contractFeeAdministration: string;
    contractFeeAdministrationPercentage: string;
    contractFeeProvision: string;
    contractFeeProvisionPercentage: string;
    contractFeePlatform: string;
    contractFeePlatformPercentage: string;
    contractFeeServicing: string;
    contractFeeServicingPercentage: string;
    contractFeeMonitoringMonthly: string;
    contractFeeMonitoringPercentageMonthly: string;
    contractFeeMonitoring: string;
    contractFeeMonitoringPercentage: string;
  
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

  // file: repayment-security-item.dto.ts

export interface RepaymentSecurityEditResponse {
  id: string;
  investeeId: string;
  investeeName: string;
  investeeNameLegal: string;
  investeeIconUrl: string | null;
  
  securityId: string;
  securityType: SecurityType | null; // Union literal type untuk auto-complete
  securityName: string;
  securityCode: string;
  securitySeries: number;
  securityPhase: number;
  securitySequence: number;
  
  contractDocumentTitle: string | null;
  contractDocumentNumber: string | null;
  contractDocumentUrl: string | null;
  
  contractUnderlyingFund: string; // Bentuk nominal di JSON berupa string
  contractStartDate: string; // Format ISO Date string
  contractEndDate: string; // Format ISO Date string
  contractDurationInMonths: number;
  contractStatus: ContractStatus | null;
  
  contractYieldAmount: string;
  contractYieldRateAnnually: string;
  
  contractFeeAdministration: string;
  contractFeeAdministrationPercentage: string;
  contractFeeProvision: string;
  contractFeeProvisionPercentage: string;
  contractFeePlatform: string;
  contractFeePlatformPercentage: string;
  contractFeeServicing: string;
  contractFeeServicingPercentage: string;
  contractFeeMonitoring: string;
  contractFeeMonitoringPercentageMonthly: string;
  
  contractPenaltyPercentageDaily: string;
  
  contractTaxPpn: string;
  contractTaxYield: string;
  contractTaxFactor: string;
  
  contractEscrowBank: string;
  contractEscrowAccount: string;
  contractVaBank: string;
  contractVaNumber: string;
  contractContactEmail: string;
  contractContactWhatsapp: string;
  
  restructOrder: number;
  restructParentSecurityId: string | null;
  restructOriginalSecurityId: string | null;
  
  createdBy: string;
  createdAt: string; // Format ISO Date string
  updatedBy: string;
  updatedAt: string; // Format ISO Date string
  deletedBy: string | null;
  deletedAt: string | null;
}

  