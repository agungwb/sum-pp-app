import { InvoiceStatus, ScheduleType } from './repayment-schedule.enum';

export interface RepaymentScheduleID {
  id: string;
}

export interface RepaymentScheduleParent {
  repaymentSecurityId: string; // UUID
}


export interface RepaymentScheduleInfo {
  // Schedule Info
  scheduleType: ScheduleType | null | '';
  scheduleSequence: number;
  scheduleDate: string; // ISO Date string (YYYY-MM-DD)
  
}

export interface RepaymentScheduleInvoiceInfo {
  // Invoice Specifics
  invoiceNumber: string | null;
  invoiceSentTrial: number ;
  invoiceDate: string | null; // ISO Date string (YYYY-MM-DD)
  invoiceStatus: InvoiceStatus | null | '';
  invoiceNotes: string | null;
}

export interface RepaymentScheduleInvoiceFee {
  // Fees & Revenues (Net Base)
  invoiceFeeAdministration: string;
  invoiceFeeProvision: string;
  invoiceFeePlatform: string;
  invoiceFeeServicing: string;
  invoiceFeeMonitoring: string;
  invoiceFeeOther: string;

  // Taxes
  invoiceFeeAdministrationTax: string;
  invoiceFeeProvisionTax: string;
  invoiceFeePlatformTax: string;
  invoiceFeeServicingTax: string;
  invoiceFeeMonitoringTax: string;
  invoiceFeeOtherTax: string;

  // Investments & Penalties
  invoiceSinkingFund: string;
  invoiceYield: string;
  invoiceActualLoss: string;
  invoicePenalty: string;

  // Totals
  invoiceTotal: string;
  invoiceTotalTax: string;
  invoiceTotalWithTax: string;
}

export interface RepaymentScheduleAuditTrail {
  // Audit Trails
  createdBy: string;
  createdAt: string; // ISO Datetime string
  updatedBy: string;
  updatedAt: string; // ISO Datetime string
  deletedBy: string | null;
  deletedAt: string | null; // ISO Datetime string
}

export interface RepaymentScheduleInfoSummary 
extends RepaymentScheduleID,
        RepaymentScheduleParent,
        RepaymentScheduleInfo,
        RepaymentScheduleInvoiceInfo {}

export interface ScheduleItem 
extends RepaymentScheduleID,
        RepaymentScheduleParent,
        RepaymentScheduleInfo,
        RepaymentScheduleInvoiceInfo,
        RepaymentScheduleInvoiceFee,
        Pick<RepaymentScheduleAuditTrail, 'createdBy' | 'createdAt'> {}


export interface InvoiceSummary 
extends RepaymentScheduleInfo, 
        RepaymentScheduleInvoiceFee{
          scheduleId: string | undefined;
        }

// export interface ScheduleItem {
//     id: string; // UUID

//     repaymentSecurityId: string; // UUID

//     scheduleType: ScheduleType | '';
//     scheduleSequence: number;
//     scheduleDate: string; // ISO Date string (YYYY-MM-DD)

//     invoiceNumber: string;
//     invoiceSentTrial: number;
//     invoiceDate: string; // ISO Date string (YYYY-MM-DD)
//     invoiceStatus: InvoiceStatus | '';
//     invoiceNotes: string;

//     invoiceFeeAdministration: string;
//     invoiceFeeAdministrationTax: string;
//     invoiceFeeProvision: string;
//     invoiceFeeProvisionTax: string;
//     invoiceFeePlatform: string;
//     invoiceFeePlatformTax: string;
//     invoiceFeeServicing: string;
//     invoiceFeeServicingTax: string;
//     invoiceFeeMonitoring: string;
//     invoiceFeeMonitoringTax: string;
//     invoiceFeeOther: string;
//     invoiceFeeOtherTax: string;
//     invoiceSinkingFund: string;
//     invoiceYield: string;
//     invoiceActualLoss: string;
//     invoicePenalty: string;
//     invoiceTotal: string;
//     invoiceTotalTax: string;
//     invoiceTotalWithTax: string;

//     createdBy: string;
//     createdAt: string;
//   }

// export interface InvoiceSummaryOld {
//     scheduleId: string | undefined;
//     scheduleType: ScheduleType | '';
//     invoiceFeeAdministration: string;
//     invoiceFeeAdministrationTax: string;
//     invoiceFeeProvision: string;
//     invoiceFeeProvisionTax: string;
//     invoiceFeePlatform: string;
//     invoiceFeePlatformTax: string;
//     invoiceFeeServicing: string;
//     invoiceFeeServicingTax: string;
//     invoiceFeeMonitoring: string;
//     invoiceFeeMonitoringTax: string;
//     invoiceFeeOther: string;
//     invoiceFeeOtherTax: string;
//     invoiceSinkingFund: string;
//     invoiceYield: string;
//     invoiceActualLoss: string;
//     invoicePenalty: string;
//     invoiceTotal: string;
//     invoiceTotalTax: string;
//     invoiceTotalWithTax: string;
// }
