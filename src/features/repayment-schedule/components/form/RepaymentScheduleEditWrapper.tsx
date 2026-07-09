import React, { useState, useEffect } from 'react';
import RepaymentScheduleForm from './RepaymentScheduleForm';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { repaymentScheduleService } from '../../services/repaymentScheduleService';
import { RepaymentScheduleEditResponse, RepaymentScheduleRequest } from '../../dtos/repayment-schedule.dto';
import { RepaymentSecuritySummary } from '../../../repayment-security/types/repayment-security.type';
import { InvoiceStatus, ScheduleType } from '../../types/repayment-schedule.enum';


interface EditWrapperProps {
  scheduleId: string;
  repaymentSecSummary: RepaymentSecuritySummary;
}

export default function RepaymentScheduleEditWrapper({ scheduleId, repaymentSecSummary}: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<RepaymentScheduleRequest | null>(null);
  
  // State Modal Konfirmasi
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<RepaymentScheduleRequest | null>(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await repaymentScheduleService.getScheduleEditResponse(scheduleId);
        // Ngambil data.item berdasarkan format JSON yang lo kasih
        if (response.data && response.data.item) {
          
          const repaymentScheduleRes: RepaymentScheduleEditResponse = response.data.item;
          const currentData: RepaymentScheduleRequest = {
            scheduleType: repaymentScheduleRes?.scheduleType || '', // Default value
            scheduleSequence: repaymentScheduleRes?.scheduleSequence || 0, // Default urutan pertama
            scheduleDate: repaymentScheduleRes?.scheduleDate || '', 
            invoiceDate: repaymentScheduleRes?.invoiceDate || '', 
            invoiceNumber: repaymentScheduleRes?.invoiceNumber || '',
            invoiceSentTrial: repaymentScheduleRes?.invoiceSentTrial || 0,
            invoiceStatus: repaymentScheduleRes?.invoiceStatus || '', // Default jadwal baru biasanya Draft
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

  // Ini cuma nge-trigger buka modal
  const handleFormSubmitRequest = (formData: RepaymentScheduleRequest) => {
    setPendingFormData(formData);
    setShowConfirmModal(true);
  };

  // Ini baru beneran execute API Call PUT
  const confirmAndSubmit = async () => {
    if (!pendingFormData) return;
    
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      await repaymentScheduleService.updateSchedule(scheduleId, pendingFormData);
      console.log('Update Success for ID:', scheduleId);
      closePanel();
    } catch (error) {
      console.error("Gagal update jadwal", error);
    } finally {
      setIsSubmitting(false);
      setPendingFormData(null);
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-white">
      {initialData ? (
        <RepaymentScheduleForm 
          mode='edit'
          initialData={initialData}
          repaymentSecSummary={repaymentSecSummary}
          onSubmit={handleFormSubmitRequest} 
          isLoading={isSubmitting} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 space-y-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 animate-pulse">Sedang memuat data jadwal...</p>
        </div>
      )}

      {/* Modal Konfirmasi Bawaan Tailwind */}
      {showConfirmModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Konfirmasi Perubahan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menyimpan perubahan pada jadwal pembayaran ini? Pastikan nominal yang dimasukkan sudah benar.
              </p>
            </div>
            <div className="flex bg-slate-50 border-t border-slate-100 px-4 py-3 justify-end gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={confirmAndSubmit}
                className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded hover:bg-amber-700 transition-colors"
                disabled={isSubmitting}
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}