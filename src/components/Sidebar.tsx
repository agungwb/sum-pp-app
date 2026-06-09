import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoFundex from '../assets/logo-fundex.svg';

export default function Sidebar() {
  // State untuk mengontrol mode minimize/expand sidebar
  const [isMinimized, setIsMinimized] = useState(false);

  const menus = [
    { 
      name: 'Monitoring Utama', 
      path: '/dashboard/monitoring', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      name: 'Menu Dua', 
      path: '/dashboard/menu-dua', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    { 
      name: 'Menu Tiga', 
      path: '/dashboard/menu-tiga', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      name: 'Menu Empat', 
      path: '/dashboard/menu-empat', 
      icon: (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <div 
      className={`min-h-screen flex flex-col justify-between text-white border-r border-slate-900 z-20 shrink-0 transition-all duration-300 ease-in-out ${
        isMinimized ? 'w-16' : 'w-64'
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
        {isMinimized ? (
          // Poin 1 & 3: Saat mode collapsed, tombol posisi PALING ATAS, baru tulisan SUM.PP di bawahnya
          <div className="pt-6 pb-4 flex flex-col items-center gap-3.5">
            {/* Poin 2: Mengganti ikon ke gaya 'Horizontal Lines Staggered' yang modern */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none"
              title="Perluas Menu"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" />
              </svg>
            </button>
            
            <h2 className="text-[11px] font-black tracking-tighter text-white text-center leading-none select-none">
              SUM<span className="text-rose-500">.</span>PP
            </h2>
          </div>
        ) : (
          // Mode Normal: Collapse menu berada di KANAN ATAS (Paling Atas)
          <div className="p-6 pb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white select-none">
                SUM<span className="text-rose-500">.</span>PP
              </h2>
              <p className="mt-1.5 text-xs font-medium text-slate-400 leading-normal">
                Sistem Untuk Monitoring - Pembayaran Penerbit
              </p>
              <div className="w-8 h-0.5 bg-rose-500/60 mt-3 rounded-full"></div>
            </div>

            {/* Poin 1 & 2: Tombol collapse ditaruh paling atas kanan dengan ikon garis list futuristik */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none mt-1 shrink-0"
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
        <nav className={`mt-6 space-y-0.5 ${isMinimized ? 'px-1.5' : 'px-3'}`}>
          {menus.map((menu, index) => (
            <NavLink
              key={index}
              to={menu.path}
              className={({ isActive }) => `
                flex items-center py-2 text-sm transition-all duration-150 rounded-lg
                ${isActive 
                  ? 'bg-white/10 text-white font-medium shadow-sm border-l-2 border-rose-500' 
                  : 'text-slate-400 font-light hover:bg-white/5 hover:text-white'}
                ${isMinimized 
                  ? 'justify-center px-0' 
                  : 'gap-3 pr-4 pl-3.5'}
                ${isActive && !isMinimized ? 'pl-3' : ''} 
              `}
              title={isMinimized ? menu.name : undefined}
            >
              <span className="transition-colors">{menu.icon}</span>
              {!isMinimized && <span className="truncate">{menu.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ========================================== */}
      {/* BOTTOM SECTION: LOGO & COPYRIGHT           */}
      {/* ========================================== */}
      <div className={`p-4 border-t border-slate-800/40 bg-slate-950/10 flex flex-col ${isMinimized ? 'items-center justify-center' : 'px-6 py-5 gap-3.5'}`}>
        <img 
          src={logoFundex} 
          alt="Logo Fundex" 
          className={`brightness-0 invert opacity-100 transition-all duration-300 ${
            isMinimized ? 'h-3.5 w-auto max-w-[40px]' : 'h-5.5 w-auto self-start'
          }`} 
        />
        {!isMinimized && (
          <div className="text-[9px] font-sans text-slate-500 leading-normal tracking-wide">
            Copyright © 2026 PT Dana Investasi Bersama. All Rights Reserved.
          </div>
        )}
      </div>

    </div>
  );
}