import { InvoiceStatus, ScheduleType } from "../types/repayment-schedule.enum";

export interface RepaymentScheduleItemResponse {
    id: string;
    repaymentSecurityId: string;
    scheduleType: string; // Bisa Anda ganti dengan enum ScheduleType jika sudah di-import
    scheduleSequence: number;
    scheduleDate: string;
    invoiceNumber: string | null;
    invoiceSentTrial: number;
    invoiceDate: string | null;
    invoiceStatus: string; // Bisa Anda ganti dengan enum InvoiceStatus jika sudah di-import
    invoiceNotes: string | null;
    
    // Perhatikan bahwa semua nilai uang (NUMERIC) berupa string dari JSON
    invoiceFeeAdministration: string;
    invoiceFeeAdministrationTax: string;
    invoiceFeeProvision: string;
    invoiceFeeProvisionTax: string;
    invoiceFeePlatform: string;
    invoiceFeePlatformTax: string;
    invoiceFeeServicing: string;
    invoiceFeeServicingTax: string;
    invoiceFeeMonitoring: string;
    invoiceFeeMonitoringTax: string;
    invoiceFeeOther: string;
    invoiceFeeOtherTax: string;
    invoiceSinkingFund: string;
    invoiceYield: string;
    invoiceActualLoss: string;
    invoicePenalty: string;
    invoiceTotal: string;
    invoiceTotalTax: string;
    invoiceTotalWithTax: string;
    
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    deletedBy: string | null;
    deletedAt: string | null;
  }

  export interface RepaymentScheduleFormRequest {
    repaymentSecurityId?: string;
    scheduleType?: ScheduleType | '';
    scheduleSequence?: number;
    scheduleDate?: string;
    invoiceNumber?: string | null;
    invoiceSentTrial?: number;
    invoiceDate?: string;
    invoiceStatus?: InvoiceStatus | '';
    invoiceNotes?: string;
    invoiceFeeAdministration?: string;
    invoiceFeeAdministrationTax?: string;
    invoiceFeeProvision?: string;
    invoiceFeeProvisionTax?: string;
    invoiceFeePlatform?: string;
    invoiceFeePlatformTax?: string;
    invoiceFeeServicing?: string;
    invoiceFeeServicingTax?: string;
    invoiceFeeMonitoring?: string;
    invoiceFeeMonitoringTax?: string;
    invoiceFeeOther?: string;
    invoiceFeeOtherTax?: string;
    invoiceSinkingFund?: string;
    invoiceYield?: string;
    invoiceActualLoss?: string;
    invoicePenalty?: string;
    invoiceTotal?: string;
    invoiceTotalTax?: string;
    invoiceTotalWithTax?: string;
  }
  
  export interface RepaymentScheduleEditFormResponse extends RepaymentScheduleFormRequest {
    id: string;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
    deletedBy?: string | null;
    deletedAt?: string | null;
  }

export interface RepaymentScheduleItemWithPenaltyResponse {
    id: string;
    repaymentSecurityId: string;
    scheduleType: string;
    scheduleSequence: number;
    scheduleDate: string;
    invoiceDate: string | null;
    invoiceStatus: string | null;
    invoiceFeeAdministration: string;
    invoiceFeeAdministrationTax: string;
    invoiceFeeProvision: string;
    invoiceFeeProvisionTax: string;
    invoiceFeePlatform: string;
    invoiceFeePlatformTax: string;
    invoiceFeeServicing: string;
    invoiceFeeServicingTax: string;
    invoiceFeeMonitoring: string;
    invoiceFeeMonitoringTax: string;
    invoiceFeeOther: string;
    invoiceFeeOtherTax: string;
    invoiceSinkingFund: string;
    invoiceYield: string;
    invoiceActualLoss: string;
    invoicePenalty: string;
    invoiceTotal: string;
    invoiceTotalTax: string;
    invoiceTotalWithTax: string;

    // ==========================================
    // Outstanding & Penalty Calculators 
    // ==========================================
    
    outstandingTotalWithTax: string;
    penaltySettled: string;
    penaltyIsSettled: boolean;
    penaltyCalculated: string;
}

