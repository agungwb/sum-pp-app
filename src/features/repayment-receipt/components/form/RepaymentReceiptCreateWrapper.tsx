// src/components/repayment/RepaymentReceiptCreateWrapper.tsx
import React, { useState } from 'react';
import RepaymentReceiptForm from './RepaymentReceiptForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentReceiptService } from '../../services/repaymentReceiptService';
import { ReceiptMethod, ReceiptStatus, ScheduleType } from '../../types/repayment-receipt.enum';
import { InvoiceSummary } from '../../../repayment-schedule/types/repayment-schedule.type';
import { RepaymentReceiptFormRequest } from '../../dtos/repayment-receipt.dto';

interface Props {
  invoiceSummary: InvoiceSummary;
}

export default function RepaymentReceiptCreateWrapper({invoiceSummary }: Props) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DUMMY Data Tagihan untuk Acuan Kalkulasi (Anggap data dari Schedule API)
  const initialData: RepaymentReceiptFormRequest = {
    receiptDate: '',
    receiptStatus: ReceiptStatus.SUCCESS,
    receiptMethod: ReceiptMethod.BANK_TRANSFER,
    receiptNotes: '',
    receiptDocumentUrl: '',
    receiptTotalWithTax: '0',
    receiptTotal: '0',
    receiptTotalTax: '0',
    receiptFeeAdministration: '0',
    receiptFeeAdministrationTax: '0',
    receiptFeeProvision: '0',
    receiptFeeProvisionTax: '0',
    receiptFeePlatform: '0',
    receiptFeePlatformTax: '0',
    receiptFeeServicing: '0',
    receiptFeeServicingTax: '0',
    receiptFeeMonitoring: '0',
    receiptFeeMonitoringTax: '0',
    receiptFeeOther: '0',
    receiptFeeOtherTax: '0',
    receiptSinkingFund: '0',
    receiptYield: '0',
    receiptActualLoss: '0',
    receiptPenalty: '0'
  };

  const handleCreateSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      await repaymentReceiptService.createRepaymentReceipt(invoiceSummary.scheduleId, formData);
      closePanel();
    } catch (error) {
      console.error("Gagal create penerimaan", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RepaymentReceiptForm 
      mode='add'
      initialData={initialData}
      invoiceSummary={invoiceSummary}
      scheduleType={ScheduleType.INSTALLMENT}
      onSubmit={handleCreateSubmit} 
      isLoading={isSubmitting} 
    />
  );
}