import React from 'react';

export default function InfoRow({ 
  label, 
  value, 
  fontMono = false, 
  textClass = "text-slate-700" 
}: { 
  label: string; 
  value: React.ReactNode; 
  fontMono?: boolean; 
  textClass?: string 
}) {
  // Melakukan pengecekan jika value null, undefined, atau string kosong ""
  const displayValue = (value === null || value === undefined || value === "") ? "-" : value;

  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </span>
      <span className={`text-[13px] ${fontMono ? 'font-mono' : 'font-sans'} font-semibold ${textClass}`}>
        {displayValue}
      </span>
    </div>
  );
}
