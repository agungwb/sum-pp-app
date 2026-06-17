// src/components/repayment/RepaymentCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { RepaymentSecurity, ContractStatus, SecurityType } from '../../types/repayment';

interface Props {
  data: RepaymentSecurity;
}

export default function RepaymentCard({ data }: Props) {
  // Formatters

  const formatRupiah = (numStr: string) => {
    const num = parseFloat(numStr);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatCompactDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', month: 'short', year: '2-digit' 
    }).format(new Date(dateStr));
  };

  // Status Styling Generator
  const getStatusStyle = (status: ContractStatus) => {
    const styles: Record<ContractStatus, string> = {
      PERFORMING: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      OBSERVATION: 'bg-amber-50 text-amber-700 border-amber-300',
      SUBSTANDARD: 'bg-orange-50 text-orange-700 border-orange-300',
      DOUBTFUL: 'bg-rose-50 text-rose-700 border-rose-300',
      DEFAULTED: 'bg-slate-800 text-white border-slate-700',
      FINISHED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return styles[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  // Type Styling
  const getTypeStyle = (type: SecurityType) => {
    return type === 'Sukuk' 
      ? 'bg-blue-50 text-blue-600 border-blue-200' 
      : 'bg-rose-50 text-rose-600 border-rose-200';
  };

  // Dummy Progress Calculation
  const sinkingFundProgress = Math.round(100 * Number(data.sumReceiptSinkingFund) / Number(data.contractUnderlyingFund)); 
  const circleRadius = 14; 
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (sinkingFundProgress / 100) * circleCircumference;

  return (
    <div className="bg-white p-3 rounded-xl border-2 border-slate-200 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group">
      
      {/* HEADER: Title & Status */}
      <div className="flex justify-between items-start gap-2 border-b-2 border-slate-100 pb-2 mb-2">
        <div className="min-w-0 pr-2">
          <h3 className="text-[13px] font-bold text-slate-700 leading-tight truncate group-hover:text-slate-900 transition-colors" title={data.investeeName}>
            {data.investeeName}
          </h3>
          <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate" title={data.investeeNameLegal}>
            {data.investeeNameLegal}
          </p>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border-2 tracking-wide whitespace-nowrap uppercase shrink-0 ${getStatusStyle(data.contractStatus)}`}>
          {data.contractStatus}
        </span>
      </div>

      {/* BODY: Security Info & Financials */}
      <div className="space-y-2 grow">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border-2 shrink-0 ${getTypeStyle(data.securityType)}`}>
            {data.securityType}
          </span>
          <span className="text-[11px] font-semibold text-slate-600 truncate" title={data.securityName}>
            {data.securityName}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border-2 border-slate-100">
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pendanaan</p>
            <p className="text-[13px] font-bold text-slate-700 font-mono mt-0.5">
              {formatRupiah(data.contractUnderlyingFund)}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              {data.securityType === 'Sukuk' ? 'Kupon' : 'Div. Yield'}
            </p>
            <p className="text-[13px] font-bold text-emerald-600 font-mono mt-0.5">
              {data.contractYieldRateAnnually}% <span className="text-[9px] text-slate-400 font-sans font-medium">p.a.</span>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER: 3 Columns Layout (Di-adjust jadi items-stretch & justify-between) */}
      <div className="mt-3 pt-2.5 border-t-2 border-slate-100 flex items-stretch justify-between gap-2">
        
        {/* Kolom 1: Durasi & Range Tanggal */}
        <div className="flex flex-col justify-between leading-tight min-w-0">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Durasi: {data.contractDurationInMonths} Bulan
          </span>
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] text-slate-600 font-medium">
              <span className="text-slate-400 inline-block w-11">Mulai:</span> 
              <span className="font-mono">{formatCompactDate(data.contractStartDate)}</span>
            </div>
            <div className="text-[10px] text-slate-600 font-medium">
              <span className="text-slate-400 inline-block w-11">Selesai:</span> 
              <span className="font-mono">{formatCompactDate(data.contractEndDate)}</span>
            </div>
          </div>
        </div>

        {/* Kolom 2: Doughnut Chart Centered */}
        <div className="flex flex-col items-center justify-between shrink-0">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Dana Masuk
          </span>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 transform -rotate-90">
              <circle cx="16" cy="16" r={circleRadius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-300" />
              <circle 
                cx="16" cy="16" r={circleRadius} 
                stroke="currentColor" strokeWidth="3" fill="transparent" 
                className={`${
                    sinkingFundProgress < 100 ? "text-orange-500" : "text-green-500"
                  } transition-all duration-1000 ease-out`}
                strokeDasharray={circleCircumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[8px] font-bold text-slate-600">{sinkingFundProgress.toFixed(0)}%</span>
          </div>
        </div>

        {/* Kolom 3: Button Bottom Right */}
      
        <div className="shrink-0 flex flex-col justify-end">
          <Link 
            to={`/dashboard/repayment/${data.id}`} 
            className="flex items-center gap-1.5 text-[10px] font-bold bg-white text-slate-700 border-2 border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
          >
            Lihat detil
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>

    </div>
  );
}