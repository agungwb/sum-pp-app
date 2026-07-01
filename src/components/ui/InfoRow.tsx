export default function InfoRow({ label, value, fontMono = false, textClass = "text-slate-700" }: { label: string; value: React.ReactNode; fontMono?: boolean; textClass?: string }) {
    return (
      <div className="flex flex-col">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</span>
        <span className={`text-[12px] ${fontMono ? 'font-mono' : 'font-sans'} font-semibold ${textClass}`}>{value}</span>
      </div>
    );
  }