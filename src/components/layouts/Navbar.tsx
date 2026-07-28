import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';
import { useGlobalMode } from '../../contexts/GlobalModeContext';
import { SafeEditModal } from '../modals/SafeEditModal'; // Sesuaikan path import lu bro

interface NavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ isCollapsed, setIsCollapsed }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams(); 
  const { breadcrumbs } = useBreadcrumb();
  
  // Ambil isManagementMode dan setManagementMode dari Context
  const { isEditMode, setEditMode } = useGlobalMode();
  
  // State lokal untuk kontrol muncul/tidaknya Modal Konfirmasi Vercel
  const [isModalOpen, setIsModalOpen] = useState(false);



  const handleLogout = () => {
    localStorage.removeItem('sum_pp_token');
    navigate('/login');
  };

  // Logic klik toggle switch
  const handleToggleClick = () => {
    if (isEditMode) {
      // Kalau lagi mode edit dan mau dimatiin, langsung aja matiin (gak usah modal)
      setEditMode(false);
    } else {
      // Kalau lagi inactive dan mau dinyalain, tembak modal konfirmasi!
      setIsModalOpen(true);
    }
  };

  // Fungsi saat user berhasil mengetik string konfirmasi di modal
  const handleConfirmEditMode = () => {
    setEditMode(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 right-0 ${
          isCollapsed ? 'left-16' : 'left-64'
        } h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between z-40 transition-all duration-300`}
      >
        {/* Kiri: Toggle Sidebar & Breadcrumb */}
        <div className="flex items-center gap-4">
      

          <div className="flex items-center text-sm">
          <nav className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center text-[10px] text-slate-600">
                {item.path ? (
                  <Link to={item.path} className="font-semibold">{item.label}</Link>
                ) : (
                  <span className="font-normal text-slate-400">{item.label}</span>
                )}
                {/* Tambah separator '>' kalau bukan item terakhir */}
                {index < breadcrumbs.length - 1 && <span className="mx-2 text-gray-400">/</span>}
              </div>
            ))}
          </nav>
          </div>


        </div>

        {/* Kanan: Action Buttons, Info Profil & Logout */}
        <div className="flex items-center gap-5">
          
          {/* 🔥 MODERN TOGGLE SWITCH BUTTON */}
          <div className="flex flex-col gap-1 items-center">
            <span className={`text-[10px] font-medium text-slate-400 ${isEditMode ? 'text-amber-600' : 'text-slate-400'}`}>
              {/* {isManagementMode ? 'Mode Edit Aktif' : 'Mode Baca'} */}
              Mode edit
            </span>
            <button
              onClick={handleToggleClick}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                isEditMode ? 'bg-amber-300' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={isEditMode}
            >
              {/* Lingkaran putih (thumb) pada toggle */}
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  isEditMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* User Info Card */}
          <div className="flex items-center gap-3 border-l border-r border-slate-100 px-4">
            <div className="text-right">
              <p className="text-xs font-bold text-[#090f26]">Admin Fundex</p>
              <p className="text-[10px] font-medium text-slate-400">Super Management</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#090f26]">
              AF
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Render Modal Konfirmasi di luar hierarki wajar (menggunakan z-50 di dalamnya) */}
      <SafeEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmEditMode} 
      />
    </>
  );
}