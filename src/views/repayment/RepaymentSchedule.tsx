// src/pages/repayment/RepaymentSchedule.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

interface ScheduleItem {
  id: string;
  repaymentSecurityId: string;
  scheduleOrder: number;
  scheduleDate: string;
  invoiceDate: string;
  invoiceStatus: string;
  invoiceNotes: string;
  invoiceFeeAdministration: string;
  invoiceFeeAdministrationTax: string;
  invoiceFeeProvision: string;
  invoiceFeeProvisionTax: string;
  invoiceFeePlatform: string;
  invoiceFeePlatformTax: string;
  invoiceFeeServicing: string;
  invoiceFeeServicingTax: string;
  invoiceFeeMonitoring: string;
  invoiceFeeMonitoringTax: string;
  invoiceFeeOther: string;
  invoiceFeeOtherTax: string;
  invoiceSinkingFund: string;
  invoiceYield: string;
  invoiceActualLoss: string;
  invoicePenalty: string;
  invoiceTotal: string;
  invoiceTotalTax: string;
  invoiceTotalWithTax: string;
  createdBy: string;
  createdAt: string;
}

// Dummy interface untuk Repayment Receipt
interface RepaymentReceipt {
  id: string;
  receiptNumber: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  bankName: string;
  status: string;
}

export default function RepaymentSchedule() {
  const { id: scheduleId } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<ScheduleItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Data Dummy untuk Tabel Repayment Receipt di bagian bawah
  const dummyReceipts: RepaymentReceipt[] = [
    {
      id: 'rcpt-001',
      receiptNumber: 'REC/2026/01/0082',
      amountPaid: 500000000,
      paymentDate: '2026-01-26T10:30:00.000Z',
      paymentMethod: 'Escrow Transfer',
      bankName: 'Bank Mandiri',
      status: 'VERIFIED',
    },
    {
      id: 'rcpt-002',
      receiptNumber: 'REC/2026/01/0095',
      amountPaid: 364975000,
      paymentDate: '2026-01-28T14:15:00.000Z',
      paymentMethod: 'Escrow Transfer',
      bankName: 'Bank BCA',
      status: 'VERIFIED',
    },
  ];

  useEffect(() => {
    const fetchScheduleDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/repayment/schedules/${scheduleId}`);
        if (!response.ok) throw new Error('Gagal mengambil data jadwal pembayaran');
        
        const result = await response.json();
        setSchedule(result.data?.item || null);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem');
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchScheduleDetail();
    }
  }, [scheduleId]);

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
    <div className="p-6 bg-slate-50 min-h-screen text-slate-600">
      {/* BREADCRUMB / NAVIGASI ATAS */}
      <div className="mb-5 flex items-center space-x-2 text-xs">
        <Link to="/repayment" className="text-slate-400 hover:text-slate-600">Repayment</Link>
        <span className="text-slate-300">/</span>
        <Link to={`/repayment/${schedule.repaymentSecurityId}`} className="text-slate-400 hover:text-slate-600">Detail Kontrak</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-semibold">Rincian Jadwal</span>
      </div>

      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {schedule.invoiceNotes.toUpperCase()} (Term {schedule.scheduleOrder})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">ID Jadwal: {schedule.id}</p>
        </div>
        <div>
          <span className={`px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase inline-block border-2 ${
            schedule.invoiceStatus === 'OVERDUE' 
              ? 'bg-amber-50 text-amber-700 border-amber-300' 
              : schedule.invoiceStatus === 'PAID' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            {schedule.invoiceStatus}
          </span>
        </div>
      </div>

      {/* LAYOUT CONTAINER SUMMARY & DETAIL (Benchmark Style: RepaymentDetail) */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch mb-6">
        
        {/* CONTAINER KIRI: DETAIL KOMPONEN TAGIHAN */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Rincian Komponen Tagihan
          </h2>
          <div className="text-[11px] font-medium space-y-2.5 text-slate-700">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
              <span className="font-semibold text-slate-900">Pokok Sinking Fund</span>
              <span className="font-mono text-slate-900 font-bold">{formatRupiah(schedule.invoiceSinkingFund)}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
              <span className="font-semibold text-slate-900">Imbal Hasil / Kupon</span>
              <span className="font-mono text-slate-900 font-bold">{formatRupiah(schedule.invoiceYield)}</span>
            </div>
            
            <div className="pt-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Biaya Pemantauan & Operasional</span>
              <div className="flex justify-between items-center mt-1">
                <span>Biaya Pemantauan (Base)</span>
                <span className="font-mono">{formatRupiah(schedule.invoiceFeeMonitoring)}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>Pajak Biaya Pemantauan</span>
                <span className="font-mono text-amber-600">+{formatRupiah(schedule.invoiceFeeMonitoringTax)}</span>
              </div>
            </div>

            {parseFloat(schedule.invoicePenalty) > 0 && (
              <div className="flex justify-between items-center bg-rose-50 p-2 rounded text-rose-700 mt-2">
                <span className="font-semibold">Denda Keterlambatan (Penalty)</span>
                <span className="font-mono font-bold">{formatRupiah(schedule.invoicePenalty)}</span>
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
                <span>Tanggal Invoicing:</span>
                <span className="text-slate-900 font-semibold">{formatDate(schedule.invoiceDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Jatuh Tempo:</span>
                <span className="text-slate-900 font-semibold text-rose-600">{formatDate(schedule.scheduleDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Tagihan Bersih:</span>
                <span className="text-slate-900 font-mono">{formatRupiah(schedule.invoiceTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Akumulasi Pajak:</span>
                <span className="text-slate-900 font-mono">{formatRupiah(schedule.invoiceTotalTax)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-2.5 rounded-lg">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-900">GRAND TOTAL</span>
              <span className="text-base font-mono font-black text-slate-900">
                {formatRupiah(schedule.invoiceTotalWithTax)}
              </span>
            </div>
          </div>
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
                <th className="py-2.5 px-3 font-bold text-left">No. Kuitansi</th>
                <th className="py-2.5 px-3 font-bold text-left">Tanggal Setor</th>
                <th className="py-2.5 px-3 font-bold text-left">Metode Pembayaran</th>
                <th className="py-2.5 px-3 font-bold text-left">Bank Tujuan</th>
                <th className="py-2.5 px-3 font-bold text-center">Status</th>
                <th className="py-2.5 px-3 font-bold text-right">Jumlah Dibayarkan</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-100">
              {dummyReceipts.map((rcpt) => (
                <tr key={rcpt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-slate-900 font-bold">{rcpt.receiptNumber}</td>
                  <td className="py-3 px-3">{formatDate(rcpt.paymentDate)}</td>
                  <td className="py-3 px-3 text-slate-500">{rcpt.paymentMethod}</td>
                  <td className="py-3 px-3 text-slate-500">{rcpt.bankName}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase inline-block bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {rcpt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                    {formatRupiah(rcpt.amountPaid)}
                  </td>
                </tr>
              ))}
              {/* Row Total Receipt */}
              <tr className="bg-slate-50/50 font-bold">
                <td colSpan={5} className="py-2.5 px-3 text-right text-slate-900 text-xs uppercase">Total Pembayaran Diterima</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 text-xs">
                  {formatRupiah(dummyReceipts.reduce((sum, item) => sum + item.amountPaid, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}