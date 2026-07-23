// src/pages/repayment/RepaymentSchedulePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RepaymentScheduleEditWrapper from '../components/form/RepaymentScheduleEditWrapper';
import ReceiptPanel from '../components/schedule/ReceiptPanel';
import FeeWithTax from '../../../components/ui/FeeWithTax';
import { useGlobalMode } from '../../../contexts/GlobalModeContext';
import { useSidePanel } from '../../../contexts/SidePanelContext';
import { InvoiceSummary, InvoiceSummaryBig, InvoiceSummaryWithPenaltyBig } from '../types/repayment-schedule.type';
import InvoiceStatusBadge from '../../repayment-security/components/badge/InvoiceStatusBadge';
import { ScheduleType } from '../types/repayment-schedule.enum';
import { repaymentScheduleService } from '../services/repaymentScheduleService';
import { repaymentReceiptService } from '../../repayment-receipt/services/repaymentReceiptService';
import { repaymentSecurityService } from '../../repayment-security/services/repaymentSecurityService';
import { RepaymentSecurityDetailResponse } from '../../repayment-security/dtos/repayment-security.dto';
import { RepaymentScheduleDetailWithPenaltyResponse } from '../dtos/repayment-schedule.dto';
import { RepaymentReceiptDetailResponse } from '../../repayment-receipt/dtos/repayment-receipt.dto';
import { toSafeBig } from '../../../utils/number';
import { calculateDays } from '../../../utils/date';
import Penalty from '../../../components/ui/Penalty';

