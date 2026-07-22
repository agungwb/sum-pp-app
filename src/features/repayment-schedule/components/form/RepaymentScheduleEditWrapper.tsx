import React, { useState, useEffect } from 'react';
import RepaymentScheduleForm from './RepaymentScheduleForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentScheduleService } from '../../services/repaymentScheduleService';
import { RepaymentScheduleEditFormResponse, RepaymentScheduleFormRequest } from '../../dtos/repayment-schedule.dto';
import { InvoiceStatus, ScheduleType } from '../../types/repayment-schedule.enum';
import { RepaymentSecurityDetailResponse } from '../../../repayment-security/dtos/repayment-security.dto';


interface EditWrapperProps {
  scheduleId: string;
  repaymentSecurity: RepaymentSecurityDetailResponse;
}

export default function RepaymentScheduleEditWrapper({ scheduleId, repaymentSecurity}: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<RepaymentScheduleFormRequest | null>(null);
  
  // State Modal Konfirmasi

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await repaymentScheduleService.getRepaymentScheduleEditForm(scheduleId);
        // Ngambil data.item berdasarkan format JSON yang lo kasih
        if (response.data && response.data.item) {
          
          const repaymentScheduleRes: RepaymentScheduleEditFormResponse = response.data.item;
          const currentData: RepaymentScheduleFormRequest = {
            repaymentSecurityId: repaymentSecurity.id,
            scheduleType: repaymentScheduleRes?.scheduleType || null, // Default value
            scheduleSequence: repaymentScheduleRes?.scheduleSequence || 0, // Default urutan pertama
            scheduleDate: repaymentScheduleRes?.scheduleDate || '', 
            invoiceDate: repaymentScheduleRes?.invoiceDate || '', 
            invoiceNumber: repaymentScheduleRes?.invoiceNumber || '-',
            invoiceSentTrial: repaymentScheduleRes?.invoiceSentTrial || 0,
            invoiceStatus: repaymentScheduleRes?.invoiceStatus || null, // Default jadwal baru biasanya Draft
            invoiceNotes: repaymentScheduleRes?.invoiceNotes || '',
            invoiceFeeAdministration: repaymentScheduleRes?.invoiceFeeAdministration || '0',
            invoiceFeeAdministrationTax: repaymentScheduleRes?.invoiceFeeAdministrationTax || '0',
            invoiceFeeProvision: repaymentScheduleRes?.invoiceFeeProvision || '0',
            invoiceFeeProvisionTax: repaymentScheduleRes?.invoiceFeeProvisionTax || '0',
            invoiceFeePlatform: repaymentScheduleRes?.invoiceFeePlatform || '0',
            invoiceFeePlatformTax: repaymentScheduleRes?.invoiceFeePlatformTax || '0',
            invoiceFeeServicing: repaymentScheduleRes?.invoiceFeeServicing || '0',
            invoiceFeeServicingTax: repaymentScheduleRes?.invoiceFeeServicingTax || '0',
            invoiceFeeMonitoring: repaymentScheduleRes?.invoiceFeeMonitoring || '0',
            invoiceFeeMonitoringTax: repaymentScheduleRes?.invoiceFeeMonitoringTax || '0',
            invoiceFeeOther: repaymentScheduleRes?.invoiceFeeOther || '0',
            invoiceFeeOtherTax: repaymentScheduleRes?.invoiceFeeOtherTax || '0',
            invoiceSinkingFund: repaymentScheduleRes?.invoiceSinkingFund || '0',
            invoiceYield: repaymentScheduleRes?.invoiceYield || '0',
            invoiceActualLoss: repaymentScheduleRes?.invoiceActualLoss || '0',
            invoicePenalty: repaymentScheduleRes?.invoicePenalty || '0',
            invoiceTotal: repaymentScheduleRes?.invoiceTotal || '0',
            invoiceTotalTax: repaymentScheduleRes?.invoiceTotalTax || '0',
            invoiceTotalWithTax: repaymentScheduleRes?.invoiceTotalWithTax || '0',
          };
          setInitialData(currentData);
        }
      } catch (error) {
        console.error("Gagal memuat data jadwal", error);
        // Lo bisa tambahin toast notification error di sini
      }
    };

    if (scheduleId) {
      fetchScheduleData();
    }
  }, [scheduleId]);

  const handleUpdateSubmit = async (formData: RepaymentScheduleFormRequest) => {

    if (!repaymentSecurity.id) {
      console.error("Error: repaymentSecurityId tidak ditemukan!");
      return;
    }

    setIsSubmitting(true);

    const payloadData : RepaymentScheduleFormRequest = {
      ...formData,
      invoiceStatus: formData.invoiceStatus === '' ? null : formData.invoiceStatus,
      scheduleType: formData.scheduleType === '' ? null : formData.scheduleType,
      invoiceNumber: formData.invoiceNumber === '-' ? null : formData.invoiceNumber,
    };

    try {
      // Memanggil fungsi POST API dari service 
      await repaymentScheduleService.updateRepaymentSchedule(scheduleId, payloadData);
      
      console.log('Berhasil mengedit jadwal untuk Schedule ID:', scheduleId);
      
      // Bisa tambahkan Toast Notification (Success) di sini
      closePanel(); // Langsung tutup side panel setelah berhasil
    } catch (error) {
      console.error("Gagal mengedit jadwal :", error);
      // Bisa tambahkan Toast Notification (Error) di sini
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-white">
      {initialData ? (
        <RepaymentScheduleForm 
          mode='edit'
          initialData={initialData}
          repaymentSecurity={repaymentSecurity}
          onSubmit={handleUpdateSubmit} 
          isLoading={isSubmitting} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 space-y-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 animate-pulse">Sedang memuat data jadwal...</p>
        </div>
      )}

      
    </div>
  );
}