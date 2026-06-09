import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../views/Login';
import DashboardLayout from '../layouts/DashboardLayout';
import MonitoringDashboard from '../views/MonitoringDashboard';

// Komponen Halaman Dummy untuk mengetes apakah redirect login berhasil
const TestDashboard = () => {
  const token = localStorage.getItem('sum_pp_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Login & Routing Sukses!</h1>
        <p className="mt-2 text-sm text-slate-500">
          Anda berhasil masuk ke halaman Dashboard Monitoring SUM-PP.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem('sum_pp_token');
            window.location.reload();
          }}
          className="mt-6 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
        >
          Keluar (Logout)
        </button>
      </div>
    </div>
  );
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Jalur default mengarah ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Halaman Utama Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Jalur Terproteksi: Struktur Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Halaman utama di dalam dashboard */}
          <Route path="monitoring" element={<MonitoringDashboard />} />
          
          {/* Placeholder Rute Kosong untuk Menu Dummy Lainnya */}
          <Route path="menu-dua" element={<div className="bg-white p-6 rounded-xl border border-slate-100">Konten Menu Dua</div>} />
          <Route path="menu-three" element={<div className="bg-white p-6 rounded-xl border border-slate-100">Konten Menu Tiga</div>} />
          <Route path="menu-empat" element={<div className="bg-white p-6 rounded-xl border border-slate-100">Konten Menu Empat</div>} />
        </Route>
        
        {/* Fallback route jika mengetik path asal-asalan */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

