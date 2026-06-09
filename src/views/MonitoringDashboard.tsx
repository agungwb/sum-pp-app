import React from 'react';

export default function MonitoringDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Halaman */}
      <div>
        <h2 className="text-2xl font-black text-[#090f26] tracking-tight">Ringkasan Data</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Selamat datang kembali di panel monitoring SUM.PP Fundex.
        </p>
      </div>

      {/* Kotak Putih Clean Awal */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center h-64">
        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-xl mb-4">
          📦
        </div>
        <h3 className="text-base font-bold text-[#090f26]">Wadah Konten Siap Pakai</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
          Struktur layout dasar sudah berhasil terjalin sempurna. Di iterasi selanjutnya kita akan isi area ini dengan kartu statistik finansial dan tabel monitoring pembayaran investee.
        </p>
      </div>

    </div>
  );
}