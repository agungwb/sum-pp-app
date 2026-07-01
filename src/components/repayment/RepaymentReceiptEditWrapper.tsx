// src/components/repayment/RepaymentReceiptEditWrapper.tsx
import React, { useState, useEffect } from 'react';
import { useSidePanel } from '../../context/SidePanelContext';
import RepaymentReceiptForm from './RepaymentReceiptForm';

interface EditWrapperProps {
  receiptId: string;
}

export default function RepaymentReceiptEditWrapper({ receiptId }: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    // Simulasi nge-fetch ke endpoint: /repayment-receipts/:receiptId
    const fetchDummyData = async () => {
      // Tunggu 500ms biar kelihatan loading spinner/teks-nya
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      setInitialData({
        id: receiptId,
        repayment_schedule_id: 'sch-a1b2-c3d4',
        receipt_date: '2026-07-31T00:00', // Sesuai format input datetime-local
        receipt_status: 'SUCCESS',
        receipt_notes: 'Pelunasan Tepat Waktu (Happy Path)',
        receipt_fee_administration: '0',
        receipt_fee_administration_tax: '0',
        receipt_fee_provision: '0',
        receipt_fee_provision_tax: '0',
        receipt_fee_platform: '0',
        receipt_fee_platform_tax: '0',
        receipt_fee_servicing: '0',
        receipt_fee_servicing_tax: '0',
        receipt_fee_monitoring: '30000000',
        receipt_fee_monitoring_tax: '3300000',
        receipt_fee_other: '0',
        receipt_fee_other_tax: '0',
        receipt_sinking_fund: '500000000',
        receipt_yield: '60000000',
        receipt_actual_loss: '0',
        receipt_penalty: '0',
        receipt_total: '590000000',
        receipt_total_tax: '3300000',
        receipt_total_with_tax: '593300000'
      });
    };

    fetchDummyData();
  }, [receiptId]);

  const handleEditSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // TODO: Ganti logic hit API PUT/PATCH lo ntar disini
      console.log('Update Penerimaan ID:', receiptId, 'Payload:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay
      
      closePanel();
    } catch (error) {
      console.error("Gagal update jadwal", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-white">
      {initialData ? (
        <RepaymentReceiptForm 
          initialData={initialData}
          onSubmit={handleEditSubmit} 
          isLoading={isSubmitting} 
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs font-medium text-slate-500">
          Sedang memuat data...
        </div>
      )}
    </div>
  );
}