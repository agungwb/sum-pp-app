import React from 'react';

const MonitoringLogo = () => {
  return (
    <div className="flex flex-col">
      {/* --- BARIS 1: Teks SUM dan Logo Monitor (Sejajar) --- */}
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-black tracking-tight text-white select-none leading-none">
          SUM<span className="text-rose-500">.</span>
        </h2>
        
        {/* Ikon Monitor Futuristik (Sebelah Kanan SUM) */}
        <div className="relative flex items-center justify-center w-9 h-8">
          {/* Efek Glow/Pulse di Belakang */}
          <div className="absolute inset-0 bg-rose-500/20 rounded-lg blur-md animate-pulse"></div>
          
          {/* Ikon Monitor SVG */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-full h-full text-slate-200 relative z-10" 
            stroke="currentColor" 
            strokeWidth="1.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Layar Monitor */}
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" className="fill-slate-800" />
            {/* Penyangga */}
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            
            {/* Data Berdenyut di Dalam Layar */}
            <path 
              d="M6 10l3-3 3 3 6-6" 
              className="text-rose-500 animate-pulse" 
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* --- BARIS 2 & 3: Subteks dan Garis (Beda Baris) --- */}
      <p className="mt-2 text-xs font-medium text-slate-400 leading-normal">
        Sistem Untuk Monitoring
      </p>
      <div className="w-8 h-0.5 bg-rose-500/60 mt-3 rounded-full"></div>
    </div>
  );
};

export default MonitoringLogo;