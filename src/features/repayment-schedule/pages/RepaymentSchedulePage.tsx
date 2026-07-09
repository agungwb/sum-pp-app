// src/pages/repayment/RepaymentSchedule.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import RepaymentReceiptCreateWrapper from '../../repayment-receipt/components/form/RepaymentReceiptCreateWrapper';
import RepaymentReceiptEditWrapper from '../../repayment-receipt/components/form/RepaymentReceiptEditWrapper';
import RepaymentScheduleEditWrapper from '../components/form/RepaymentScheduleEditWrapper';
import FeeWithTax from '../../../components/ui/FeeWithTax';
import { useGlobalMode } from '../../../contexts/GlobalModeContext';
import { useSidePanel } from '../../../contexts/SidePanelContext';
import { InvoiceSummary, RepaymentSchedule, ScheduleItem } from '../types/repayment-schedule.type';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;



export default function RepaymentSchedulePage() {
  const { repaymentId, scheduleId } = useParams<{ 
    repaymentId: string; 
    scheduleId: string; 
  }>();
  
  const [schedule, setSchedule] = useState<ScheduleItem>();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [repayment, setRepayment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk melacak baris yang di-expand
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const { isEditMode } = useGlobalMode();

  const { openPanel } = useSidePanel();

    useEffect(() => {
    const fetchAllDetails = async () => {
        try {
        setLoading(true);
        setError(null);

        // Eksekusi semua request secara paralel menggunakan Axios
        const [scheduleRes, receiptsRes, repaymentSecurityRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/repayment/schedules/${scheduleId}`),
            axios.get(`${API_BASE_URL}/repayment/schedules/${scheduleId}/receipts`),
            axios.get(`${API_BASE_URL}/repayment/securities/${repaymentId}`)
        ]);

        // Axios secara otomatis melakukan auto-parse JSON ke properti '.data'
        // Dan otomatis melempar error jika HTTP Status berstatus 4xx atau 5xx
        
        setSchedule(scheduleRes.data?.data?.item || null);
        setReceipts(receiptsRes.data?.data?.items || []);
        setRepayment(repaymentSecurityRes.data?.data?.item || null); // Sesuaikan dengan struktur envelope API Anda

        } catch (err: any) {
        console.error("Gagal memuat detail data repayment:", err);
        
        // Mengambil pesan error dari Axios response jika ada, jika tidak pakai fallback
        const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan sistem';
        setError(errorMessage);
        } finally {
        setLoading(false);
        }
    };

    // Trigger effect hanya jika kedua ID esensial sudah tersedia
    if (scheduleId && repaymentId) {
        fetchAllDetails();
    }
    }, [scheduleId, repaymentId]);

  // Fungsi toggle untuk expand/collapse row
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => 
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

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

  const invoiceSummary : InvoiceSummary = {
    scheduleId: schedule?.id,
    scheduleType: schedule?.scheduleType || '',
    invoiceFeeAdministration: schedule?.invoiceFeeAdministration || '0',
    invoiceFeeAdministrationTax: schedule?.invoiceFeeAdministrationTax || '0',
    invoiceFeeProvision: schedule?.invoiceFeeProvision || '0',
    invoiceFeeProvisionTax: schedule?.invoiceFeeProvisionTax || '0',
    invoiceFeePlatform: schedule?.invoiceFeePlatform || '0',
    invoiceFeePlatformTax: schedule?.invoiceFeePlatformTax || '0',
    invoiceFeeServicing: schedule?.invoiceFeeServicing || '0',
    invoiceFeeServicingTax: schedule?.invoiceFeeServicingTax || '0',
    invoiceFeeMonitoring: schedule?.invoiceFeeMonitoring || '0',
    invoiceFeeMonitoringTax: schedule?.invoiceFeeMonitoringTax || '0',
    invoiceFeeOther: schedule?.invoiceFeeOther || '0',
    invoiceFeeOtherTax: schedule?.invoiceFeeOtherTax || '0',
    invoiceSinkingFund: schedule?.invoiceSinkingFund || '0',
    invoiceYield: schedule?.invoiceYield || '0',
    invoiceActualLoss: schedule?.invoiceActualLoss || '0',
    invoicePenalty: schedule?.invoicePenalty || '0',
    invoiceTotal: schedule?.invoiceTotal || '0',
    invoiceTotalTax: schedule?.invoiceTotalTax || '0',
    invoiceTotalWithTax: schedule?.invoiceTotalWithTax || '0',
  }

  // Formatter Tanggal Sederhana
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
                {schedule.invoiceNotes.toUpperCase()} (Term {schedule.scheduleSequence})
            </h1>
            {isEditMode && (
                <span className={`px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase inline-block border-2 ${
                    schedule.invoiceStatus === 'OVERDUE' 
                    ? 'bg-amber-50 text-amber-700 border-amber-300' 
                    : schedule.invoiceStatus === 'PAID' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                    {schedule.invoiceStatus}
                </span>
            )}
            
        </div> 

        <p className="text-xs text-slate-400 mt-0.5">ID Jadwal: {schedule.id}</p>
          
        </div>
        <div>
            {!isEditMode && (
                <span className={`px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase inline-block border-2 ${
                    schedule.invoiceStatus === 'OVERDUE' 
                    ? 'bg-amber-50 text-amber-700 border-amber-300' 
                    : schedule.invoiceStatus === 'PAID' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                    {schedule.invoiceStatus}
                </span>
            )}
          
            {isEditMode && (
                <button 
                    onClick={() => openPanel(<RepaymentScheduleEditWrapper receiptId={schedule.id} />)}
                    className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-2 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Ubah Detail
                </button>
            )}
        </div>
        
      </div>

      {/* LAYOUT CONTAINER SUMMARY & DETAIL */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch mb-6">
        
        {/* CONTAINER KIRI: DETAIL KOMPONEN TAGIHAN */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Rincian Komponen Tagihan
          </h2>
          <div className="text-[12px] font-medium space-y-2.5 text-slate-700">

            {Number(schedule?.invoiceFeeAdministration) > 0 ? (
                <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-normal text-slate-900">Biaya Administrasi</span>
                    <FeeWithTax base={Number(schedule.invoiceFeeAdministration)} tax={Number(schedule.invoiceFeeAdministrationTax)}  />
                </div>
            ) : null}

            {Number(schedule?.invoiceFeeProvision) > 0 ? (
                <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-normal text-slate-900">Biaya Provisi</span>
                    <FeeWithTax base={Number(schedule.invoiceFeeProvision)} tax={Number(schedule.invoiceFeeProvisionTax)}  />
                </div>
            ) : null}

            {Number(schedule?.invoiceFeeServicing) > 0 ? (
                <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-normal text-slate-900">Biaya Servicing</span>
                    <FeeWithTax base={Number(schedule.invoiceFeeServicing)} tax={Number(schedule.invoiceFeeServicingTax)}  />
                </div>
            ) : null}

            {Number(schedule?.invoiceFeeMonitoring) > 0 ? (
                <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-normal text-slate-900">Biaya Monitoring</span>
                    <FeeWithTax base={Number(schedule.invoiceFeeMonitoring)} tax={Number(schedule.invoiceFeeMonitoring)}  />
                </div>
            ) : null}

            {Number(schedule?.invoiceFeeOther) > 0 ? (
                <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-normal text-slate-900">Biaya Lain-lain</span>
                    <FeeWithTax base={Number(schedule.invoiceFeeOther)} tax={Number(schedule.invoiceFeeOtherTax)}  />
                </div>
            ) : null}

            {Number(schedule?.invoiceSinkingFund) > 0 ? (
                <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-normal text-slate-900">Cicilan Sinking Fund</span>
                    <FeeWithTax base={Number(schedule.invoiceSinkingFund)}  />
                </div>
            ) : null}

            {Number(schedule?.invoiceYield) > 0 ? (
                <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-normal text-slate-900">Imbal hasil / Kupon</span>
                    <FeeWithTax base={Number(schedule.invoiceYield)}  />
                </div>
            ) : null}

            {Number(schedule?.invoicePenalty) > 0 ? (
                <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-normal text-slate-900">Denda</span>
                    <FeeWithTax base={Number(schedule.invoicePenalty)}  />
                </div>
            ) : null}

            {Number(schedule?.invoiceActualLoss) > 0 ? (
                <div className="flex justify-between items-center p-2 rounded">
                    <span className="font-normal text-slate-900">Kerugian Riil</span>
                    <FeeWithTax base={Number(schedule.invoiceActualLoss)}  />
                </div>
            ) : null}

            <div className="flex justify-between items-center p-2 rounded">
                <span className="font-semibold text-slate-900">TOTAL</span>
                <FeeWithTax base={Number(schedule.invoiceTotal)} tax={Number(schedule.invoiceTotalTax)} size='large' />
            </div>

            <div className="flex justify-between items-center p-2 rounded">
                <span className="font-bold text-slate-900">TOTAL + PAJAK</span>
                <FeeWithTax base={Number(schedule.invoiceTotalWithTax)} size='large-bold'/>
            </div>
            
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
                    <span>No Invoice:</span>
                    <span className="text-slate-900 font-semibold">{schedule.invoiceNumber??'-'}</span>
                </div>
                <div className="flex justify-between  border-b-2 pb-4">
                    <span>Tanggal Invoicing:</span>
                    <span className="text-slate-900 font-semibold">{formatDate(schedule.invoiceDate)}</span>
                </div>
                <div className="flex justify-between pt-2">
                    <span>Total Tagihan:</span>
                    <span className="text-slate-900 font-mono">{formatRupiah(schedule.invoiceTotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tanggal Jatuh Tempo:</span>
                    <span className="text-slate-900 font-semibold text-rose-600">{formatDate(schedule.scheduleDate)}</span>
                </div>

                <div className="flex justify-between border-b-2 pb-4">
                    <span>Catatan / Notes:</span>
                    <span className="text-slate-900 font-semibold italic">{schedule.invoiceNotes || '-'}</span>
                </div>
                
                <div className="flex justify-between pt-2">
                    <span>VA Number</span>
                    
                    {/* Wrapper flex baru biar icon dan teks sejajar rapi */}
                    <div className="flex items-start gap-1.5">
                        <button 
                            type="button"
                            title="copy nomor va"
                            onClick={() => navigator.clipboard.writeText('09812309810283019283')}
                            className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                            {/* SVG Icon Copy proporsional 16px */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={2} 
                                stroke="currentColor" 
                                className="w-4 h-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                            </svg>
                        </button>

                        {/* Note: class text-slate-900 gw hapus karena redundan dan langsung ketimpa sama text-rose-600 */}
                        <span className="font-semibold text-rose-600">
                            {repayment.contractVaNumber}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span>VA Bank</span>
                    <span className="text-slate-900 font-semibold text-rose-600">
                    {repayment.contractVaBank}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Escrow Account</span>
                    
                    {/* Wrapper flex baru biar icon dan teks sejajar rapi */}
                    <div className="flex items-start gap-1.5">
                        {repayment.contractEscrowAccunt &&
                        <button 
                            type="button"
                            title="copy nomor va"
                            onClick={() => navigator.clipboard.writeText('09812309810283019283')}
                            className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                            {/* SVG Icon Copy proporsional 16px */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={2} 
                                stroke="currentColor" 
                                className="w-4 h-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                            </svg>
                        </button>
                        }   

                        {/* Note: class text-slate-900 gw hapus karena redundan dan langsung ketimpa sama text-rose-600 */}
                        <span className="font-semibold text-rose-600">
                            {repayment.contractEscrowAccunt || '-'}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span>Escrow Bank</span>
                    <span className="text-slate-900 font-semibold text-rose-600">
                    {repayment.contractEscrowBank}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Status Invoice:</span>
                    <span className="text-slate-900 font-semibold text-rose-600">
                    {schedule.invoiceStatus || '-'}
                    </span>
                </div>
                </div>
            </div>

            {/* <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-2.5 rounded-lg">
                <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-900">GRAND TOTAL</span>
                <span className="text-base font-mono font-black text-slate-900">
                    {formatRupiah(schedule.invoiceTotalWithTax)}
                </span>
                </div>
            </div> */}
            </div>

      </div>

      {/* TABEL BARU PALING BAWAH: REPAYMENT RECEIPT (RIWAYAT PEMBAYARAN KLIEN) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="mb-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Riwayat Penerimaan Pembayaran (Repayment Receipt)
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Daftar kuitansi setoran dana dari penerbit untuk tagihan term ini</p>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
                <tr className="bg-slate-50 text-[9px] text-slate-500 uppercase tracking-wider border-y border-slate-200">
                    <th className="py-2.5 px-3 w-8"></th>
                    <th className="py-2.5 px-3 font-bold text-left">No</th>
                    <th className="py-2.5 px-3 font-bold text-left">Tanggal Diterima</th>
                    <th className="py-2.5 px-3 font-bold text-center">Metode Pembayaran</th>
                    <th className="py-2.5 px-3 font-bold text-center">Notes</th>
                    <th className="py-2.5 px-3 font-bold text-right">Jumlah Dana Diterima</th>
                    <th className="py-2.5 px-3 font-bold text-center">Status</th>
                    {isEditMode && (
                        <th className="py-2.5 px-3 font-bold text-center">Edit</th>
                    )}
                </tr>
            </thead>
           
            <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-100">
                {receipts.length === 0 ? (
                <tr>
                    <td colSpan={7} className="py-4 px-3 text-center text-slate-500 italic">
                    -- Belum ada riwayat pembayaran --
                    </td>
                </tr>
                ) : (
                receipts.map((rcpt, idx) => {
                    const isExpanded = expandedRows.includes(rcpt.id);
                    return (
                    <React.Fragment key={rcpt.id}>
                        <tr
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => toggleRow(rcpt.id)}
                        >
                        <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${
                                isExpanded ? 'rotate-45 text-rose-500' : 'text-slate-400'
                                }`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            </div>
                        </td>
                        <td className="py-3 px-3">{idx + 1}</td>
                        <td className="py-3 px-3">{formatDate(rcpt.receiptDate)}</td>
                        <td className="py-3 px-3 text-center">
                            BANK TRANSFER
                        </td>
                        <td className="py-3 px-3 text-center">
                            {rcpt.receiptNotes}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                            {formatRupiah(rcpt.receiptTotalWithTax)}
                        </td>
                        <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase inline-block bg-emerald-50 text-emerald-600 border border-emerald-200">
                            {rcpt.receiptStatus}
                            </span>
                        </td>
                        {isEditMode && (
                            <td className="py-3 px-3 text-left align-top">
                                <button 
                                onClick={() => openPanel(<RepaymentReceiptEditWrapper receiptId={rcpt.id} invoiceSummary={invoiceSummary} />)}
                                className="text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1 py-1 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </td>)}
                        </tr>
                        {/* EXPANDED ROW (DUMMY DETAIL) */}
                        {isExpanded && (
                        <tr>
                            <td colSpan={7} className="p-0 border-b border-slate-100 bg-slate-50/50">
                            <div className="py-4 px-6 mr-24 my-2 flex justify-end gap-4 text-[11px] animate-in fade-in duration-300">
                                {/* <div className="w-1/3 bg">
                                    <span className="block text-slate-400 mb-1">ID Transaksi</span>
                                    <span className="font-semibold text-slate-700">tes satu dua tiga</span>
                                </div> */}
                                <div className="w-1/2 bg border-l-2 border-slate-300">
                                {Number(rcpt?.receiptFeeAdministration) > 0 ? (
                                    <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-normal text-slate-900">Biaya Administrasi</span>
                                    <FeeWithTax base={Number(rcpt.receiptFeeAdministration)} tax={Number(rcpt.receiptFeeAdministrationTax)} />
                                    </div>
                                ) : null}

                                {Number(rcpt?.receiptFeeProvision) > 0 ? (
                                    <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-normal text-slate-900">Biaya Provisi</span>
                                    <FeeWithTax base={Number(rcpt.receiptFeeProvision)} tax={Number(rcpt.receiptFeeProvisionTax)} />
                                    </div>
                                ) : null}

                                {Number(rcpt?.receiptFeeServicing) > 0 ? ( 
                                    <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-normal text-slate-900">Biaya Servicing</span>
                                    <FeeWithTax base={Number(rcpt.receiptFeeServicing)} tax={Number(rcpt.receiptFeeServicingTax)} />
                                    </div>
                                ) : null}

                                {Number(rcpt?.receiptFeeMonitoring) > 0 ? (
                                    <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-normal text-slate-900">Biaya Monitoring</span>
                                    <FeeWithTax base={Number(rcpt.receiptFeeMonitoring)} tax={Number(rcpt.receiptFeeMonitoring)} />
                                    </div>
                                ) : null}

                                {Number(rcpt?.receiptFeeOther) > 0 ? (
                                    <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-normal text-slate-900">Biaya Lain-lain</span>
                                    <FeeWithTax base={Number(rcpt.receiptFeeOther)} tax={Number(rcpt.receiptFeeOtherTax)} />
                                    </div>
                                ) : null}

                                {Number(rcpt?.receiptSinkingFund) > 0 ? (
                                    <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-normal text-slate-900">Cicilan Sinking Fund</span>
                                    <FeeWithTax base={Number(rcpt.receiptSinkingFund)} />
                                    </div>
                                ) : null}

                                {Number(rcpt?.receiptYield) > 0 ? (
                                    <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-normal text-slate-900">Imbal hasil / Kupon</span>
                                    <FeeWithTax base={Number(rcpt.receiptYield)} />
                                    </div>
                                ) : null}

                                {Number(rcpt?.receiptPenalty) > 0 ? (
                                    <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-normal text-slate-900">Denda</span>
                                    <FeeWithTax base={Number(rcpt.receiptPenalty)} />
                                    </div>
                                ) : null}

                                {Number(rcpt?.receiptActualLoss) > 0 ? (
                                    <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-normal text-slate-900">Kerugian Riil</span>
                                    <FeeWithTax base={Number(rcpt.receiptActualLoss)} />
                                    </div>
                                ) : null}

                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-semibold text-slate-900">TOTAL</span>
                                    <FeeWithTax base={Number(rcpt.receiptTotal)} tax={Number(rcpt.receiptTotalTax)} />
                                </div>

                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                    <span className="font-bold text-slate-900">TOTAL + PAJAK</span>
                                    <FeeWithTax base={Number(rcpt.receiptTotalWithTax)} />
                                </div>
                                </div>
                            </div>
                            </td>
                        </tr>
                        )}
                    </React.Fragment>
                    );
                })
                )}
               
                {/* Row Tambah Receipt Pembayaran (Tema Edit / Amber) */}
                {isEditMode && (
                <tr>
                    <td colSpan={2}></td>
                    <td colSpan={5} className="p-0">
                    <button
                        onClick={() => openPanel(<RepaymentReceiptCreateWrapper invoiceSummary={invoiceSummary} />)}
                        type="button"
                        className="flex items-center justify-center w-full p-2 m-2 border-2 border-dashed border-amber-300 bg-amber-50/50 text-amber-700 rounded-xl hover:bg-amber-100 hover:border-amber-400 transition-all group focus:outline-none focus:ring-2 focus:ring-amber-200"
                    >
                        <div className="bg-amber-200/60 p-1.5 rounded-full group-hover:bg-amber-300 transition-colors">
                            <svg className="w-4 h-4 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                        <span className="text-[11px] font-bold tracking-wider">Tambah Bukti Pembayaran</span>
                    </button>
                    </td>
                </tr>
                )}

                {receipts.length > 0 && (
                <tr className="bg-slate-50/50 border-t border-slate-200 font-bold">
                    <td colSpan={5} className="py-2.5 px-3 text-right text-slate-900 text-xs uppercase">
                    Total Pembayaran Diterima
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700 text-xs">
                    {formatRupiah(receipts.reduce((sum, item) => sum + Number(item.receiptTotalWithTax || 0), 0))}
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}