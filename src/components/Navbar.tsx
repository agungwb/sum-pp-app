import React from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Tambahkan kontrak TypeScript untuk menerima status collapse dari induk
interface NavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function Navbar({ isCollapsed }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('sum_pp_token');
    navigate('/login');
  };



  return (
    // 2. UBAH DI SINI, BRO: Kita pakai fixed, top-0, right-0, dan left-nya dinamis dinilai dari status sidebar
    <header 
      className={`fixed top-0 right-0 ${
        isCollapsed ? 'left-16' : 'left-64'
      } h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between z-40 transition-all duration-300`}
    >
      
      {/* Kiri: Breadcrumb Penanda Lokasi */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-slate-400">SUM.PP</span>
        <span className="text-slate-300">{`>`}</span>
        <span className="font-bold text-[#090f26]">Monitoring Pembayaran</span>
      </div>

      {/* Kanan: Info Profil & Logout */}
      <div className="flex items-center gap-4">
        {/* User Info Card */}
        <div className="flex items-center gap-3 border-r border-slate-100 pr-4">
          <div className="text-right">
            <p className="text-xs font-bold text-[#090f26]">Admin Fundex</p>
            <p className="text-[10px] font-medium text-slate-400">Super Management</p>
          </div>
          {/* Avatar Bulat Minimalis */}
          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#090f26]">
            AF
          </div>
        </div>

        {/* Tombol Cepat Keluar */}
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 cursor-pointer"
        >
          Keluar
        </button>
      </div>

    </header>
  );
}