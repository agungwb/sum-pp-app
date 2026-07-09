// src/components/repayment/RepaymentReceiptEditWrapper.tsx
import React, { useState, useEffect } from 'react';
import RepaymentReceiptForm from './RepaymentReceiptForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentReceiptService } from '../../services/repaymentReceiptService';
import { ScheduleType } from '../../types/repayment-receipt.enum';
import { InvoiceSummary } from '../../../repayment-schedule/types/repayment-schedule.type';
import { RepaymentReceiptEditResponse, RepaymentReceiptRequest } from '../../dtos/repayment-receipt.dto';

interface Props {
  receiptId: string; // Mengikuti instruksi GET & PUT URL kamu
  initialData: RepaymentReceiptRequest;
  invoiceSummary: InvoiceSummary;
}

export default function RepaymentReceiptEditWrapper({ receiptId, invoiceSummary }: Props) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchReceiptDetail = async () => {
      try {
        const response = await repaymentReceiptService.getReceiptEditResponse(receiptId);

        if (response.data && response.data.item) {
          
          
          const repaymentReceiptRes: RepaymentReceiptEditResponse = response.data.item;

          console.log('[RepaymentReceiptEditWrapper] repaymentReceiptRes.receiptDate : ',repaymentReceiptRes.receiptDate);

          const currentData: RepaymentReceiptRequest = {
            receiptDate: repaymentReceiptRes?.receiptDate || '',
            receiptStatus: repaymentReceiptRes?.receiptStatus || '',
            receiptMethod: repaymentReceiptRes?.receiptMethod || '',
            receiptNotes: repaymentReceiptRes?.receiptNotes || '',
            receiptDocumentUrl: repaymentReceiptRes?.receiptDocumentUrl || '',
            receiptTotalWithTax: repaymentReceiptRes?.receiptTotalWithTax || '',
            receiptTotal: repaymentReceiptRes?.receiptTotal || '',
            receiptTotalTax: repaymentReceiptRes?.receiptTotalTax || '',
            receiptFeeAdministration: repaymentReceiptRes?.receiptFeeAdministration || '',
            receiptFeeAdministrationTax: repaymentReceiptRes?.receiptFeeAdministrationTax || '',
            receiptFeeProvision: repaymentReceiptRes?.receiptFeeProvision || '',
            receiptFeeProvisionTax: repaymentReceiptRes?.receiptFeeProvisionTax || '',
            receiptFeePlatform: repaymentReceiptRes?.receiptFeePlatform || '',
            receiptFeePlatformTax: repaymentReceiptRes?.receiptFeePlatformTax || '',
            receiptFeeServicing: repaymentReceiptRes?.receiptFeeServicing || '',
            receiptFeeServicingTax: repaymentReceiptRes?.receiptFeeServicingTax || '',
            receiptFeeMonitoring: repaymentReceiptRes?.receiptFeeMonitoring || '',
            receiptFeeMonitoringTax: repaymentReceiptRes?.receiptFeeMonitoringTax || '',
            receiptFeeOther: repaymentReceiptRes?.receiptFeeOther || '',
            receiptFeeOtherTax: repaymentReceiptRes?.receiptFeeOtherTax || '',
            receiptSinkingFund: repaymentReceiptRes?.receiptSinkingFund || '',
            receiptYield: repaymentReceiptRes?.receiptYield || '',
            receiptActualLoss: repaymentReceiptRes?.receiptActualLoss || '',
            receiptPenalty: repaymentReceiptRes?.receiptPenalty || '',
          };
          setInitialData(currentData);
        }
        
      } catch (error) {
        console.error("Gagal fetch data receipt", error);
      }
    };

    if (receiptId) {
      fetchReceiptDetail();
    }

  }, [receiptId]);

  const handleEditSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      await repaymentReceiptService.updateReceipt(receiptId, formData);
      closePanel();
    } catch (error) {
      console.error("Gagal update penerimaan", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full">
      {initialData ? (
        <RepaymentReceiptForm 
          mode='edit'
          initialData={initialData}
          invoiceSummary={invoiceSummary }
          scheduleType={ScheduleType.UPFRONT} // Dummy
          onSubmit={handleEditSubmit} 
          isLoading={isSubmitting} 
        />
      ) : (
        <div className="p-6 text-sm text-slate-500">Loading data...</div>
      )}
    </div>
  );
}