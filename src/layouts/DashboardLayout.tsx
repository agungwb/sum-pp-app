import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const token = localStorage.getItem('sum_pp_token');

  // Proteksi Route Tingkat Global Layout
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      
      {/* Panel Kiri: Navigasi Menu */}
      <Sidebar />

      {/* Panel Kanan: Area Utama */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Atas: Navbar */}
        <Navbar />

        {/* Bawah: Area Konten Dinamis yang akan berganti-ganti */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}