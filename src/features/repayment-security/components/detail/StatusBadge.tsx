// Helper: Status Badge (Menambahkan mapping status API HELD_BY_PLATFORM, SUBMITTED, dll)
export default function StatusBadge({ status }: { status: string }) {
    let color = 'bg-slate-100 text-slate-600 border border-slate-200';
    
    // Emerald (Sukses / Terjamin)
    if (status === 'DIBAYAR' || status === 'DIAMANKAN' || status === 'PAID' || status === 'HELD_BY_PLATFORM' || status === 'LIQUIDATED') {
      color = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    // Amber (Peringatan / Sedang Proses)
    else if (status === 'TERTUNDA' || status === 'DALAM PROSES' || status === 'OVERDUE' || status === 'UNDER_REVIEW' || status === 'SUBMITTED') {
      color = 'bg-amber-50 text-amber-700 border border-amber-300';
    }
    // Blue (Belum Waktunya / Menunggu / Biasa)
    else if (status === 'BELUM JATUH TEMPO' || status === 'MENUNGGU VERIFIKASI' || status === 'UNPAID' || status === 'PENDING') {
      color = 'bg-blue-50 text-blue-600 border border-blue-200';
    }
    // Red (Ditolak)
    else if (status === 'DECLINED') {
      color = 'bg-rose-50 text-rose-700 border border-rose-200';
    }
    
    // Replace underscores dengan spasi untuk tampilan yang lebih ramah
    const displayStatus = status ? status.replace(/_/g, ' ') : '-';
    
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase inline-block border-2 ${color}`}>
        {displayStatus}
      </span>
    );
  }