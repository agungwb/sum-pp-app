// src/components/repayment/RepaymentScheduleEditWrapper.tsx
import React, { useState, useEffect } from 'react';
import RepaymentScheduleForm from './RepaymentScheduleForm';
import { useSidePanel } from '../../context/SidePanelContext';

interface EditWrapperProps {
  scheduleId: string;
}

export default function RepaymentScheduleEditWrapper({ scheduleId }: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    // Simulasi nge-fetch ke endpoint: /repayment/schedules/:scheduleId
    const fetchDummyData = async () => {
      // Tunggu 500ms buat tes loading state
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      setInitialData({
        id: scheduleId,
        repayment_security_id: 'sec-a1b2-c3d4',
        schedule_order: '2',
        schedule_date: '2026-08-01',
        invoice_date: '2026-07-25',
        invoice_status: 'UNPAID',
        invoice_notes: 'Jadwal Tagihan Bulan Ke-2',
        invoice_fee_administration: '2500000',
        invoice_fee_administration_tax: '275000',
        invoice_fee_provision: '0',
        invoice_fee_provision_tax: '0',
        invoice_fee_platform: '10000000',
        invoice_fee_platform_tax: '1100000',
        invoice_fee_servicing: '5000000',
        invoice_fee_servicing_tax: '550000',
        invoice_fee_monitoring: '3000000',
        invoice_fee_monitoring_tax: '330000',
        invoice_fee_other: '0',
        invoice_fee_other_tax: '0',
        invoice_sinking_fund: '50000000',
        invoice_yield: '10000000',
        invoice_actual_loss: '0',
        invoice_penalty: '0',
        invoice_total: '80500000',
        invoice_total_tax: '2255000',
        invoice_total_with_tax: '82755000'
      });
    };

    fetchDummyData();
  }, [scheduleId]);

  const handleEditSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Logic nge-hit API PUT/PATCH lo ntar disini
      console.log('Update Jadwal ID:', scheduleId, 'Payload:', formData);
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
        <RepaymentScheduleForm 
          initialData={initialData}
          onSubmit={handleEditSubmit} 
          isLoading={isSubmitting} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 space-y-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 animate-pulse">Sedang memuat data...</p>
        </div>
      )}
    </div>
  );
}