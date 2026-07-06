// src/pages/repayment/RepaymentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RepaymentSecurity, ApiResponse } from '../types/repayment';
import RepaymentCard from '../components/RepaymentCard';
import { useGlobalMode } from '../../../contexts/GlobalModeContext';
import RepaymentSecurityFormPanel from '../components/RepaymentSecurityFormPanel';

// 1. Import Service yang sudah kita buat
import { repaymentSecurityService } from '../services/repaymentSecurityService';

export default function RepaymentDashboardPage() {
  const [data, setData] = useState<RepaymentSecurity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { isEditMode } = useGlobalMode();

  // 💡 SENIOR-STYLE: Baca parameter dari URL browser lo
  const [searchParams, setSearchParams] = useSearchParams();
  const actionParam = searchParams.get('action'); // Akan membaca '?action=add'
  
  // Status panel terbuka kalau ada parameter 'add' atau 'edit'
  const isFormOpen = actionParam === 'add' || actionParam === 'edit';
  const formMode = actionParam === 'add' ? 'add' : 'edit';

  // // Asumsi: Filter logic untuk memproses data dari backend sebelum di-render
  // const filteredData = data.filter(item => {
  //   const matchesSearch = item.securityName?.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesStatus = statusFilter === 'ALL' || item.contractStatus === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });
  

  // 2. Gunakan useEffect untuk memanggil Service
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Memanggil API via Service
        const responseData = await repaymentSecurityService.getAll();
        
        // Sesuaikan dengan struktur Response backend NestJS Anda
        // Misalnya datanya ada di responseData.data atau responseData.item
        setData(responseData.data.items || []); 
        
      } catch (err: any) {
        console.error("Gagal memuat data dashboard:", err);
        // Axios membungkus error dari backend di err.response.data
        setError(
          err?.response?.data?.message || "Terjadi kesalahan saat memuat data dari server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Array dependensi kosong: hanya dijalankan sekali saat komponen di-mount (dimuat)

  // Asumsi: Filter logic untuk memproses data dari backend sebelum di-render
  const filteredData = data.filter(item => {
    const matchesSearch = item.securityName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.contractStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full w-full">
      {/* KONDISI LOADING */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-sm font-medium text-slate-400 animate-pulse">Memuat data repayment...</div>
        </div>
      )}

      {/* KONDISI ERROR */}
      {error && (
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-sm text-rose-600 font-medium flex items-center justify-center">
          ⚠️ {error}
        </div>
      )}

      {/* GRID LAYOUT (3 Columns) */}
      {!loading && !error && (
        <>
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200/60 border-dashed">
              <div className="my-16 text-center">
                <span className="text-2xl mb-2">📭</span>
                <p className="text-sm text-slate-400 font-medium">Data tidak ditemukan.</p>
              </div>
              {isEditMode && (
                  <div>
                    <RepaymentCard key="new-repayment-security" data={null as any} url="tes"/>
                  </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredData.map((repayment) => (
                <RepaymentCard key={repayment.id} data={repayment} url={repayment.id} />
              ))}
              {isEditMode && (
                <RepaymentCard key="new-repayment-security" data={null as any} url="new" />
              )}
            </div>
          )}
        </>
      )}

      {/* RENDER PANEL FORM JIKA DIAKTIFKAN VIA URL */}
      {isFormOpen && (
        <RepaymentSecurityFormPanel 
          mode={formMode} 
          // Bisa melempar fungsi untuk me-refresh data (misal re-fetch) jika dibutuhkan
        />
      )}
    </div>
  );
}