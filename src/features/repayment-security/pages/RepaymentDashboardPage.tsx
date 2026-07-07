// src/pages/repayment/RepaymentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RepaymentSecurity, ApiResponse } from '../types/repayment';
import RepaymentCard from '../components/dashboard/RepaymentCard';
import { useGlobalMode } from '../../../contexts/GlobalModeContext';
import RepaymentSecurityFormPanel from '../components/RepaymentSecurityFormPanel';

// 1. Import Service yang sudah kita buat
import { repaymentSecurityService } from '../services/repaymentSecurityService';
import { RepaymentSecurityCardResponse } from '../dtos/repayment-security.dto';
import { ContractStatus, SecurityType } from '../types/repayment-security.enum';

export default function RepaymentDashboardPage() {
  const [data, setData] = useState<RepaymentSecurityCardResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [securityTypeFilter, setSecurityTypeFilter] = useState('ALL'); // NEW: State untuk Tipe Efek

  const { isEditMode } = useGlobalMode();

  // 💡 SENIOR-STYLE: Baca parameter dari URL browser lo
  const [searchParams, setSearchParams] = useSearchParams();
  const actionParam = searchParams.get('action'); // Akan membaca '?action=add'
  
  // Status panel terbuka kalau ada parameter 'add' atau 'edit'
  const isFormOpen = actionParam === 'add' || actionParam === 'edit';
  const formMode = actionParam === 'add' ? 'add' : 'edit';

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
        setData(responseData?.data?.items || []); 
        
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
    const searchLower = searchTerm.toLowerCase();
    
    // NEW: Cek Name, Investee, dan Investee Legal (di-cast ke any untuk jaga-jaga apabila DTO belum di-update)
    const matchesSearch = 
      !searchTerm || 
      item.securityName?.toLowerCase().includes(searchLower) ||
      (item as any).investeeName?.toLowerCase().includes(searchLower) ||
      (item as any).investeeNameLegal?.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'ALL' || item.contractStatus === statusFilter;
    
    // NEW: Cek Tipe Efek (Sukuk / Saham)
    const matchesType = securityTypeFilter === 'ALL' || (item as any).securityType === securityTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    // Mengubah mt-16 menjadi mt-24 agar tidak tertutup fixed navbar
    // FIX: Menghapus h-full dan menambahkan pb-12 agar scroll halaman berjalan natural dan tidak terpotong
    <div className="mt-24 w-full pb-12">
      
      {/* FILTER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm items-center">
        {/* 1. Search */}
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Cari Nama Investee, Nama Legal, atau Security..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 2. Security Type / Tipe Efek Filter */}
        <div className="w-full md:w-48">
          <select
            value={securityTypeFilter}
            onChange={(e) => setSecurityTypeFilter(e.target.value)}
            className="w-full px-4 py-2 text-xs text-slate-700 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer transition-all"
          >
            <option value="ALL">Semua Tipe Efek</option>
            <option value={SecurityType.SUKUK}>Sukuk</option>
            <option value={SecurityType.SAHAM}>Saham</option>
          </select>
        </div>

        {/* 3. Status Filter */}
        <div className="w-full md:w-56">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 text-xs text-slate-700 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer transition-all"
          >
            <option value="ALL">Semua Status</option>
            <option value={ContractStatus.PERFORMING}>Performing</option>
            <option value={ContractStatus.OBSERVATION}>Observation</option>
            <option value={ContractStatus.SUBSTANDARD}>Substandard</option>
            <option value={ContractStatus.DOUBTFUL}>Doubtful</option>
            <option value={ContractStatus.DEFAULTED}>Defaulted</option>
          </select>
        </div>
      </div>

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
      {/* {isFormOpen && (
        <RepaymentSecurityFormPanel 
          mode={formMode} 
          // Bisa melempar fungsi untuk me-refresh data (misal re-fetch) jika dibutuhkan
        />
      )} */}
    </div>
  );
}