export default function RepaymentSchedulePage() {
  const { repaymentId, scheduleId } = useParams<{ 
    repaymentId: string; 
    scheduleId: string; 
  }>();
  
  const [schedule, setSchedule] = useState<RepaymentScheduleDetailWithPenaltyResponse | null > (null);
  const [receipts, setReceipts] = useState<RepaymentReceiptDetailResponse[]>([]);
  const [repaymentSecurity, setRepaymentSecurity] = useState<RepaymentSecurityDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isEditMode } = useGlobalMode();
  const { openPanel } = useSidePanel();

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        setLoading(true);
        setError(null);
    
        const [scheduleRes, receiptsRes, repaymentSecurityRes] = await Promise.all([
          repaymentScheduleService.getRepaymentScheduleDetailWithPenalty(scheduleId!),
          repaymentReceiptService.getRepaymentReceipts(scheduleId!),
          repaymentSecurityService.getRepaymentSecurityDetail(repaymentId!)
        ]);
    
        setSchedule(scheduleRes.data.item);
        setReceipts(receiptsRes.data.items || []);
        setRepaymentSecurity(repaymentSecurityRes.data.item);
    
      } catch (err: any) {
        console.error("Gagal memuat detail data repayment:", err);
        const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan sistem';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId && repaymentId) {
      fetchAllDetails();
    }
  }, [scheduleId, repaymentId]);

  // Formatter Rupiah Standar Project
  const formatRupiah = (value: string | number) => {
    const numeric = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numeric)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numeric);
  };

  // Formatter Tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const invoiceSummary: InvoiceSummaryWithPenaltyBig = {
        id: schedule?.id ?? '',
        scheduleType: schedule?.scheduleType ?? null,
        scheduleSequence: schedule?.scheduleSequence ?? 0,
        scheduleDate: schedule?.scheduleDate ?? '',
        invoiceFeeAdministration : toSafeBig(schedule?.invoiceFeeAdministration),
        invoiceFeeAdministrationTax : toSafeBig(schedule?.invoiceFeeAdministrationTax),
        invoiceFeeProvision : toSafeBig(schedule?.invoiceFeeProvision),
        invoiceFeeProvisionTax : toSafeBig(schedule?.invoiceFeeProvisionTax),
        invoiceFeePlatform : toSafeBig(schedule?.invoiceFeePlatform),
        invoiceFeePlatformTax : toSafeBig(schedule?.invoiceFeePlatformTax),
        invoiceFeeServicing : toSafeBig(schedule?.invoiceFeeServicing),
        invoiceFeeServicingTax : toSafeBig(schedule?.invoiceFeeServicingTax),
        invoiceFeeMonitoring : toSafeBig(schedule?.invoiceFeeMonitoring),
        invoiceFeeMonitoringTax : toSafeBig(schedule?.invoiceFeeMonitoringTax),
        invoiceFeeOther : toSafeBig(schedule?.invoiceFeeOther),
        invoiceFeeOtherTax : toSafeBig(schedule?.invoiceFeeOtherTax),
        invoiceSinkingFund : toSafeBig(schedule?.invoiceSinkingFund),
        invoiceYield : toSafeBig(schedule?.invoiceYield),
        invoiceActualLoss : toSafeBig(schedule?.invoiceActualLoss),
        invoicePenalty : toSafeBig(schedule?.invoicePenalty),
        invoiceTotal : toSafeBig(schedule?.invoiceTotal),
        invoiceTotalTax : toSafeBig(schedule?.invoiceTotalTax),
        invoiceTotalWithTax : toSafeBig(schedule?.invoiceTotalWithTax),
        outstandingTotalWithTax : toSafeBig(schedule?.outstandingTotalWithTax),
        penaltySettled : toSafeBig(schedule?.penaltySettled),
        penaltyCalculated : toSafeBig(schedule?.penaltyCalculated),
        penaltyIsSettled : schedule?.penaltyIsSettled ?? false,
        taxPpn : toSafeBig(repaymentSecurity?.contractTaxPpn),
        taxFactor : toSafeBig(repaymentSecurity?.contractTaxFactor)
  }

  //DENDA
  const daysOverdue = calculateDays(null, invoiceSummary.scheduleDate);
  const penalty = invoiceSummary.penaltyIsSettled?invoiceSummary.penaltySettled:invoiceSummary.penaltyCalculated;
  const actualLoss = invoiceSummary.invoiceActualLoss;
  const invoiceTotalWithTaxAndPenalty = 
        invoiceSummary.invoiceTotalWithTax
        .plus(invoiceSummary.invoiceActualLoss)
        .plus(penalty);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm font-medium text-slate-400 animate-pulse">Memuat rincian jadwal...</div>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-sm text-rose-600 font-medium text-center">
        ⚠️ {error || 'Data rincian jadwal tidak ditemukan.'}
      </div>
    );
  }

  return (
    <div className="p-6 mt-12 bg-slate-50 min-h-screen text-slate-600">
      {/* BREADCRUMB / NAVIGASI ATAS */}
      <div className="mb-5 flex items-center space-x-2 text-xs">
        <Link to="/repayment" className="text-slate-400 hover:text-slate-600">Repayment</Link>
        <span className="text-slate-300">/</span>
        <Link to={`/repayment/${schedule.repaymentSecurityId}`} className="text-slate-400 hover:text-slate-600">Detail Kontrak</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-semibold">Rincian Jadwal</span>
      </div>

      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-8">
        <div>
          <div className="flex gap-4">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {schedule.scheduleType === ScheduleType.INSTALLMENT 
                ? `INVOICE CICILAN BULAN KE ${schedule.scheduleSequence}`
                : `INVOICE UPFRONT KE ${schedule.scheduleSequence}`}
            </h1>
          </div> 

          <p className="text-xs text-slate-400 mt-0.5">
            {schedule.scheduleType === ScheduleType.INSTALLMENT 
              ? `Detail rincian invoice cicilan dan riwayat pembayaran pada bulan ke ${schedule.scheduleSequence}`
              : `Detail rincian invoice biaya di awal (upfront fee) dan riwayat pembayaran`}
          </p>
        </div>
        <div>
          <InvoiceStatusBadge status={schedule.invoiceStatus || null} size="lg"/>
        </div>
      </div>

      {/* LAYOUT CONTAINER SUMMARY & DETAIL */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch mb-6">
        
        {/* CONTAINER KIRI: DETAIL KOMPONEN TAGIHAN */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl border-2 border-slate-200 shadow-sm px-4 flex flex-col justify-start">
          <div className='h-14 flex items-center justify-between border-b-2 border-slate-100'>
            <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider pt-0.5 shrink-0">
              Rincian Komponen Tagihan
            </h3>
            <div>
              {isEditMode && (
                <button 
                  onClick={() => openPanel(<RepaymentScheduleEditWrapper scheduleId={schedule.id} repaymentSecurity={repaymentSecurity}/>)}
                  className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-2 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Ubah Detail
                </button>
              )}
            </div>
          </div>
         
          <div className="text-[13px] font-medium space-y-2.5 text-slate-700 pt-2 pb-4">
            {invoiceSummary.invoiceFeeAdministration.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Biaya Administrasi</span>
                <FeeWithTax base={invoiceSummary.invoiceFeeAdministration} tax={invoiceSummary.invoiceFeeAdministrationTax} />
              </div>
            )}

            {invoiceSummary.invoiceFeeProvision.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Biaya Provisi</span>
                <FeeWithTax base={invoiceSummary.invoiceFeeProvision} tax={invoiceSummary.invoiceFeeProvisionTax} />
              </div>
            )}

            {invoiceSummary.invoiceFeePlatform.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Biaya Platform</span>
                <FeeWithTax base={invoiceSummary.invoiceFeePlatform} tax={invoiceSummary.invoiceFeePlatformTax} />
              </div>
            )}

            {invoiceSummary.invoiceFeeServicing.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Biaya Servicing</span>
                <FeeWithTax base={invoiceSummary.invoiceFeeServicing} tax={invoiceSummary.invoiceFeeServicingTax} />
              </div>
            )}

            {invoiceSummary.invoiceFeeMonitoring.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Biaya Monitoring</span>
                <FeeWithTax base={invoiceSummary.invoiceFeeMonitoring} tax={invoiceSummary.invoiceFeeMonitoringTax} />
              </div>
            )}

            {invoiceSummary.invoiceFeeOther.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Biaya Lain-lain</span>
                <FeeWithTax base={invoiceSummary.invoiceFeeOther} tax={invoiceSummary.invoiceFeeOtherTax} />
              </div>
            )}

            {invoiceSummary.invoiceSinkingFund.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Cicilan Sinking Fund</span>
                <FeeWithTax base={invoiceSummary.invoiceSinkingFund} />
              </div>
            )}

            {invoiceSummary.invoiceYield.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Imbal hasil / Kupon</span>
                <FeeWithTax base={invoiceSummary.invoiceYield} />
              </div>
            )}

            {invoiceSummary.invoicePenalty.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Denda</span>
                <FeeWithTax base={invoiceSummary.invoicePenalty} />
              </div>
            )}

            {invoiceSummary.invoiceActualLoss.gt(0) && (
              <div className="flex justify-between items-center p-2 rounded">
                <span className="font-normal text-slate-900">Kerugian Riil</span>
                <FeeWithTax base={invoiceSummary.invoiceActualLoss} />
              </div>
            )}

            <div className="mt-4 border-slate-300 flex flex-col bg-blue-50 border-t-2 border-dashed">
                <div className="flex justify-between items-center p-2 rounded border-t border-slate-100 mt-1.5">
                <span className="font-semibold text-slate-900">TOTAL</span>
                <FeeWithTax base={invoiceSummary.invoiceTotal} tax={invoiceSummary.invoiceTotalTax} weight="bold" />
                </div>

                <div className="flex justify-between items-center p-2 rounded">
                <span className="font-bold text-slate-900">TOTAL + PPN</span>
                <FeeWithTax base={invoiceSummary.invoiceTotalWithTax} size="lg" weight="bold" />
                </div>
            </div>

            { !!daysOverdue && daysOverdue > 0 && (
                <div className="mt-4 border-rose-200 flex flex-col bg-red-50 border-t-2 border-dashed">
                    <div className="flex justify-between items-center p-2 rounded border-t border-slate-100 mt-1.5">
                    <span className="font-normal ">Denda (total {daysOverdue} hari)</span>

                    <Penalty penalty={penalty} size="md" mode={invoiceSummary.penaltyIsSettled ? 'settled' : 'ongoing'}/>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded border-t border-slate-100">
                    <span className="font-normal ">Kerugian Riil</span>
                    <FeeWithTax base={actualLoss} />
                    </div>

                    <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-bold text-slate-900">TOTAL + PPN + Denda + Kerugian Riil</span>
                    <FeeWithTax base={invoiceTotalWithTaxAndPenalty} size="lg" weight="bold" />
                    </div>
                </div>
            )}
            
          </div>
        </div>

        {/* CONTAINER KANAN: RINGKASAN AKUMULASI (SUMMARY) */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Ringkasan Invoice
            </h2>
            <div className="text-[11px] font-medium space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Status Invoice</span>
                <span className="font-semibol">
                  {schedule.invoiceStatus || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>No Invoice</span>
                <span className="text-slate-900 font-semibold">{schedule.invoiceNumber ?? '-'}</span>
              </div>
              <div className="flex justify-between border-b-2 pb-4">
                <span>Tanggal Invoicing</span>
                <span className="text-slate-900 font-semibold">{formatDate(schedule.invoiceDate ?? '')}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Total Tagihan</span>
                <span className="text-slate-900 font-mono">{formatRupiah(schedule.invoiceTotalWithTax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Jatuh Tempo</span>
                <span className="text-slate-900 font-semibold">{formatDate(schedule.scheduleDate)}</span>
              </div>

              <div className="flex justify-between border-b-2 pb-4">
                <span>Catatan / Notes</span>
                <span className="text-slate-900 font-semibold italic">{schedule.invoiceNotes || '-'}</span>
              </div>
              
              <div className="flex justify-between pt-2">
                <span>VA Number</span>
                <div className="flex items-start gap-1.5">
                  <button 
                    type="button"
                    title="copy nomor va"
                    onClick={() => navigator.clipboard.writeText(repaymentSecurity?.contractVaNumber || '')}
                    className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                  </button>
                  <span className="font-semibold text-slate-900">
                    {repaymentSecurity?.contractVaNumber} ({repaymentSecurity?.contractVaBank})
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <span>Escrow Account</span>
                <div className="flex items-start gap-1.5">
                  {repaymentSecurity?.contractEscrowAccunt && (
                    <button 
                      type="button"
                      title="copy nomor escrow"
                      onClick={() => navigator.clipboard.writeText(repaymentSecurity.contractEscrowAccunt || '')}
                      className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                      </svg>
                    </button>
                  )}
                  <span className="font-semibold text-slate-900">
                    {repaymentSecurity?.contractEscrowAccunt || '-'} ({repaymentSecurity?.contractEscrowBank || '-'})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KOMPONEN RECEIPT PANEL (KOMPONEN TABEL DIPISAH) */}
      <ReceiptPanel receipts={receipts} invoiceSummary={invoiceSummary} />
    </div>
  );
}