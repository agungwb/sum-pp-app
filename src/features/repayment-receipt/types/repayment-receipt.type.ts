import { ReceiptMethod, ReceiptStatus } from './repayment-receipt.enum';

export interface RepaymentReceipt {
  // Identifiers & Relations
  id: string; // UUID
  repaymentScheduleId: string; // UUID

  // Receipt Core Info
  receiptDate: string; // ISO Date string
  receiptStatus: ReceiptStatus;
  receiptNotes: string | null;
  receiptMethod: ReceiptMethod | null;
  receiptDocumentUrl: string | null;

  // Fees & Revenues (Real Cash Received)
  receiptFeeAdministration: number;
  receiptFeeProvision: number;
  receiptFeePlatform: number;
  receiptFeeServicing: number;
  receiptFeeMonitoring: number;
  receiptFeeOther: number;

  // Taxes (Real Cash Cleared)
  receiptFeeAdministrationTax: number;
  receiptFeeProvisionTax: number;
  receiptFeePlatformTax: number;
  receiptFeeServicingTax: number;
  receiptFeeMonitoringTax: number;
  receiptFeeOtherTax: number;

  // Investments, Yields, Penalties (Real Cash Allocations)
  receiptSinkingFund: number;
  receiptYield: number;
  receiptActualLoss: number;
  receiptPenalty: number;

  // Totals
  receiptTotal: number;
  receiptTotalTax: number;
  receiptTotalWithTax: number;

  // Audit Trails
  createdBy: string;
  createdAt: string; // ISO Datetime string
  updatedBy: string;
  updatedAt: string; // ISO Datetime string
  deletedBy: string | null;
  deletedAt: string | null; // ISO Datetime string
}