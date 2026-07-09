import { InvoiceStatus, ScheduleType } from './repayment-schedule.enum';

export interface RepaymentSchedule {
  // Identifiers & Relations
  id: string; // UUID
  repaymentSecurityId: string; // UUID

  // Schedule Info
  scheduleType: ScheduleType;
  scheduleSequence: number;
  scheduleDate: string; // ISO Date string (YYYY-MM-DD)

  // Invoice Specifics
  invoiceNumber: string | null;
  invoiceSentTrial: number;
  invoiceDate: string | null; // ISO Date string (YYYY-MM-DD)
  invoiceStatus: InvoiceStatus | null;
  invoiceNotes: string | null;

  // Fees & Revenues (Net Base)
  invoiceFeeAdministration: number;
  invoiceFeeProvision: number;
  invoiceFeePlatform: number;
  invoiceFeeServicing: number;
  invoiceFeeMonitoring: number;
  invoiceFeeOther: number;

  // Taxes
  invoiceFeeAdministrationTax: number;
  invoiceFeeProvisionTax: number;
  invoiceFeePlatformTax: number;
  invoiceFeeServicingTax: number;
  invoiceFeeMonitoringTax: number;
  invoiceFeeOtherTax: number;

  // Investments & Penalties
  invoiceSinkingFund: number;
  invoiceYield: number;
  invoiceActualLoss: number;
  invoicePenalty: number;

  // Totals
  invoiceTotal: number;
  invoiceTotalTax: number;
  invoiceTotalWithTax: number;

  // Audit Trails
  createdBy: string;
  createdAt: string; // ISO Datetime string
  updatedBy: string;
  updatedAt: string; // ISO Datetime string
  deletedBy: string | null;
  deletedAt: string | null; // ISO Datetime string
}


export interface ScheduleItem {
    id: string; // UUID
    repaymentSecurityId: string; // UUID
    scheduleType: ScheduleType | '';
    scheduleSequence: number;
    scheduleDate: string; // ISO Date string (YYYY-MM-DD)
    invoiceNumber: string;
    invoiceSentTrial: number;
    invoiceDate: string; // ISO Date string (YYYY-MM-DD)
    invoiceStatus: InvoiceStatus | '';
    invoiceNotes: string;
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
  }

export interface InvoiceSummary {
    scheduleId: string | undefined;
    scheduleType: ScheduleType | '';
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
}