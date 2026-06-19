// src/pages/repayment/RepaymentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { RepaymentSecurity, ApiResponse } from '../../types/repayment';
import RepaymentCard from '../../components/repayment/RepaymentCard';

// Ambil URL dari Environment variable (Best Practice)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RepaymentDashboard() {
  const [data, setData] = useState<RepaymentSecurity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        setLoading(true);
        // Panggil endpoint backend
        const response = await fetch(`${API_BASE_URL}/repayment/securities`);
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        
        const result: ApiResponse<RepaymentSecurity[]> = await response.json();
        setData(result.data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem');
      } finally {
        setLoading(false);
      }
    };

    fetchRepayments();
  }, []);

  // Logic filter & search berantai
  const filteredData = data?.items?.filter((item) => {
    const matchesSearch = 
      item.investeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.securityName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || item.contractStatus === statusFilter;

    return matchesSearch && matchesStatus;
    return null;
  });

  return (
    <div className="p-5 w-full max-w-7xl mx-auto space-y-5 bg-slate-50/20 min-h-screen text-slate-600 antialiased">
      
      {/* HEADER SECTION */}
      <div className="mt-8 md:mt-12 pb-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-700">Repayment Penerbit</h1>
          <p className="text-xs text-slate-400 mt-0.5">Monitoring pembayaran sekuritas investee Fundex (Sukuk & Saham).</p>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-400 text-xs">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Cari penerbit atau sekuritas..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all shadow-xs placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-40 relative">
             <select
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all shadow-xs appearance-none text-slate-600 font-medium cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              <option value="PERFORMING">Performing</option>
              <option value="OBSERVATION">Observation</option>
              <option value="SUBSTANDARD">Substandard</option>
              <option value="DOUBTFUL">Doubtful</option>
              <option value="DEFAULTED">Defaulted</option>
              <option value="FINISHED">Finished</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <span className="text-slate-400 text-[10px]">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATE HANDLERS (Loading & Error) */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-sm font-medium text-slate-400 animate-pulse">Memuat data repayment...</div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-sm text-rose-600 font-medium flex items-center justify-center">
          ⚠️ {error}
        </div>
      )}

      {/* GRID LAYOUT (3 Columns) */}
      {!loading && !error && (
        <>
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200/60 border-dashed">
              <span className="text-2xl mb-2">📭</span>
              <p className="text-sm text-slate-400 font-medium">Data tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredData.map((repayment) => (
                <RepaymentCard key={repayment.id} data={repayment} />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}