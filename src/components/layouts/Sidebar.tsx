import React from 'react';
import { NavLink } from 'react-router-dom';
import logoFundex from '../../assets/logo-fundex.svg';
import MonitoringLogo from '../ui/MonitoringLogo';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {

  const menus = [
    { 
      name: 'Dashboard', 
      path: '/dashboard/overview', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    { 
      name: 'Monitor Investee', 
      path: '/repayment/monitoring', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    // Menambahkan Menu Repayment Penerbit yang baru kita buat
    { 
      name: 'Repayment Penerbit', 
      path: '/repayment/securities', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      name: 'Kupon & Sinking Fund', 
      path: '/repayment/sinking-fund', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    { 
      name: 'Cek Mundur & Kolateral', 
      path: '/repayment/collaterals', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      name: 'Denda & Kepatuhan', 
      path: '/repayment/compliance', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    { 
      name: 'Monitoring Fee & Pajak', 
      path: '/repayment/billing', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
  ];

  // Bikin handler fungsi klik terpisah biar bisa dipasang log sebelum menembak state
  const handleToggle = () => {
    // Tembak fungsi pengubah milik layout utama
    setIsCollapsed(!isCollapsed); 
  };

  return (
    <div 
      className={`min-h-screen flex flex-col justify-between text-white border-r border-slate-900 z-20 shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        // Mempertahankan gradasi merah kuat 0.14 dari sudut kanan bawah
        background: 'radial-gradient(circle at bottom right, rgba(244, 63, 94, 0.20) 0%, transparent 65%), #090f26'
      }}
    >
      <div>
        {/* ========================================== */}
        {/* HEADER BRANDING SIDEBAR                    */}
        {/* ========================================== */}
        {isCollapsed ? (
          // Poin 1 & 3: Saat mode collapsed, tombol posisi PALING ATAS, baru tulisan SUM.PP di bawahnya
          <div className="pt-6 pb-4 flex flex-col items-center gap-3.5">
            {/* Poin 2: Mengganti ikon ke gaya 'Horizontal Lines Staggered' yang modern */}
            <button
              onClick={() => handleToggle()}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
              title="Perluas Menu"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" />
              </svg>
            </button>
            
            <h2 className="text-[11px] font-black tracking-tighter text-white text-center leading-none select-none">
              SUM<span className="text-rose-500">.</span>
            </h2>
          </div>
        ) : (
          // Mode Normal: Collapse menu berada di KANAN ATAS (Paling Atas)
          <div className="p-6 pb-4 flex items-start justify-between gap-4">
            <MonitoringLogo  />

            {/* Poin 1 & 2: Tombol collapse ditaruh paling atas kanan dengan ikon garis list futuristik */}
            <button
              onClick={() => handleToggle()}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none mt-1 shrink-0 cursor-pointer"
              title="Sembunyikan Menu"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" />
              </svg>
            </button>
          </div>
        )}

        {/* ========================================== */}
        {/* LIST NAVIGASI MENU                         */}
        {/* ========================================== */}
        <nav className={`mt-6 space-y-0.5 ${isCollapsed ? 'px-1.5' : 'px-3'}`}>
          {menus.map((menu, index) => (
            <NavLink
              key={index}
              to={menu.path}
              className={({ isActive }) => `
                flex items-center py-2 text-sm transition-all duration-150 rounded-lg
                ${isActive 
                  ? 'bg-white/10 text-white font-medium shadow-sm border-l-2 border-rose-500' 
                  : 'text-slate-400 font-light hover:bg-white/5 hover:text-white'}
                ${isCollapsed 
                  ? 'justify-center px-0' 
                  : 'gap-3 pr-4 pl-3.5'}
                ${isActive && !isCollapsed ? 'pl-3' : ''} 
              `}
              title={isCollapsed ? menu.name : undefined}
            >
              <span className="transition-colors">{menu.icon}</span>
              {!isCollapsed && <span className="truncate">{menu.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ========================================== */}
      {/* BOTTOM SECTION: LOGO & COPYRIGHT           */}
      {/* ========================================== */}
      <div className={`p-4 border-t border-slate-800/40 bg-slate-950/10 flex flex-col ${isCollapsed ? 'items-center justify-center' : 'px-6 py-5 gap-3.5'}`}>
        <img 
          src={logoFundex} 
          alt="Logo Fundex" 
          className={`brightness-0 invert opacity-100 transition-all duration-300 ${
            isCollapsed ? 'h-3.5 w-auto max-w-[40px]' : 'h-5.5 w-auto self-start'
          }`} 
        />
        {!isCollapsed && (
          <div className="text-[9px] font-sans text-slate-500 leading-normal tracking-wide">
            Copyright © 2026 PT Dana Investasi Bersama. All Rights Reserved.
          </div>
        )}
      </div>

    </div>
  );
}