// src/pages/repayment/SecurityCollateral.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SecurityCollateralCreateWrapper from '../../components/repayment/SecurityCollateralCreateWrapper';
import SecurityCollateralEditWrapper from '../../components/repayment/SecurityCollateralEditWrapper';
import { useGlobalMode } from '../../context/GlobalModeContext';
import { useSidePanel } from '../../context/SidePanelContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface CollateralItem {
  id: string;
  repaymentSecurityId: string;
  collateralType: string;
  collateralDescription: string;
  collateralValueEstimated: string;
  collateralStatus: string;
  executionTime: string | null;
  documentUrl: string | null;
  verificationDocumentStatus: string;
  verificationDocumentNotes: string | null;
  verificationFieldStatus: string;
  verificationFieldNotes: string | null;
  verificationLegalStatus: string;
  verificationLegalNotes: string | null;
  verificationValueStatus: string;
  verificationValueNotes: string | null;
  createdAt: string;
}

export default function SecurityCollateral() {
  const { id: repaymentSecurityId } = useParams<{ id: string }>();
  const [collaterals, setCollaterals] = useState<CollateralItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isEditMode } = useGlobalMode();
  const { openPanel } = useSidePanel();

  // Data header (Dummy/Placeholder) untuk info Security
  const headerData = {
    investee_id: 'dummy-investee-id',
    investee_name: 'PT. Solusi Teknologi Digital',
    investee_name_legal: 'PT. Solusi Teknologi Digital Tbk',
    security_id: 'dummy-security-id',
    security_name: 'Sukuk Ijarah Proyek Ekspansi IT',
    security_type: 'SUKUK',
    contract_status: 'PERFORMING', // Tambahan info contract_status dummy
  };

  useEffect(() => {
    const fetchCollaterals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/repayment/securities/${repaymentSecurityId}/collaterals`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data kolateral');
        }
        const result = await response.json();
        setCollaterals(result.data?.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (repaymentSecurityId) {
      fetchCollaterals();
    }
  }, [repaymentSecurityId]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(num);
  };

  const renderBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700">VERIFIED</span>;
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700">{status.replace('_', ' ')}</span>;
      case 'DECLINED':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">DECLINED</span>;
      case 'HELD_BY_PLATFORM':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700">HELD BY PLATFORM</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  // Helper render item verifikasi di dalam grid 2x2
  const renderGridVerificationItem = (label: string, status: string, notes: string | null) => (
    <div className="flex flex-col border border-slate-100 p-1.5 rounded bg-slate-50/50">
      <div className="flex justify-between items-center gap-1.5 text-[10px]">
        <span className="text-slate-500 font-medium">{label}</span>
        {renderBadge(status)}
      </div>
      {notes && (
        <span className="text-[8.5px] text-slate-400 italic mt-0.5 leading-tight truncate" title={notes}>
          {notes}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Daftar Jaminan (Collaterals)</h1>
            <p className="text-xs text-slate-500 mt-1">Kelola dan monitor aset jaminan untuk fasilitas pendanaan</p>
          </div>
          <Link to={`/dashboard/repayment/schedules/${repaymentSecurityId}`} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            &larr; Kembali
          </Link>
        </div>

        {/* Kontainer 1: Ringkasan Informasi Penerbit */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="grid grid-cols-[2fr_3fr_1fr_1fr] gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Penerbit</span>
              <span className="text-xs font-bold text-slate-800">{headerData.investee_name}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{headerData.investee_name_legal}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Efek</span>
              <span className="text-xs font-bold text-slate-800">{headerData.security_name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Tipe Efek</span>
              <div className="mt-0.5">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${headerData.security_type === 'SUKUK' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                  {headerData.security_type}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Status Kontrak</span>
              <div className="mt-0.5">
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  {headerData.contract_status}
                </span>
              </div>
            </div>
        
          </div>
        </div>

        {/* Kontainer 2: Tabel List Collateral */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-800">Rincian Aset Jaminan</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[5%] text-center">No</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Detail Jaminan</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[50%]">Status Verifikasi</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right w-[10%]">Estimasi Nilai</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Status</th>
                    <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center w-[5%]">View Dokumen</th>
                    {isEditMode && (<th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center w-[5%]">Edit</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">Memuat data jaminan...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-rose-500">Error: {error}</td>
                  </tr>
                ) : collaterals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400 italic">-- belum ada jaminan --</td>
                  </tr>
                ) : (
                  <>
                    {collaterals.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* 1. Kolom Nomor */}
                        <td className="py-3 px-4 align-top text-center text-xs font-medium text-slate-500">
                          {index + 1}
                        </td>
                        
                        {/* 2. Kolom Detail Jaminan */}
                        <td className="py-3 px-4 align-top">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-800 mb-1">{item.collateralType.replace('_', ' ')}</span>
                            <span className="text-[11px] text-slate-600 leading-relaxed">{item.collateralDescription}</span>
                          </div>
                        </td>
                        
                        {/* 3. Kolom Status Verifikasi (Grid Berukuran 2x2) */}
                        <td className="py-3 px-4 align-top">
                          <div className="grid grid-cols-2 gap-2 max-w-sm">
                            {renderGridVerificationItem('Verifikasi Dokumen', item.verificationDocumentStatus, item.verificationDocumentNotes)}
                            {renderGridVerificationItem('Verifikasi Lapangan', item.verificationFieldStatus, item.verificationFieldNotes)}
                            {renderGridVerificationItem('Verifikasi Legal', item.verificationLegalStatus, item.verificationLegalNotes)}
                            {renderGridVerificationItem('Verifikasi Nilai', item.verificationValueStatus, item.verificationValueNotes)}
                          </div>
                        </td>

                        {/* 4. Kolom Estimasi Nilai */}
                        <td className="py-3 px-4 align-top text-right">
                          <span className="text-xs font-mono font-semibold text-slate-800">
                            {formatRupiah(Number(item.collateralValueEstimated))}
                          </span>
                        </td>
                        
                        {/* 5. Kolom Status */}
                        <td className="py-3 px-4 align-top text-center">
                          {renderBadge(item.collateralStatus)}
                        </td>
                        
                        {/* 6. Kolom View Dokumen */}
                        <td className="py-3 px-4 align-top text-center">
                          {item.documentUrl ? (
                            <a 
                              href={item.documentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors" 
                              title="Buka Dokumen PDF"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400">-</span>
                          )}
                        </td>
                        {isEditMode && (
                            <td className="py-3 px-3 text-left align-top">
                                <button 
                                  onClick={() => openPanel(<SecurityCollateralEditWrapper collateralId={item.id}/>)}
                                  className="text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1 py-1 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </td>)}
                      </tr>
                    ))}

                    {/* Row Tambah Kolateral Baru (Muncul jika isEditMode aktif) sebelum baris total */}
                    {isEditMode && (
                        <tr className="border-t-2 border-slate-200">
                        <td></td>
                        <td colSpan={5} className="p-0">
                        <button
                            type="button"
                            onClick={() => openPanel(<SecurityCollateralCreateWrapper/>)}
                            className="w-full flex items-center justify-center gap-2 py-4 border-2 m-4 border-dashed rounded-lg border-amber-200 bg-amber-50/40 hover:bg-amber-100 text-amber-700 transition-all focus:outline-none focus:ring-2 focus:ring-amber-200 group"
                          >
                            <div className="bg-amber-100 p-1 rounded-full group-hover:bg-amber-500 transition-colors">
                              <svg className="w-5 h-5 text-amber-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <span className="font-semibold text-sm">Tambah kolateral baru</span>
                          </button>
                        </td>
                        <td></td>
                        </tr>
                    )}

                    {/* Baris Total di Bagian Bawah Sejajar Kolom Estimasi Nilai */}
                    <tr className="bg-slate-50 border-t border-slate-200 font-bold">
                      <td colSpan={3} className="py-3 pl-14 text-center text-slate-900 text-xs uppercase tracking-tight">
                        Perkiraan total estimasi nilai jaminan
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 text-md">
                        {formatRupiah(collaterals.reduce((sum, item) => sum + Number(item.collateralValueEstimated || 0), 0))}
                      </td>
                      <td colSpan={2} className="bg-slate-50"></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}