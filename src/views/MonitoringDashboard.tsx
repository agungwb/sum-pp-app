import React, { useState } from 'react';

// =========================================================================
// INTERFACES & CONTRACTS (TypeScript Type Safety)
// =========================================================================
interface UrgentAlert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  actionLabel: string;
}

interface CalendarEvent {
  day: number;
  type: 'sf' | 'db' | 'delay';
  label: string;
}

export default function MonitoringDashboard() {
  const [currentMonth] = useState('Juni 2026');

  // Dummy State data - Terintegrasi dengan silsilah operasional Fundex
  const [alerts] = useState<UrgentAlert[]>([
    {
      id: 'ALRT-001',
      type: 'danger',
      title: 'Keterlambatan Sinking Fund — PT KKI Tahap 1',
      description: 'Melewati jatuh tempo 5 hari kalender. Dana penampung Hana Bank belum terisi.',
      time: 'Baru Saja',
      actionLabel: 'Eksekusi Cek',
    },
    {
      id: 'ALRT-002',
      type: 'warning',
      title: 'Invoice Monitoring Fee — CV Megah Lestari',
      description: 'Sudah memasuki siklus tanggal 16. Sistem siap melakukan email blast ke PIC.',
      time: '2 jam lalu',
      actionLabel: 'Kirim Invoice',
    },
    {
      id: 'ALRT-003',
      type: 'info',
      title: 'Validasi RUPSU — Nusa Farm',
      description: 'Pemberlakuan addendum skema restrukturisasi imbal hasil selesai ditinjau.',
      time: '1 hari lalu',
      actionLabel: 'Lihat Kontrak',
    },
  ]);

  // Kalender Operasional Juni 2026 (Compact Block)
  const daysInMonth = 30;
  const calendarEvents: Record<number, CalendarEvent[]> = {
    5: [{ day: 5, type: 'sf', label: 'SF: Temu Sushi' }],
    12: [{ day: 12, type: 'db', label: 'DB: Temu Sushi' }],
    13: [{ day: 13, type: 'sf', label: 'SF: Coffee Toffee' }],
    16: [{ day: 16, type: 'delay', label: 'Keterlambatan: CV Megah' }],
    21: [{ day: 21, type: 'sf', label: 'SF: PT KKI Tahap 1' }],
    24: [{ day: 24, type: 'db', label: 'DB: PT Meimo' }],
  };

  // Rangkapan data performa finansial bulanan
  const chartData = [
    { month: 'Jan', proyeksi: 85, aktual: 85 },
    { month: 'Feb', proyeksi: 95, aktual: 90 },
    { month: 'Mar', proyeksi: 110, aktual: 110 },
    { month: 'Apr', proyeksi: 75, aktual: 63 },
    { month: 'Mei', proyeksi: 130, font: 125, aktual: 125 },
    { month: 'Jun', proyeksi: 140, aktual: 95 },
  ];

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="p-5 w-full max-w-7xl mx-auto space-y-4 bg-slate-50/20 min-h-screen text-slate-600 antialiased">
      
      {/* TITLE CONTAINER (Subtle & Flat Layout) */}
      <div className="mt-12 pb-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-700">Ringkasan Ekosistem Pembayaran</h1>
        <p className="text-xs text-slate-400 mt-0.5">Sistem Pengawasan Jatuh Tempo & Kepatuhan Portofolio Investee Fundex.</p>
      </div>

      {/* =========================================================================
          1. COMPACT METRICS ROW (4 UNIFORM CARDS)
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Kewajiban Bulan Ini</div>
          <div className="text-xl font-bold text-slate-700 mt-1 font-mono">{formatRupiah(1450000000)}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">↑ 12%</span> dibanding rentang lalu
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Collection Rate</div>
          <div className="text-xl font-bold text-slate-700 mt-1 font-mono">78.4%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-emerald-500/70 h-full rounded-full" style={{ width: '78.4%' }}></div>
          </div>
        </div>

        {/* Card 3 (Denda - Now completely uniform and clean) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Total Denda Berjalan</div>
          <div className="text-xl font-bold text-slate-700 mt-1 font-mono">{formatRupiah(131583333)}</div>
          <div className="text-[10px] text-rose-500/80 font-medium mt-1">
            ⚠️ 1 Emiten dalam penanganan hukum
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Portofolio Penerbit</div>
          <div className="text-xl font-bold text-slate-700 mt-1 flex items-baseline gap-1 font-mono">
            18 <span className="text-[10px] font-normal text-slate-400 font-sans">Sukuk</span> 
            <span className="text-slate-300 mx-0.5">/</span> 
            4 <span className="text-[10px] font-normal text-slate-400 font-sans">Saham</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DATA GRID (COMPACT CHART & MINI BLOCK CALENDAR)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* COMPACT CHART CONTAINER */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-600">Realisasi Penerimaan Dana Sinking Fund</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Komparasi nominal target proyeksi vs realisasi saldo penampung</p>
            </div>
            <div className="flex items-center gap-2.5 text-[10px] font-medium">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-slate-200/80 rounded-xs"></span> <span className="text-slate-400">Target</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-slate-700 rounded-xs"></span> <span className="text-slate-400">Realisasi</span>
              </div>
            </div>
          </div>

          {/* Ramping Height Chart Layout */}
          <div className="h-40 flex items-end justify-between gap-5 pt-6 px-2 relative">
            <div className="absolute inset-x-0 bottom-0 top-6 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-dashed border-slate-300 w-full h-0"></div>
              <div className="border-b border-dashed border-slate-300 w-full h-0"></div>
              <div className="border-b border-dashed border-slate-300 w-full h-0"></div>
            </div>

            {chartData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end z-10">
                <div className="flex items-end gap-1.5 w-full justify-center max-w-[48px] h-full">
                  {/* Target Bar (Soft Muted Charcoal) */}
                  <div 
                    className="bg-slate-200/80 w-full rounded-t-xs transition-colors hover:bg-slate-300/70 cursor-pointer"
                    style={{ height: `${(data.proyeksi / 140) * 100}%` }}
                  ></div>
                  {/* Realisasi Bar (Premium Soft Dark Slate) */}
                  <div 
                    className="bg-slate-700 w-full rounded-t-xs transition-colors hover:bg-slate-800 relative group cursor-pointer"
                    style={{ height: `${(data.aktual / 140) * 100}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono whitespace-nowrap">
                      {data.aktual * 10} Jt
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COMPACT MINI CALENDAR CONTAINER */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              📅 Alur Batas Tenggat <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">{currentMonth}</span>
            </h3>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mt-2">
            <div>M</div><div>S</div><div>S</div><div>R</div><div>K</div><div>J</div><div>S</div>
          </div>

          <div className="grid grid-cols-7 gap-1 mt-1 grow content-start">
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const dayNumber = index + 1;
              const hasEvents = calendarEvents[dayNumber];

              let cellStyle = "bg-slate-50/60 text-slate-500 hover:bg-slate-100/80";
              if (hasEvents) {
                const primaryEvent = hasEvents[0].type;
                if (primaryEvent === 'sf') cellStyle = "bg-amber-50/80 text-amber-700 border border-amber-200/60 font-semibold";
                if (primaryEvent === 'db') cellStyle = "bg-emerald-50/80 text-emerald-700 border border-emerald-200/60 font-semibold";
                if (primaryEvent === 'delay') cellStyle = "bg-rose-50/80 text-rose-700 border border-rose-200/60 font-semibold";
              }

              return (
                <div 
                  key={dayNumber} 
                  className={`h-7 rounded-md flex flex-col items-center justify-center text-[11px] tracking-tight relative cursor-pointer group transition-all ${cellStyle}`}
                >
                  <span>{dayNumber}</span>
                  {hasEvents && (
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-0.5 px-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 whitespace-nowrap">
                      {hasEvents[0].label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* =========================================================================
          3. COMPLIANCE & RISK ACTION CENTER (COMPACT LIST)
          ========================================================================= */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="text-xs font-bold text-slate-600">Mitigasi Risiko & Kepatuhan Operasional</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Daftar eskalasi otomatis investee terdeteksi sistem yang membutuhkan keputusan taktis.</p>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-sm">
            {alerts.length} Kasus Terbuka
          </span>
        </div>

        {/* Compact List Items */}
        <div className="divide-y divide-slate-100 mt-1">
          {alerts.map((alert) => (
            <div key={alert.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs group">
              <div className="flex items-start gap-2.5">
                {/* Clean Micro Indicators instead of flashy blocks */}
                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-medium ${
                  alert.type === 'danger' ? 'bg-rose-50 text-rose-600' :
                  alert.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {alert.type === 'danger' ? '!' : alert.type === 'warning' ? '?' : 'i'}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 group-hover:text-slate-800 transition-colors">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{alert.description}</p>
                </div>
              </div>
              
              {/* Compact Dynamic Thin Actions Button */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <span className="text-[10px] font-mono text-slate-400">{alert.time}</span>
                <button className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all cursor-pointer focus:outline-none ${
                  alert.type === 'danger' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70' :
                  alert.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70' :
                  'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}>
                  {alert.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}