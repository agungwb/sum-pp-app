// src/pages/repayment/RepaymentDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RepaymentScheduleCreateWrapper from '../../repayment-schedule/components/form/RepaymentScheduleCreateWrapper';
import RepaymentScheduleEditWrapper from '../../repayment-schedule/components/form/RepaymentScheduleEditWrapper';
import RepaymentSecurityEditWrapper from '../components/form/RepaymentSecurityEditWrapper';
import RepaymentSecurityForm from '../components/form/RepaymentSecurityForm';
import FeeWithTax from '../../../components/ui/FeeWithTax';
import InfoRow from '../../../components/ui/InfoRow';
import { useGlobalMode } from '../../../contexts/GlobalModeContext';
import { useSidePanel } from '../../../contexts/SidePanelContext';
import { RepaymentSecurity, ApiResponse, ContractStatus, SecurityType } from '../types';
import { calculateTax } from '../../../utils/finance';
import { toFrontendPercentage } from '../../../utils/finance';
import { repaymentSecurityService } from '../services/repaymentSecurityService';
import { repaymentScheduleService } from '../../repayment-schedule/services/repaymentScheduleService';
// import { repaymentReceiptService } from '../../repayment-receipt/services/repaymentReceiptService';
import { securityCollateralService } from '../../security-collateral/services/securityCollateralService';
import { SecurityCollateral } from '../../security-collateral/types/collateral-item';
import CheckOrCross from '../components/detail/CheckOrCross';
import StatusBadge from '../components/detail/StatusBadge';
import RevenueRow from '../components/detail/RevenueRow';

