// src/components/repayment/RepaymentReceiptCreateWrapper.tsx
import React, { useState } from 'react';
import RepaymentReceiptForm from './RepaymentReceiptForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentReceiptService } from '../../services/repaymentReceiptService';
import { ReceiptMethod, ReceiptStatus, ScheduleType } from '../../types/repayment-receipt.enum';
import { InvoiceSummary, InvoiceSummaryWithPenaltyBig } from '../../../repayment-schedule/types/repayment-schedule.type';
import { RepaymentReceiptFormRequest } from '../../dtos/repayment-receipt.dto';
import { mapDtoToFormData } from '../../../../utils/form';

interface Props {
  invoiceSummary: InvoiceSummaryWithPenaltyBig;
}

export default function RepaymentReceiptCreateWrapper({invoiceSummary }: Props) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // DUMMY Data Tagihan untuk Acuan Kalkulasi (Anggap data dari Schedule API)
  const initialData: RepaymentReceiptFormRequest = {
    receiptDate: '',
    receiptStatus: ReceiptStatus.SUCCESS,
    receiptMethod: null,
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

  const handleCreateSubmit = async (formData: RepaymentReceiptFormRequest) => {
    setIsSubmitting(true);
    setSubmissionError(null); 

    const payloadData : RepaymentReceiptFormRequest = {
      ...formData,
      receiptMethod: formData.receiptMethod === '' ? null : formData.receiptMethod,
    };

    const isFileUploaded = formData.receiptDocumentUrl instanceof File

    try {
      // await repaymentReceiptService.createRepaymentReceipt(invoiceSummary.id, formData);
      if (isFileUploaded){
        const payloadFormData = mapDtoToFormData(payloadData);
        await repaymentReceiptService.createRepaymentReceipt(invoiceSummary.id, payloadFormData);
      } else {
        await repaymentReceiptService.createRepaymentReceipt(invoiceSummary.id, payloadData);
      }
      closePanel();
    } catch (error: any) {
      console.error("Gagal create penerimaan", error);
      setSubmissionError(
        error?.response?.data?.message || "Terjadi kesalahan saat menyimpan data."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RepaymentReceiptForm 
      mode='add'
      initialData={initialData}
      invoiceSummary={invoiceSummary}
      onSubmit={handleCreateSubmit} 
      onCancel={closePanel} 
      isLoading={isSubmitting} 
      submissionError = {submissionError}
    />
  );
}