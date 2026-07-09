// src/dtos/repayment-receipt.dto.ts
import { ReceiptStatus, ReceiptMethod } from '../types/repayment-receipt.enum';

export interface RepaymentReceiptRequest {
  repaymentScheduleId?: string;
  receiptDate: string;
  receiptStatus: ReceiptStatus | string;
  receiptMethod: ReceiptMethod | string;
  receiptNotes: string;
  receiptDocumentUrl: string;

  receiptTotalWithTax: string;
  receiptTotal: string;
  receiptTotalTax: string;

  receiptFeeAdministration: string;
  receiptFeeAdministrationTax: string;
  receiptFeeProvision: string;
  receiptFeeProvisionTax: string;
  receiptFeePlatform: string;
  receiptFeePlatformTax: string;
  receiptFeeServicing: string;
  receiptFeeServicingTax: string;
  receiptFeeMonitoring: string;
  receiptFeeMonitoringTax: string;
  receiptFeeOther: string;
  receiptFeeOtherTax: string;

  receiptSinkingFund: string;
  receiptYield: string;
  receiptActualLoss: string;
  receiptPenalty: string;
}

export interface RepaymentReceiptEditResponse extends RepaymentReceiptRequest {
  id: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}