export default function RepaymentDetailPage() {
  const { repaymentId } = useParams<{ repaymentId: string }>();

  const [data, setData] = useState<RepaymentSecurity | null>(null);

  // const [schedules, setSchedules] = useState<any[]>([]);
 
  const [repaymentSchedules, setRepaymentSchedules] = useState<any[]>([]);
  const [repaymentReceipts, setRepaymentReceipts] = useState<any[]>([]);
  const [securityCollaterals, setSecurityCollaterals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk progress bar dinamis
  const [totalReceipt, setTotalReceipt] = useState<number>(0);
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);

  const { isEditMode } = useGlobalMode();
  const { openPanel } = useSidePanel();
  
  useEffect(() => {
    if (!repaymentId) return;
  
    const fetchAllDetailData = async () => {
      try {
        setLoading(true);
        
        // Mengambil 4 sumber data sekaligus secara paralel lewat Axios
        const [repaymentSecurityRes, repaymentSchedulesRes, securityCollateralsRes] = await Promise.all([
          repaymentSecurityService.getRepaymentSecurityDetail(repaymentId),
          repaymentScheduleService.getBySecurityId(repaymentId),
          // repaymentReceiptService.getBySecurityId(repaymentId),
          securityCollateralService.getBySecurityId(repaymentId) // Ambil data collateral di sini
        ]);

        console.log('[RepaymentDetailPage] typeof(repaymentSecurityRes) : ',typeof(repaymentSecurityRes));
        console.log('[RepaymentDetailPage] repaymentSecurityRes : ',repaymentSecurityRes);
  
        setData(repaymentSecurityRes.data.item);
        setRepaymentSchedules(repaymentSchedulesRes.data.items || []);
        // setRepaymentReceipts(repaymentReceiptsRes.data.items || []);
        setSecurityCollaterals(securityCollateralsRes.data.items || []); // Masuk ke state jaminan/collateral
  
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllDetailData();
  }, [repaymentId]);

  // Loading & Error UI Fallback
  if (loading) return <div className="p-8 text-center">Memuat detail...</div>;
  if (error) return <div className="p-8 text-center text-rose-500 font-medium">Error: {error}</div>;
  if (!data) return <div className="p-8 text-center">Data tidak ditemukan.</div>;

  // Formatters
  const formatRupiah = (numStr: string | number) => {
    if (numStr === 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(typeof numStr === 'string' ? parseFloat(numStr || '0') : numStr);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
  };

  const formatCompactDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: '2-digit' }).format(new Date(dateStr));
  };

  // Status Styling Generator
  const getStatusStyle = (status: ContractStatus) => {
    const styles: Record<ContractStatus, string> = {
      PERFORMING: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      OBSERVATION: 'bg-amber-50 text-amber-700 border-amber-300',
      SUBSTANDARD: 'bg-orange-50 text-orange-700 border-orange-300',
      DOUBTFUL: 'bg-rose-50 text-rose-700 border-rose-300',
      DEFAULTED: 'bg-slate-800 text-white border-slate-700',
      FINISHED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return styles[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const getTypeStyle = (type: SecurityType) => {
    return type === 'Sukuk' 
      ? 'bg-blue-50 text-blue-600 border-blue-200' 
      : 'bg-rose-50 text-rose-600 border-rose-200';
  };

  if (loading) return <div className="pt-20 p-8 text-center text-sm font-medium text-slate-400 animate-pulse">Memuat detail data...</div>;
  if (error || !data) return <div className="pt-20 p-8 text-center text-rose-500 font-medium">⚠️ {error}</div>;

  // ===========================================================================
  // DATA PREPARATION & CALCULATIONS
  // ===========================================================================
  
  // Kalkulasi Pendapatan (Revenue)
  const totalMonitoringRevenue = parseFloat(data.contractFeeMonitoring || '0') * (data.contractDurationInMonths || 1);
  const totalMonitoringRevenuePercentage = parseFloat(data.contractFeeMonitoringPercentageMonthly || '0') * (data.contractDurationInMonths || 1);
  const totalRevenue = 
    parseFloat(data.contractFeeAdministration || '0') +
    parseFloat(data.contractFeeProvision || '0') +
    parseFloat(data.contractFeePlatform || '0') +
    parseFloat(data.contractFeeServicing || '0') +
    totalMonitoringRevenue;
    
  // Persentase Revenue Estimasi
  const totalRevenuePercentage = data.contractUnderlyingFund 
    ? ((totalRevenue / parseFloat(data.contractUnderlyingFund?.toString() || '0')) * 100).toFixed(2)
    : '0.00';

  // ===========================================================================
  // MAPPING DATA SCHEDULES & COLLATERALS
  // ===========================================================================
  
  // Ambil Data Order 0 untuk Upfront
  const upfrontFeeRaw = repaymentSchedules.find(s => s.scheduleSequence === 0);

  const upfrontFee = !upfrontFeeRaw ? null : {
    id: upfrontFeeRaw.id,
    no: 0,
    dueDate: upfrontFeeRaw.scheduleDate || '',
    status: upfrontFeeRaw.invoiceStatus || 'BELUM TERSEDIA',
    admin: parseFloat(upfrontFeeRaw.invoiceFeeAdministration || '0'),
    adminTax: parseFloat(upfrontFeeRaw.invoiceFeeAdministrationTax || '0'),
    provision: parseFloat(upfrontFeeRaw.invoiceFeeProvision || '0'),
    provisionTax: parseFloat(upfrontFeeRaw.invoiceFeeProvisionTax || '0'),
    platform: parseFloat(upfrontFeeRaw.invoiceFeePlatform || '0'),
    platformTax: parseFloat(upfrontFeeRaw.invoiceFeePlatformTax || '0'),
    servicing: parseFloat(upfrontFeeRaw.invoiceFeeServicing || '0'),
    servicingTax: parseFloat(upfrontFeeRaw.invoiceFeeServicingTax || '0'),
    baseTotal: parseFloat(upfrontFeeRaw.invoiceTotal || '0'),
    taxTotal: parseFloat(upfrontFeeRaw.invoiceTotalTax || '0'),
    grandTotal: parseFloat(upfrontFeeRaw.invoiceTotalWithTax || '0'),
  };

  // Ambil Data Order > 0 untuk Cicilan
  const installmentsFee = repaymentSchedules
    .filter(s => s.scheduleSequence > 0)
    .sort((a, b) => a.scheduleSequence - b.scheduleSequence)
    .map(row => ({
      id: row.id,
      month: row.scheduleSequence,
      dueDate: row.scheduleDate || '',
      sf: parseFloat(row.invoiceSinkingFund || '0'),
      yield: parseFloat(row.invoiceYield || '0'),
      monitoring: parseFloat(row.invoiceFeeMonitoring || '0'),
      taxMonitoring: parseFloat(row.invoiceFeeMonitoringTax || '0'),
      baseTotal: parseFloat(row.invoiceTotal || '0'),
      taxTotal: parseFloat(row.invoiceTotalTax || '0'),
      grandTotal: parseFloat(row.invoiceTotalWithTax || '0'),
      status: row.invoiceStatus
    }));

  console.log("upfrontFee : ",upfrontFee);
  console.log("installmentsFee : ",installmentsFee);


  // Mapping Data Agunan (Collaterals) dari API
  const collaterals = securityCollaterals.map(col => ({
    id: col.id,
    type: col.collateralType ? col.collateralType.replace(/_/g, ' ') : '-',
    value: parseFloat(col.collateralValueEstimated || '0'),
    status: col.collateralStatus || '-',
    vDoc: col.verificationDocumentStatus === 'VERIFIED',
    vLegal: col.verificationLegalStatus === 'VERIFIED',
    vField: col.verificationFieldStatus === 'VERIFIED',
    vValue: col.verificationValueStatus === 'VERIFIED',
  }));

  // Kalkulasi Progress Dana Aktual untuk ditambilkan di text
  const underlyingFund = parseFloat(data.contractUnderlyingFund?.toString() || '0');
  let progressPercentage = 0;
  if (underlyingFund > 0) {
    progressPercentage = (totalReceipt / underlyingFund) * 100;
  }
  const formattedProgress = progressPercentage.toFixed(2);
  
  // Batas maksimal animasi width
  const boundedWidth = Math.min(animatedProgress, 100);

  return (
    <div className="p-5 w-full max-w-[1400px] mx-auto space-y-5 bg-slate-50/20 min-h-screen text-slate-700 antialiased">
      
      {/* =====================================================================
          HEADER / TITLE PAGE
      ====================================================================== */}
      <div className="pt-8">
        <Link to="/dashboard/repayment" className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 w-fit mb-3">
          ← Kembali
        </Link>
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Detail Portofolio Pembayaran</h1>
          </div>
          {isEditMode && (
              <button 
                  // 3. Tambahkan onClick di sini (sesuaikan "data.id" dengan variabel ID row/item lo saat ini)
                  onClick={() => openPanel(<RepaymentSecurityEditWrapper repaymentId={data.id} />)}
                  className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-2 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2"
              >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Ubah Detail
              </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          ROW 1: CONTAINER 1 (Utama - 1/3) & CONTAINER 2 (Detail - 2/3)
      ====================================================================== */}
      {/* 💡 UPDATE KOMPONEN INFOROW LO JADI SEPERTI INI BIAR FONT KIRI MEMBESAR */}
      {/* const InfoRow = ({ label, value, fontMono, textClass = "text-slate-800" }: any) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
          <span className={`text-[13px] font-semibold leading-tight ${fontMono ? 'font-mono' : 'font-sans'} ${textClass}`}>
            {value || '-'}
          </span>
        </div>
      ); 
      */}


      {/* ================= MULAI DARI SINI ================= */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        
        {/* CONTAINER 2: Detil Informasi (KIRI - Font Agak Dibesarkan & Fit) */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl border-2 border-slate-200 shadow-sm p-4 flex flex-col justify-start">
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider border-b-2 border-slate-100 pb-2 mb-3 shrink-0">
            Detil Informasi & Legalitas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 ">
            {/* Baris 1 */}
            <InfoRow label="Nama Penerbit" value={data.investeeName} />
            <InfoRow label="Nama Penerbit (Legal)" value={data.investeeNameLegal} />

            {/* Baris 2 */}
            <InfoRow label="Nama Efek" value={data.securityName} />
            <InfoRow label="Tipe Efek" value={data.securityType} />
            
            <InfoRow label="Kode Efek" value="KKKKAAXXSCFS" />
            <InfoRow label="Penerbitan Ke" value="5" />
            
            
            {/* Baris 3 */}
            <InfoRow label="Jumlah Pendanaan" value={formatRupiah(data.contractUnderlyingFund)} fontMono />
            <InfoRow label="Status" value={data.contractStatus} />
            
            {/* Baris 4 */}
            <InfoRow label="Jumlah Imbal Hasil (p.a.)" value={formatRupiah(data.contractYieldAmount)} fontMono textClass="text-emerald-700" />
            <InfoRow label="Persentase Imbal Hasil" value={`${data.contractYieldRateAnnually}%`} fontMono textClass="text-emerald-700" />
            
            {/* Baris 5 */}
            <InfoRow label="Durasi Efek" value={`${data.contractDurationInMonths} Bulan`} />
            <InfoRow label="Mulai" value={formatDate(data.contractStartDate)} />
            
            {/* Baris 6 (Kiri Kosong) */}
            <div></div> 
            <InfoRow label="Selesai" value={formatDate(data.contractEndDate)} />
            
            {/* Section Dokumen */}
            <div className="col-span-1 md:col-span-2 border-t-2 border-slate-50 pt-3 mt-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-0">
              
              {/* Baris 7 */}
              <div className="col-span-1 md:col-span-2">
                <InfoRow label="Judul Dokumen Perjanjian" value={data.contractDocumentTitle} />
              </div>
              
              {/* Baris 8 */}
              <InfoRow label="Nomor Dokumen Perjanjian" value={data.contractDocumentNumber} fontMono />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Unduh Dokumen Perjanjian</span>
                <a href={data.contractDocumentUrl} target="_blank" rel="noreferrer" className="text-[12px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 w-fit bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Unduh Dokumen
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CONTAINER 1: Informasi Utama (KANAN - Font Dikecilkan) */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl border-2 border-slate-200 shadow-sm p-4 flex flex-col justify-between">
          
          <div className="flex flex-col gap-2 mb-6">
            {/* Baris 1: Penerbit, Legalitas, dan Status */}
            <div className="flex justify-between items-start gap-2 border-b-2 border-slate-100 pb-2.5">
              <div className="min-w-0 pr-2">
                <h3 className="text-[16px] font-bold text-slate-800 leading-tight truncate" title={data.investeeName}>
                  {data.investeeName}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate" title={data.investeeNameLegal}>
                  {data.investeeNameLegal}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border-2 shrink-0 ${getStatusStyle(data.contractStatus)}`}>
                {data.contractStatus}
              </span>
            </div>

            {/* Baris 2: Tipe Efek & Nama Efek */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border-2 shrink-0 ${getTypeStyle(data.securityType)}`}>
                {data.securityType}
              </span>
              <span className="text-[14px] font-bold text-slate-800 leading-tight line-clamp-2">
                {data.securityName}
              </span>
            </div>

            {/* Baris 3: Jumlah Pendanaan */}
            <div className="bg-slate-50 border-2 border-slate-100 rounded-lg p-2.5 my-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Jumlah Pendanaan</span>
              <p className="text-xl xl:text-2xl font-black text-slate-800 font-mono tracking-tighter break-words leading-none">
                {formatRupiah(data.contractUnderlyingFund)}
              </p>
            </div>

            {/* Baris 4: Imbal Hasil & % */}
            <div className="flex justify-between items-end border-t border-slate-100 pt-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Imbal Hasil</span>
                <span className="text-[12px] font-mono font-semibold text-emerald-600">{formatRupiah(data.contractYieldAmount)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">% p.a.</span>
                <span className="text-[12px] font-mono font-semibold text-emerald-600">{data.contractYieldRateAnnually}%</span>
              </div>
            </div>

            {/* Baris 5: Potensi Revenue & % */}
            <div className="flex justify-between items-end border-t border-slate-100 pt-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Potensi Revenue</span>
                <span className="text-[12px] font-mono font-semibold text-slate-700">{formatRupiah(totalRevenue)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">% Estimasi</span>
                <span className="text-[12px] font-mono font-semibold text-slate-700">{totalRevenuePercentage}%</span>
              </div>
            </div>

            {/* Baris 6: Jumlah Cicilan & Kolateral */}
            <div className="flex justify-between items-end border-t border-slate-100 pt-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jumlah Cicilan</span>
                <span className="text-[12px] font-sans font-semibold text-slate-700">{installmentsFee.length}x Cicilan</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Durasi</span>
                <span className="text-[12px] font-sans font-semibold text-slate-700">{data.contractDurationInMonths} Bln</span>
              </div>
            </div>

            {/* Baris 7: Durasi, Mulai & Selesai */}
            <div className="flex justify-between items-end border-t border-slate-100 pt-2">
              {/* Kiri: Durasi */}
              {/* Tengah: Mulai */}
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Mulai</span>
                <span className="text-[12px] font-sans font-semibold text-slate-700">{formatCompactDate(data.contractStartDate)}</span>
              </div>
              {/* Kanan: Selesai */}
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Selesai</span>
                <span className="text-[12px] font-sans font-semibold text-slate-700">{formatCompactDate(data.contractEndDate)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-slate-100 pt-2">
              {/* Jaminan */}
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Agunan</span>
                <span className="text-[12px] font-sans font-semibold text-slate-700">{collaterals.length} Kolateral</span>
              </div>
              {/* Kanan: Selesai */}
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Denda</span>
                <span className="text-[12px] font-sans font-semibold text-slate-700">100.000</span>
              </div>
            </div>

          </div>

          {/* Baris 8: Progress Bar Animasi */}
          <div className="mt-auto pt-3 border-t-2 border-slate-100">
            <div className="flex justify-between text-[10px] font-bold mb-1.5">
              <span className="text-slate-500 uppercase tracking-wider">Progress Dana</span>
              <span className="text-slate-700">{formattedProgress}% Terkumpul</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className={`${
                  progressPercentage < 100 ? "bg-orange-500" : "bg-green-500"
                } h-full rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${boundedWidth}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* =====================================================================
          ROW 2: CONTAINER 3 (Tabel Pembayaran Atas-Bawah)
      ====================================================================== */}
      <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
        
        {/* ROW 1: Tabel Upfront Fee (Angsuran 0) */}
        <div className="p-5 border-b-2 border-slate-200">
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b-2 border-slate-100 pb-2">Jadwal Pembayaran: Biaya Di Muka (Upfront)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-[9px] text-slate-500 uppercase tracking-wider border-y border-slate-200">
                  <th className="py-2.5 px-3 font-bold text-center">Informasi</th>
                  <th className="py-2.5 px-3 font-bold text-left">Jatuh Tempo</th>
                  <th className="py-2.5 px-3 font-bold text-right">Biaya Admin</th>
                  <th className="py-2.5 px-3 font-bold text-right">Provisi</th>
                  <th className="py-2.5 px-3 font-bold text-right">Biaya Platform</th>
                  <th className="py-2.5 px-3 font-bold text-right">Biaya Service</th>
                  <th className="py-2.5 px-3 font-bold text-right">Biaya Total</th>
                  <th className="py-2.5 px-3 font-bold text-right">Total + Pajak</th>
                  <th className="py-2.5 px-3 font-bold text-left">Status</th>
                  {isEditMode && (
                    <th className="py-2.5 px-3 font-bold text-left">Edit</th> 
                  )}
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium text-slate-700">
                {!upfrontFee ? (
                  <tr>
                    <td colSpan={isEditMode ? 10 : 9} className="py-4 text-center italic text-slate-400">
                      -- Data tidak tersedia --
                    </td>
                  </tr>
                ) : (
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-left text-slate-800 font-bold align-top">
                      <Link 
                              to={`schedules/${upfrontFee.id}`}
                              className="flex items-center gap-1.5 text-[12px] font-bold bg-white text-slate-500 px-2.5 hover:bg-slate-50 hover:text-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
                          >
                              Upfront Fee
                              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                          </Link>
                    </td>
                    <td className="py-3 px-3 align-top">{formatDate(upfrontFee.dueDate)}</td>
                    <td className="py-3 px-3 text-right align-top relative">
                      <FeeWithTax base={upfrontFee.admin} tax={upfrontFee.adminTax} />
                    </td>
                    <td className="py-3 px-3 text-right align-top relative">
                      <FeeWithTax base={upfrontFee.provision} tax={upfrontFee.provisionTax} />
                    </td>
                    <td className="py-3 px-3 text-right align-top relative">
                      <FeeWithTax base={upfrontFee.platform} tax={upfrontFee.platformTax} />
                    </td>
                    <td className="py-3 px-3 text-right align-top relative">
                      <FeeWithTax base={upfrontFee.servicing} tax={upfrontFee.servicingTax} />
                    </td>
                    <td className="py-3 px-3 text-right align-top relative">
                      <FeeWithTax base={upfrontFee.baseTotal} tax={upfrontFee.taxTotal} isTotal={true} />
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-xs text-slate-800 align-top">
                      {formatRupiah(upfrontFee.grandTotal)}
                    </td>
                    <td className="py-3 px-3 text-left align-top relative">
                      <StatusBadge status={upfrontFee.status} />
                    </td>
                    {isEditMode && (
                      <td className="py-3 px-3 text-left align-top">
                          <button className="text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1 py-1 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                          </button>
                      </td>)}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 2: Tabel Jadwal Bulanan */}
        <div className="p-5">
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b-2 border-slate-100 pb-2">Jadwal Pembayaran: Cicilan Bulanan</h3>
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
                <tr className="bg-slate-50 text-[9px] text-slate-500 uppercase tracking-wider border-y border-slate-200">
                {/* Kolom 1 Besar & Padat */}
                <th className="py-2.5 px-3 font-bold text-center">Informasi</th>
                <th className="py-2.5 px-3 font-bold text-left">Jatuh Tempo</th>
                
                {/* Kolom Eksisting Tengah */}
                <th className="py-2.5 px-3 font-bold text-right">Cicilan Sinking Fund</th>
                <th className="py-2.5 px-3 font-bold text-right">{data.securityType === 'Sukuk' ? 'Kupon' : 'Dividen'}</th>
                <th className="py-2.5 px-3 font-bold text-right">Biaya Pemantauan</th>
                <th className="py-2.5 px-3 font-bold text-right">Total</th>
                <th className="py-2.5 px-3 font-bold text-right">Total + Pajak</th>
                
                {/* Kolom Jumlah Dibayarkan */}
                <th className="py-2.5 px-3 font-bold text-center">Status</th>
                {isEditMode && (
                    <th className="py-2.5 px-3 font-bold text-left">Edit</th> 
                  )}
                </tr>
            </thead>
            <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-100">
                {!installmentsFee || installmentsFee.length === 0 ? (
                  <tr>
                    <td colSpan={isEditMode ? 9 : 8} className="py-4 text-center italic text-slate-400">
                      -- Data tidak tersedia --
                    </td>
                  </tr>
                ) : (
                  installmentsFee.map((sch) => {
                  const isUpfront = sch.month === 0;
                  const titleLabel = isUpfront ? 'UPFRONT FEE' : `Tagihan ${sch.month}`;


                  return (
                      <tr key={sch.month} className="hover:bg-slate-50/80 transition-colors align-top">
                      
                      {/* KOLOM 1: INFORMASI PEMBAYARAN */}
                      <td className="py-3 px-3 text-left">
                      
                          <Link 
                              to={`schedules/${sch.id}`}
                              className="flex items-center gap-1.5 text-[12px] font-bold bg-white text-slate-500 px-2.5 hover:bg-slate-50 hover:text-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
                          >
                              {titleLabel}
                              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                          </Link>
                      </td>
                      <td className="py-3 px-3 align-top">{formatDate(sch.dueDate)}</td>
                      
                      {/* KOLOM EKSISTING */}
                      <td className="py-3 px-3 text-right font-mono">{formatRupiah(sch.sf)}</td>
                      <td className="py-3 px-3 text-right font-mono">{formatRupiah(sch.yield)}</td>
                      <td className="py-3 px-3 text-right relative">
                          <FeeWithTax base={sch.monitoring} tax={sch.taxMonitoring} />
                      </td>
                      <td className="py-3 px-3 text-right relative">
                          <FeeWithTax base={sch.baseTotal} tax={sch.taxTotal} />
                      </td>
                      
                      {/* KOLOM TOTAL + PAJAK */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-xs text-slate-800">
                          {formatRupiah(sch.grandTotal)}
                      </td>

                      {/* KOLOM STATUS */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                          <div className="flex items-center justify-center gap-4">
                              <StatusBadge status={sch.status} />
                          </div>
                      </td>
                      {isEditMode && (
                      <td className="py-3 px-3 text-left align-top">
                          <button 
                          onClick={() => openPanel(<RepaymentScheduleEditWrapper scheduleId={sch.id} />)}
                          className="text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1 py-1 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                          </button>
                      </td>)}
                      </tr>
                  );
                  })
                )}
            </tbody>
            </table>
          </div>
        </div>

        {/* ROW 3: Buat Jadwal Pembayaran Baru (Khusus Edit Mode) */}
        {isEditMode && (
          <div className="p-5 border-t-2 border-slate-200">
            <div className="p-5 border-t-2 border-slate-200">
              <button
                type="button"
                onClick={() => openPanel(<RepaymentScheduleCreateWrapper />)}
                className="flex items-center justify-center w-full py-4 border-2 border-dashed border-amber-300 bg-amber-50/50 text-amber-700 rounded-xl hover:bg-amber-100 hover:border-amber-400 transition-all group focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-amber-200/60 p-1.5 rounded-full group-hover:bg-amber-300 transition-colors">
                    <svg className="w-4 h-4 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold tracking-wider">Buat Tagihan Baru</span>
                </div>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* =====================================================================
          ROW 3: CONTAINER 4 (Revenue) & CONTAINER 5 (Collateral)
      ====================================================================== */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* CONTAINER 4: Revenue Summary (1/2) */}
        <div className="w-full lg:w-1/2 bg-white rounded-xl border-2 border-slate-200 shadow-sm p-5 flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-slate-100 pb-2">Rincian Potensi Pendapatan Platform</h3>
          
          <div className="flex-1 flex flex-col gap-3">
             <RevenueRow label="Biaya Administrasi (Upfront)" value={data.contractFeeAdministration} percentage={toFrontendPercentage(data.contractFeeAdministrationPercentage)} tax={calculateTax(data.contractFeeAdministration, data.contractTaxPpn, data.contractTaxFactor)}/>
             <RevenueRow label="Biaya Provisi (Upfront)" value={data.contractFeeProvision} percentage={toFrontendPercentage(data.contractFeeProvisionPercentage)} tax={calculateTax(data.contractFeeProvision, data.contractTaxPpn, data.contractTaxFactor)}/>
             <RevenueRow label="Biaya Platform (Upfront)" value={data.contractFeePlatform} percentage={toFrontendPercentage(data.contractFeePlatformPercentage)} tax={calculateTax(data.contractFeePlatform, data.contractTaxPpn, data.contractTaxFactor)}/>
             <RevenueRow label={"Biaya Servis"} value={data.contractFeeServicing} percentage={toFrontendPercentage(data.contractFeeServicingPercentage)} tax={calculateTax(data.contractFeeServicing, data.contractTaxPpn, data.contractTaxFactor)}/>
             <RevenueRow label={`Total Biaya Pemantauan (${data.contractDurationInMonths} Bulan)`} value={totalMonitoringRevenue} percentage={toFrontendPercentage(totalMonitoringRevenuePercentage)} tax={calculateTax(totalMonitoringRevenue, data.contractTaxPpn, data.contractTaxFactor)}/>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-300 flex justify-between items-center bg-emerald-50 rounded-lg p-4 border border-emerald-100">
             <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Pendapatan</span>
             <span className="text-xl font-black text-emerald-700 font-mono tracking-tight">{formatRupiah(totalRevenue)}</span>
          </div>
        </div>

        {/* CONTAINER 5: Daftar Agunan / Kolateral (1/2) */}
        <div className="w-full lg:w-1/2 bg-white rounded-xl border-2 border-slate-200 shadow-sm p-5 flex flex-col">
          <div className="flex justify-between items-end mb-4 border-b-2 border-slate-100 pb-2">
            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Daftar Agunan (Kolateral)</h3>
            
          </div>
          
          <div className="flex-1 overflow-x-auto">
            {collaterals.length === 0 ? (
              <div className="flex justify-center items-center h-full text-[11px] font-medium text-slate-400 py-6">
                Belum ada data agunan terdaftar.
              </div>
            ) : (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 text-[9px] text-slate-500 uppercase tracking-wider border-y border-slate-200">
                    <th className="py-2.5 px-3 font-bold">Tipe & Status</th>
                    <th className="py-2.5 px-3 font-bold text-right">Estimasi Nilai</th>
                    <th className="py-2.5 px-2 font-bold text-center" title="Verifikasi Dokumen">Dok</th>
                    <th className="py-2.5 px-2 font-bold text-center" title="Verifikasi Legal">Leg</th>
                    <th className="py-2.5 px-2 font-bold text-center" title="Verifikasi Lapangan">Lap</th>
                    <th className="py-2.5 px-2 font-bold text-center" title="Verifikasi Nilai">Nil</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-100">
                  {collaterals.map((col) => (
                    <tr key={col.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 align-top">
                        <p className="font-bold text-slate-700 mb-1">{col.type}</p>
                        <StatusBadge status={col.status} />
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 align-top">{formatRupiah(col.value)}</td>
                      <td className="py-3 px-2 align-top"><CheckOrCross isChecked={col.vDoc} /></td>
                      <td className="py-3 px-2 align-top"><CheckOrCross isChecked={col.vLegal} /></td>
                      <td className="py-3 px-2 align-top"><CheckOrCross isChecked={col.vField} /></td>
                      <td className="py-3 px-2 align-top"><CheckOrCross isChecked={col.vValue} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-end m-2">
            <Link 
            to={`collaterals`} 
            className="text-[10px] font-semibold text-gray-600 hover:text-blue-800 hover:underline transition-colors duration-150"
            >
            Lihat Detail &gt;
            </Link>
          </div>
          
        </div>

      </div>

    </div>
  );
}



