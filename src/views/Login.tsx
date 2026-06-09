import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFundex from '../assets/logo-fundex.svg'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulasi loading jeda singkat biar terkesan riil memproses ke server
    setTimeout(() => {
      if (email === 'admin@fundex.id' && password === 'password123') {
        localStorage.setItem('sum_pp_token', 'token-sukses-v3');
        navigate('/dashboard/monitoring');
      } else {
        setError('Akses ditolak! Periksa kembali email & password Anda.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* KODE ANIMASI KUSTOM CSS (Isolated Keyframes) */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        @keyframes bar-grow-1 { 0%, 100% { height: 30%; } 50% { height: 75%; } }
        @keyframes bar-grow-2 { 0%, 100% { height: 45%; } 50% { height: 90%; } }
        @keyframes bar-grow-3 { 0%, 100% { height: 20%; } 50% { height: 60%; } }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        
        .animate-scanline { animation: scanline 6s linear infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-grid { animation: grid-move 4s linear infinite; }
        .anim-bar-1 { animation: bar-grow-1 3s ease-in-out infinite; }
        .anim-bar-2 { animation: bar-grow-2 2.5s ease-in-out infinite; }
        .anim-bar-3 { animation: bar-grow-3 3.5s ease-in-out infinite; }
        .animate-glow-red { animation: pulse-subtle 6s ease-in-out infinite; }
      `}</style>

      {/* KOLOM KIRI: Panel Animasi & Brand Identity */}
      <div 
        className="hidden md:flex md:w-1/2 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800"
        style={{
          // Poin 1 & 2: Mempertahankan bg lama sambil menambahkan sentuhan halus gradasi merah di sudut
          background: 'radial-gradient(circle at top right, rgba(125, 13, 32, 0.5) 0%, transparent 50%), #090f26'
        }}
      >
        
        {/* Dekorasi Grid & Cahaya Latar Belakang */}
        <div className="absolute inset-0 opacity-5 animate-grid" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        
        {/* Pendaran merah latar belakang yang dianimasikan secara halus */}
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-600 rounded-full blur-[130px] animate-glow-red"></div>

        {/* Top Header Logo Kelompok dengan SVG asli */}
        <div className="z-10 flex items-center gap-3">
        <img 
            src={logoFundex} 
            alt="Logo Fundex" 
            className="w-25 brightness-0 invert" // 'brightness-0 invert' bikin logo jadi putih bersih agar kontras dengan bg gelap
        />
      
        </div>

        {/* AREA ANIMASI UTAMA: Terdiri dari Identitas Baru + Monitor Dashboard */}
        <div className="z-10 flex flex-col items-center justify-center my-auto animate-float w-full">
          
          {/* Poin 1: Title "SUM.PP" besar dan Subtitle sistem di bagian atas monitor */}
          <div className="w-full max-w-md text-left mb-6 px-1">
            <h2 className="text-6xl font-black tracking-tight text-white">
              SUM<span className="text-rose-500">.</span>PP
            </h2>
            <p className="mt-2 text-lg font-medium text-slate-400">
              Sistem Untuk Monitoring - Pembayaran Penerbit
            </p>
            <div className="w-10 h-0.5 bg-rose-500/60 mt-3 rounded-full"></div>
          </div>
          
          {/* Bezel / Frame Monitor */}
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0d1536]/90 p-4 shadow-2xl relative backdrop-blur-md">
            
            {/* Sinar Scanline Efek Monitor */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-scanline"></div>
            </div>

            {/* Top Bar Monitor (Window Control) */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 opacity-80"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 opacity-60"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 opacity-60"></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[10px] tracking-wider text-rose-400 font-mono font-bold uppercase">LIVE CASHFLOW</span>
              </div>
            </div>

            {/* Isi Dashboard Monitor */}
            <div className="grid grid-cols-3 gap-3">
              
              {/* Widget 1: Grafik Arus Kas Naik Turun */}
              <div className="col-span-2 rounded-xl bg-[#060a1f] p-3 border border-slate-800 flex flex-col justify-between h-32 relative">
                <span className="text-[10px] font-bold text-slate-400 font-mono">INVESTEE PAYOUT RATIO</span>
                
                {/* Batang Grafik Bergerak */}
                <div className="flex items-end justify-between gap-2 h-16 px-2">
                  <div className="w-full bg-gradient-to-t from-cyan-500 to-blue-300 rounded-t anim-bar-1"></div>
                  <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t anim-bar-2"></div>
                  <div className="w-full bg-gradient-to-t from-cyan-700 to-blue-400 rounded-t anim-bar-3"></div>
                  <div className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-t anim-bar-1"></div>
                  <div className="w-full bg-gradient-to-t from-cyan-600 to-blue-500 rounded-t anim-bar-2"></div>
                </div>
              </div>

              {/* Widget 2: Finansial Persentase Bulatan */}
              <div className="col-span-1 rounded-xl bg-[#060a1f] p-3 border border-slate-800 flex flex-col items-center justify-center text-center h-32">
                <div className="relative flex items-center justify-center">
                  {/* Lingkaran Berputar / Pulse */}
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-rose-500 animate-spin" style={{ animationDuration: '8s' }}></div>
                  <span className="absolute text-[11px] font-mono font-bold text-white">94.2%</span>
                </div>
                <span className="text-[9px] mt-2 font-semibold text-slate-500 uppercase tracking-tight">Sukuk Yield</span>
              </div>

              {/* Widget 3: Garis Tracking Arus Kas Panjang */}
              <div className="col-span-3 rounded-xl bg-[#060a1f] p-3 border border-slate-800 flex items-center justify-between h-14">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Total Distribution</span>
                  <span className="text-xs font-mono font-bold text-white mt-0.5">Rp 4.82B</span>
                </div>
                {/* Mini Waveform SVG */}
                <svg className="w-24 h-8 text-rose-500" viewBox="0 0 100 30" fill="none">
                  <path d="M0 20 Q 15 5, 30 15 T 60 10 T 90 25 T 100 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0 20 Q 15 5, 30 15 T 60 10 T 90 25 T 100 5 L 100 30 L 0 30 Z" fill="currentColor" fillOpacity="0.05" />
                </svg>
              </div>

            </div>

          </div>

          {/* Kaki Dudukan Monitor */}
          <div className="w-12 h-4 bg-slate-800 border-x border-slate-700"></div>
          <div className="w-28 h-2 bg-slate-700 rounded-full shadow-md"></div>
        </div>

        {/* Bottom Copy */}
        <div className="text-[10px] font-sans text-white leading-normal tracking-wide text-center">
            Copyright © 2026 PT Dana Investasi Bersama. All Rights Reserved.
          </div>
      </div>

      {/* KOLOM KANAN: Form Login (Clean, Putih, Minimalis Modern) */}
      <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:px-24 xl:px-36 bg-white shadow-inner">
        <div className="mx-auto w-full max-w-md">
          
          {/* Poin 3: Mengganti judul utama kanan dengan "Silahkan login" & memperkecil ukurannya */}
          <div className="mb-10 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-[#090f26]">
              Silahkan Login
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500 leading-relaxed">
              Masukkan Email Perusahaan & Password Anda
            </p>
            <div className="w-8 h-0.5 bg-gradient-to-r from-[#090f26] to-rose-500 mt-3 rounded-full"></div>
          </div>

          {/* Kotak Pesan Error */}
          {error && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700 flex items-center gap-2">
              <span className="font-bold">⚠️</span> {error}
            </div>
          )}

          {/* Form Akses */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Perusahaan
              </label>
              <input
                type="email"
                required
                disabled={isLoading}
                placeholder="developer@fundex.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-[#090f26] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#090f26]/5 transition-all text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Kata Sandi
                </label>
                <a href="#" className="text-xs font-semibold text-slate-500 hover:text-rose-500 hover:underline transition-colors">
                  Lupa sandi?
                </a>
              </div>
              <input
                type="password"
                required
                disabled={isLoading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-[#090f26] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#090f26]/5 transition-all text-sm"
              />
            </div>

            {/* Tombol Masuk Utama */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-xl bg-[#090f26] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/10 hover:bg-[#121c42] focus:outline-none focus:ring-4 focus:ring-[#090f26]/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menghubungkan...</span>
                </div>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>

          {/* Hak Cipta */}
          <p className="mt-2 text-left text-xs font-medium text-slate-400">
            &copy; Copyright © 2026 PT Dana Investasi Bersama. <br />All Rights Reserved.
          </p>

        </div>
      </div>

    </div>
  );
}