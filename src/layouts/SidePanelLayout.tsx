// src/components/layout/SidePanelLayout.tsx
import React from 'react';
import { useSidePanel } from '../context/SidePanelContext';

export default function SidePanelLayout() {
  const { isOpen, isMinimized, title, content, closePanel, minimizePanel, restorePanel } = useSidePanel();

  // Jika tidak open dan tidak minimize, tidak usah di-render
  if (!isOpen && !isMinimized) return null;

  return (
    <>
      {/* Backdrop (Hanya tampil kalau form terbuka dan tidak sedang di-minimize) */}
      {isOpen && !isMinimized && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity"
          onClick={closePanel}
        ></div>
      )}

      {/* CONTAINER UTAMA PANEL (Terbuka) */}
      <div 
        className={`fixed top-0 right-0 h-full z-50 flex transition-transform duration-300 ease-out ${
          isOpen && !isMinimized ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* TAB TAMBAHAN KIRI (Form Terbuka) - Minimalis */}
        {
            isOpen && !isMinimized  && (
                <div className="absolute -left-9 top-8 flex flex-col gap-1.5">
                    {/* Button Close (Di Atas & Merah) */}
                    <button 
                        onClick={closePanel} 
                        title="Close Panel"
                        className="w-9 h-9 flex items-center justify-center bg-white rounded-l-lg shadow-[-2px_2px_5px_-1px_rgba(0,0,0,0.08)] border-y border-l border-slate-200 text-rose-600 hover:bg-rose-50 transition-all hover:scale-[1.2]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    
                    {/* Button Minimize (Di Bawah & Panah Kanan) */}
                    <button 
                        onClick={minimizePanel} 
                        title="Minimize Panel"
                        className="w-9 h-9 flex items-center justify-center bg-white rounded-l-lg shadow-[-2px_2px_5px_-1px_rgba(0,0,0,0.08)] border-y border-l border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-slate-50 transition-all hover:scale-[1.2]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

            )
        }
        

        {/* KERANGKA PANEL DALAM */}
        <div className="w-[38vw] min-w-[450px] max-w-[600px] bg-white h-full shadow-2xl flex flex-col relative">
           {content}
        </div>
      </div>

      {/* TAB MINIMIZED (NEMPEL KANAN LAYAR) */}
      <div 
        className={`fixed top-1/3 right-0 z-50 flex flex-col items-end gap-1.5 transform transition-transform duration-300 ease-out ${
          isMinimized ? 'translate-x-0' : 'translate-x-[120%]'
        }`}
      >
         {/* Button Close (Merah, Persis di atas tab) */}
         <button 
           onClick={closePanel} 
           title="Tutup Form"
           className="w-10 h-10 flex items-center justify-center bg-white rounded-l-lg shadow-[-4px_4px_6px_-1px_rgba(0,0,0,0.1)] border-y border-l border-slate-200 text-rose-600 hover:bg-rose-50 transition-all hover:scale-[1.2]"
         >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
         </button>

         {/* Tab Buka Form / Tambahkan Data Baru */}
         <button 
           onClick={restorePanel}
           className="flex items-center gap-2 px-2.5 py-4 bg-amber-500 text-white rounded-l-xl shadow-[-4px_4px_10px_-1px_rgba(245,158,11,0.4)] hover:bg-amber-600 transition-all hover:scale-[1.03] border-y border-l border-amber-600"
           style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
         >
           {/* Icon Arrow ke Kiri */}
           <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
           <span className="font-bold text-[11px] tracking-widest uppercase">
             {title || 'Tambahkan Data Repayment Baru'}
           </span>
         </button>
      </div>
    </>
  );
}