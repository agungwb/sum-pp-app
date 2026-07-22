import React, { useState } from 'react';
import RepaymentScheduleForm from './RepaymentScheduleForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentScheduleService } from '../../services/repaymentScheduleService';
import { ScheduleType, InvoiceStatus } from '../../types/repayment-schedule.enum';
import { RepaymentScheduleEditFormResponse, RepaymentScheduleFormRequest } from '../../dtos/repayment-schedule.dto';
import { RepaymentSecurityDetailResponse, RepaymentSecuritySummaryResponse, RepaymentSecurityWithSinkingFundResponse } from '../../../repayment-security/dtos/repayment-security.dto'
import { RepaymentScheduleSummary } from '../../types/repayment-schedule.type';



interface CreateWrapperProps {
  repaymentSecurity: RepaymentSecurityDetailResponse;
  lastInstallment?: RepaymentScheduleSummary | null;
  lastUpfront?: RepaymentScheduleSummary | null;
}

export default function RepaymentScheduleCreateWrapper({ repaymentSecurity, lastUpfront, lastInstallment }: CreateWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buat default state yang aman untuk form baru agar kalkulasi Big.js tidak error (NaN)



  const defaultInitialData: RepaymentScheduleFormRequest = {
    repaymentSecurityId: repaymentSecurity.securityId,
    scheduleType: null, // Default value
    scheduleSequence: 0, // Default urutan pertama
    scheduleDate: '', 
    invoiceDate: '', 
    invoiceNumber: '-',
    invoiceSentTrial: 0,
    invoiceStatus: null, // Default jadwal baru biasanya Draft
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

  const handleCreateSubmit = async (formData: RepaymentScheduleFormRequest) => {
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
      await repaymentScheduleService.createRepaymentSchedule(repaymentSecurity.id, payloadData);
      
      console.log('Berhasil membuat jadwal baru untuk Security ID:', repaymentSecurity.id);
      
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
        repaymentSecurity={repaymentSecurity}
        lastUpfront={lastUpfront}
        lastInstallment={lastInstallment}
        onSubmit={handleCreateSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}