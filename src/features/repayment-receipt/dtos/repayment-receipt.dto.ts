// src/dtos/repayment-receipt.dto.ts
import { ReceiptStatus, ReceiptMethod } from '../types/repayment-receipt.enum';
import { RepaymentReceiptID, RepaymentReceiptInfo, RepaymentReceiptParent, RepaymentReceiptPayment } from '../types/repayment-receipt.type';

export interface RepaymentReceiptDetailResponse 
extends RepaymentReceiptID,
        RepaymentReceiptParent,
        RepaymentReceiptInfo,
        RepaymentReceiptPayment {}


export interface RepaymentReceiptDetailWithAuditResponse 
extends RepaymentReceiptID,
        RepaymentReceiptParent,
        RepaymentReceiptInfo,
        RepaymentReceiptPayment {}

export interface RepaymentReceiptFormRequest
extends RepaymentReceiptParent,
        RepaymentReceiptInfo,
        RepaymentReceiptPayment {

  // repaymentScheduleId?: string;

  // receiptDate: string;
  // receiptStatus: ReceiptStatus | string;
  // receiptMethod: ReceiptMethod | string;
  // receiptNotes: string;
  // receiptDocumentUrl: string;

  // receiptFeeAdministration: string;
  // receiptFeeAdministrationTax: string;
  // receiptFeeProvision: string;
  // receiptFeeProvisionTax: string;
  // receiptFeePlatform: string;
  // receiptFeePlatformTax: string;
  // receiptFeeServicing: string;
  // receiptFeeServicingTax: string;
  // receiptFeeMonitoring: string;
  // receiptFeeMonitoringTax: string;
  // receiptFeeOther: string;
  // receiptFeeOtherTax: string;

  // receiptSinkingFund: string;
  // receiptYield: string;
  // receiptActualLoss: string;
  // receiptPenalty: string;

  // receiptTotalWithTax: string;
  // receiptTotal: string;
  // receiptTotalTax: string;
}

export interface RepaymentReceiptEditFormResponse 
extends RepaymentReceiptParent,
        RepaymentReceiptInfo,
        RepaymentReceiptPayment {}