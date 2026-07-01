// src/pages/repayment/RepaymentDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RepaymentScheduleCreateWrapper from '../../components/repayment/RepaymentScheduleCreateWrapper';
import RepaymentScheduleEditWrapper from '../../components/repayment/RepaymentScheduleEditWrapper';
import RepaymentSecurityEditWrapper from '../../components/repayment/RepaymentSecurityEditWrapper';
import RepaymentSecurityForm from '../../components/repayment/RepaymentSecurityForm';
import FeeWithTax from '../../components/ui/FeeWithTax';
import InfoRow from '../../components/ui/InfoRow';
import { useGlobalMode } from '../../context/GlobalModeContext';
import { useSidePanel } from '../../context/SidePanelContext';
import { RepaymentSecurity, ApiResponse, ContractStatus, SecurityType } from '../../types/repayment';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function RepaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RepaymentSecurity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk progress bar dinamis
  const [totalReceipt, setTotalReceipt] = useState<number>(0);
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);
  
  // State untuk jadwal pembayaran (Schedules) dan Agunan (Collaterals)
  const [schedulesRaw, setSchedulesRaw] = useState<any[]>([]);
  const [collateralsRaw, setCollateralsRaw] = useState<any[]>([]);

  const { isEditMode } = useGlobalMode();

  const { openPanel } = useSidePanel();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Panggil 4 endpoint secara paralel (detail, total receipt, schedules, dan collaterals)
        const [response, receiptResponse, schedulesResponse, collateralsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/repayment/securities/${id}`),
          fetch(`${API_BASE_URL}/repayment/securities/${id}/receipt-sinking-fund/total`).catch((e) => {
            console.error("Gagal mengambil data total receipt:", e);
            return null;
          }),
          fetch(`${API_BASE_URL}/repayment/securities/${id}/schedules`).catch((e) => {
            console.error("Gagal mengambil data schedules:", e);
            return null;
          }),
          fetch(`${API_BASE_URL}/repayment/securities/${id}/collaterals`).catch((e) => {
            console.error("Gagal mengambil data collaterals:", e);
            return null;
          })
        ]);
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Gagal terhubung! Pastikan server backend sudah menyala.");
        }

        if (!response.ok) throw new Error(`Server respons dengan status: ${response.status}`);
        
        const result: ApiResponse<RepaymentSecurity> = await response.json();

        // Parsing data receipt total
        let fetchedTotalReceipt = 0;
        if (receiptResponse && receiptResponse.ok) {
          const receiptResult = await receiptResponse.json();
          fetchedTotalReceipt = parseFloat(receiptResult?.data?.sum.toString() || '0');
        }

        // Parsing data schedules
        if (schedulesResponse && schedulesResponse.ok) {
          const schedulesResult = await schedulesResponse.json();
          setSchedulesRaw(schedulesResult?.data?.items || []);
        }

        // Parsing data collaterals
        if (collateralsResponse && collateralsResponse.ok) {
          const collateralsResult = await collateralsResponse.json();
          setCollateralsRaw(collateralsResult?.data?.items|| []);
        }
        
        if (result && result.data) {
          setData(result?.data?.item);
          setTotalReceipt(fetchedTotalReceipt);
          
          // Kalkulasi target progress
          const underlyingFund = parseFloat(result?.data?.item?.contractUnderlyingFund?.toString() || '0');
          let targetProgress = 0;
          if (underlyingFund > 0) {
            targetProgress = (fetchedTotalReceipt / underlyingFund) * 100;
          }

          // Trigger animasi bar
          setTimeout(() => {
            setAnimatedProgress(targetProgress);
          }, 100);

        } else {
          throw new Error('Format data tidak valid.');
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message || 'Terjadi kesalahan sistem.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

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
  const rawUpfront = schedulesRaw.find(s => s.scheduleOrder === 0);
  const upfrontData = {
    id: rawUpfront?.id,
    no: 0,
    dueDate: rawUpfront?.scheduleDate || data.contractStartDate,
    status: rawUpfront?.invoiceStatus || 'BELUM TERSEDIA',
    admin: parseFloat(rawUpfront?.invoiceFeeAdministration || '0'),
    adminTax: parseFloat(rawUpfront?.invoiceFeeAdministrationTax || '0'),
    provision: parseFloat(rawUpfront?.invoiceFeeProvision || '0'),
    provisionTax: parseFloat(rawUpfront?.invoiceFeeProvisionTax || '0'),
    platform: parseFloat(rawUpfront?.invoiceFeePlatform || '0'),
    platformTax: parseFloat(rawUpfront?.invoiceFeePlatformTax || '0'),
    servicing: parseFloat(rawUpfront?.invoiceFeeServicing || '0'),
    servicingTax: parseFloat(rawUpfront?.invoiceFeeServicingTax || '0'),
    baseTotal: parseFloat(rawUpfront?.invoiceTotal || '0'),
    taxTotal: parseFloat(rawUpfront?.invoiceTotalTax || '0'),
    grandTotal: parseFloat(rawUpfront?.invoiceTotalWithTax || '0'),
  };

  // Ambil Data Order > 0 untuk Cicilan
  const schedules = schedulesRaw
    .filter(s => s.scheduleOrder > 0)
    .sort((a, b) => a.scheduleOrder - b.scheduleOrder)
    .map(row => ({
      id: row.id,
      month: row.scheduleOrder,
      date: formatDate(row.scheduleDate),
      sf: parseFloat(row.invoiceSinkingFund || '0'),
      yield: parseFloat(row.invoiceYield || '0'),
      monitoring: parseFloat(row.invoiceFeeMonitoring || '0'),
      taxMonitoring: parseFloat(row.invoiceFeeMonitoringTax || '0'),
      baseTotal: parseFloat(row.invoiceTotal || '0'),
      taxTotal: parseFloat(row.invoiceTotalTax || '0'),
      grandTotal: parseFloat(row.invoiceTotalWithTax || '0'),
      status: row.invoiceStatus
    }));

  // Mapping Data Agunan (Collaterals) dari API
  const collaterals = collateralsRaw.map(col => ({
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
            <div className="col-span-1 md:col-span-2 border-t-2 border-slate-50 pt-3 mt-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
              
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
                <span className="text-[12px] font-sans font-semibold text-slate-700">{schedules.length}x Cicilan</span>
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
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-left text-slate-800 font-bold align-top">
                    <Link 
                            to={`${upfrontData.id}`}
                            className="flex items-center gap-1.5 text-[12px] font-bold bg-white text-slate-500 px-2.5 hover:bg-slate-50 hover:text-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
                        >
                            Upfront Fee
                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                  </td>
                  <td className="py-3 px-3 align-top">{formatDate(upfrontData.dueDate)}</td>
                  <td className="py-3 px-3 text-right align-top relative">
                    <FeeWithTax base={upfrontData.admin} tax={upfrontData.adminTax} />
                  </td>
                  <td className="py-3 px-3 text-right align-top relative">
                    <FeeWithTax base={upfrontData.provision} tax={upfrontData.provisionTax} />
                  </td>
                  <td className="py-3 px-3 text-right align-top relative">
                    <FeeWithTax base={upfrontData.platform} tax={upfrontData.platformTax} />
                  </td>
                  <td className="py-3 px-3 text-right align-top relative">
                    <FeeWithTax base={upfrontData.servicing} tax={upfrontData.servicingTax} />
                  </td>
                  <td className="py-3 px-3 text-right align-top relative">
                    <FeeWithTax base={upfrontData.baseTotal} tax={upfrontData.taxTotal} isTotal={true} />
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-xs text-slate-800 align-top">
                    {formatRupiah(upfrontData.grandTotal)}
                  </td>
                  <td className="py-3 px-3 text-left align-top relative">
                    <StatusBadge status={upfrontData.status} />
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
                {schedules.map((sch) => {
                const isUpfront = sch.month === 0;
                const titleLabel = isUpfront ? 'UPFRONT FEE' : `Tagihan ${sch.month}`;

                console.log("schedule : ",sch);

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
                    <td className="py-3 px-3 align-top">{formatDate(upfrontData.dueDate)}</td>
                    
                    {/* KOLOM EKSISTING */}
                    <td className="py-3 px-3 text-right font-mono">{formatRupiah(sch.sf)}</td>
                    <td className="py-3 px-3 text-right font-mono">{formatRupiah(sch.yield)}</td>
                    <td className="py-3 px-3 text-right relative">
                        <FeeWithTax base={sch.monitoring} tax={sch.taxMonitoring} />
                    </td>
                    <td className="py-3 px-3 text-right relative">
                        <FeeWithTax base={sch.baseTotal} tax={sch.taxTotal} isTotal={true} />
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
                })}
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
             <RevenueRow label="Biaya Administrasi (Upfront)" value={data.contractFeeAdministration} />
             <RevenueRow label="Biaya Provisi (Upfront)" value={data.contractFeeProvision} />
             <RevenueRow label="Biaya Platform (Upfront)" value={data.contractFeePlatform} />
             <RevenueRow label={`Biaya Servis (${data.contractFeeServicingPercentage}%)`} value={data.contractFeeServicing} />
             <RevenueRow label={`Total Biaya Pemantauan (${data.contractDurationInMonths} Bulan)`} value={totalMonitoringRevenue} />
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

// =============================================================================
// REUSABLE HELPER COMPONENTS
// =============================================================================

// Helper: Teks Informasi Flat

// Helper: Baris Revenue Summary
function RevenueRow({ label, value }: { label: string; value: string | number }) {
  const formatRupiah = (numStr: string | number) => {
    if (numStr === 0 || numStr === '0') return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(typeof numStr === 'string' ? parseFloat(numStr || '0') : numStr);
  };
  
  return (
    <div className="flex justify-between items-end border-b border-slate-100 pb-2">
      <span className="text-[11px] font-semibold text-slate-500">{label}</span>
      <span className="text-[12px] font-bold font-mono text-slate-800">{formatRupiah(value)}</span>
    </div>
  );
}

// Helper: Status Badge (Menambahkan mapping status API HELD_BY_PLATFORM, SUBMITTED, dll)
function StatusBadge({ status }: { status: string }) {
  let color = 'bg-slate-100 text-slate-600 border border-slate-200';
  
  // Emerald (Sukses / Terjamin)
  if (status === 'DIBAYAR' || status === 'DIAMANKAN' || status === 'PAID' || status === 'HELD_BY_PLATFORM' || status === 'LIQUIDATED') {
    color = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
  // Amber (Peringatan / Sedang Proses)
  else if (status === 'TERTUNDA' || status === 'DALAM PROSES' || status === 'OVERDUE' || status === 'UNDER_REVIEW' || status === 'SUBMITTED') {
    color = 'bg-amber-50 text-amber-700 border border-amber-300';
  }
  // Blue (Belum Waktunya / Menunggu / Biasa)
  else if (status === 'BELUM JATUH TEMPO' || status === 'MENUNGGU VERIFIKASI' || status === 'UNPAID' || status === 'PENDING') {
    color = 'bg-blue-50 text-blue-600 border border-blue-200';
  }
  // Red (Ditolak)
  else if (status === 'DECLINED') {
    color = 'bg-rose-50 text-rose-700 border border-rose-200';
  }
  
  // Replace underscores dengan spasi untuk tampilan yang lebih ramah
  const displayStatus = status ? status.replace(/_/g, ' ') : '-';
  
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase inline-block border-2 ${color}`}>
      {displayStatus}
    </span>
  );
}

// Helper: Checkmark / Cross Icon untuk Table Kolateral
function CheckOrCross({ isChecked }: { isChecked: boolean }) {
  return (
    <div className="flex justify-center">
      {isChecked ? (
        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      ) : (
        <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      )}
    </div>
  );
}