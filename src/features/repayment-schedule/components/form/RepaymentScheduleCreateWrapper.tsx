import React, { useState } from 'react';
import RepaymentScheduleForm from './RepaymentScheduleForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentScheduleService } from '../../services/repaymentScheduleService';
import { ScheduleType, InvoiceStatus } from '../../types/repayment-schedule.enum';
import { RepaymentSecuritySummary } from '../../../repayment-security/types/repayment-security.type';
import { RepaymentScheduleRequest } from '../../dtos/repayment-schedule.dto';

interface CreateWrapperProps {
  repaymentSecSummary: RepaymentSecuritySummary;
}

export default function RepaymentScheduleCreateWrapper({ repaymentSecSummary }: CreateWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buat default state yang aman untuk form baru agar kalkulasi Big.js tidak error (NaN)
  const defaultInitialData: RepaymentScheduleRequest = {
    scheduleType: '', // Default value
    scheduleSequence: 0, // Default urutan pertama
    scheduleDate: '', 
    invoiceDate: '', 
    invoiceNumber: '',
    invoiceSentTrial: 0,
    invoiceStatus: '', // Default jadwal baru biasanya Draft
    invoiceNotes: '',
    invoiceFeeAdministration: '0',
    invoiceFeeAdministrationTax: '0',
    invoiceFeeProvision: '0',
    invoiceFeeProvisionTax: '0',
    invoiceFeePlatform: '0',
    invoiceFeePlatformTax: '0',
    invoiceFeeServicing: '0',
    invoiceFeeServicingTax: '0',
    invoiceFeeMonitoring: '0',
    invoiceFeeMonitoringTax: '0',
    invoiceFeeOther: '0',
    invoiceFeeOtherTax: '0',
    invoiceSinkingFund: '0',
    invoiceYield: '0',
    invoiceActualLoss: '0',
    invoicePenalty: '0',
    invoiceTotal: '0',
    invoiceTotalTax: '0',
    invoiceTotalWithTax: '0',
  };

  const handleCreateSubmit = async (formData: RepaymentScheduleRequest) => {
    if (!repaymentSecSummary.id) {
      console.error("Error: repaymentSecurityId tidak ditemukan!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Memanggil fungsi POST API dari service 
      await repaymentScheduleService.createSchedule(repaymentSecSummary.id, formData);
      
      console.log('Berhasil membuat jadwal baru untuk Security ID:', repaymentSecSummary.id);
      
      // Bisa tambahkan Toast Notification (Success) di sini
      closePanel(); // Langsung tutup side panel setelah berhasil
    } catch (error) {
      console.error("Gagal membuat jadwal baru:", error);
      // Bisa tambahkan Toast Notification (Error) di sini
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-white">
      <RepaymentScheduleForm 
        mode='add'
        initialData={defaultInitialData}
        repaymentSecSummary={repaymentSecSummary}
        onSubmit={handleCreateSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}