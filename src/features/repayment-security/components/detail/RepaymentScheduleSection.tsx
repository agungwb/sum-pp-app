import React from 'react';
import RepaymentScheduleCreateWrapper from '../../../repayment-schedule/components/form/RepaymentScheduleCreateWrapper';
import RepaymentScheduleEditWrapper from '../../../repayment-schedule/components/RepaymentScheduleEditWrapper';
import FeeWithTax from '../../../../components/ui/FeeWithTax';

interface RepaymentScheduleTableProps {
  schedules: any[];
  isEditMode: boolean;
  openPanel: (title: string, component: React.ReactNode) => void;
  repaymentId: string;
  formatRupiah: (numStr: string | number) => string;
  formatCompactDate: (dateStr: string) => string;
}

export default function RepaymentScheduleSection({
  schedules,
  isEditMode,
  openPanel,
  repaymentId,
  formatRupiah,
  formatCompactDate
}: RepaymentScheduleTableProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
        
    {/* ROW 1: Tabel Upfront Fee (Angsuran 0) */}
    <div className="p-5 border-b-2 border-slate-200">
      <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b-2 border-slate-100 pb-2">Jadwal Pembayaran: Biaya Di Muka (Upfront)</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 text-[9px] text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <th className="py-2.5 px-3 font-bold text-center">Informasi</th>
              <th className="py-2.5 px-3 font-bold text-left">Jatuh Tempo</th>
              <th className="py-2.5 px-3 font-bold text-right">Biaya Admin</th>
              <th className="py-2.5 px-3 font-bold text-right">Provisi</th>
              <th className="py-2.5 px-3 font-bold text-right">Biaya Platform</th>
              <th className="py-2.5 px-3 font-bold text-right">Biaya Service</th>
              <th className="py-2.5 px-3 font-bold text-right">Biaya Total</th>
              <th className="py-2.5 px-3 font-bold text-right">Total + Pajak</th>
              <th className="py-2.5 px-3 font-bold text-left">Status</th>
              {isEditMode && (
                <th className="py-2.5 px-3 font-bold text-left">Edit</th> 
              )}
            </tr>
          </thead>
          <tbody className="text-[11px] font-medium text-slate-700">
            {!upfrontFee ? (
              <tr>
                <td colSpan={isEditMode ? 10 : 9} className="py-4 text-center italic text-slate-400">
                  -- Data tidak tersedia --
                </td>
              </tr>
            ) : (
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 text-left text-slate-800 font-bold align-top">
                  <Link 
                          to={`${upfrontFee.id}`}
                          className="flex items-center gap-1.5 text-[12px] font-bold bg-white text-slate-500 px-2.5 hover:bg-slate-50 hover:text-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
                      >
                          Upfront Fee
                          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                      </Link>
                </td>
                <td className="py-3 px-3 align-top">{formatDate(upfrontFee.dueDate)}</td>
                <td className="py-3 px-3 text-right align-top relative">
                  <FeeWithTax base={upfrontFee.admin} tax={upfrontFee.adminTax} />
                </td>
                <td className="py-3 px-3 text-right align-top relative">
                  <FeeWithTax base={upfrontFee.provision} tax={upfrontFee.provisionTax} />
                </td>
                <td className="py-3 px-3 text-right align-top relative">
                  <FeeWithTax base={upfrontFee.platform} tax={upfrontFee.platformTax} />
                </td>
                <td className="py-3 px-3 text-right align-top relative">
                  <FeeWithTax base={upfrontFee.servicing} tax={upfrontFee.servicingTax} />
                </td>
                <td className="py-3 px-3 text-right align-top relative">
                  <FeeWithTax base={upfrontFee.baseTotal} tax={upfrontFee.taxTotal} isTotal={true} />
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-xs text-slate-800 align-top">
                  {formatRupiah(upfrontFee.grandTotal)}
                </td>
                <td className="py-3 px-3 text-left align-top relative">
                  <StatusBadge status={upfrontFee.status} />
                </td>
                {isEditMode && (
                  <td className="py-3 px-3 text-left align-top">
                      <button className="text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1 py-1 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                      </button>
                  </td>)}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* ROW 2: Tabel Jadwal Bulanan */}
    <div className="p-5">
      <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b-2 border-slate-100 pb-2">Jadwal Pembayaran: Cicilan Bulanan</h3>
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
            <tr className="bg-slate-50 text-[9px] text-slate-500 uppercase tracking-wider border-y border-slate-200">
            {/* Kolom 1 Besar & Padat */}
            <th className="py-2.5 px-3 font-bold text-center">Informasi</th>
            <th className="py-2.5 px-3 font-bold text-left">Jatuh Tempo</th>
            
            {/* Kolom Eksisting Tengah */}
            <th className="py-2.5 px-3 font-bold text-right">Cicilan Sinking Fund</th>
            <th className="py-2.5 px-3 font-bold text-right">{data.securityType === 'Sukuk' ? 'Kupon' : 'Dividen'}</th>
            <th className="py-2.5 px-3 font-bold text-right">Biaya Pemantauan</th>
            <th className="py-2.5 px-3 font-bold text-right">Total</th>
            <th className="py-2.5 px-3 font-bold text-right">Total + Pajak</th>
            
            {/* Kolom Jumlah Dibayarkan */}
            <th className="py-2.5 px-3 font-bold text-center">Status</th>
            {isEditMode && (
                <th className="py-2.5 px-3 font-bold text-left">Edit</th> 
              )}
            </tr>
        </thead>
        <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-100">
            {!installmentsFee || installmentsFee.length === 0 ? (
              <tr>
                <td colSpan={isEditMode ? 9 : 8} className="py-4 text-center italic text-slate-400">
                  -- Data tidak tersedia --
                </td>
              </tr>
            ) : (
              installmentsFee.map((sch) => {
              const isUpfront = sch.month === 0;
              const titleLabel = isUpfront ? 'UPFRONT FEE' : `Tagihan ${sch.month}`;


              return (
                  <tr key={sch.month} className="hover:bg-slate-50/80 transition-colors align-top">
                  
                  {/* KOLOM 1: INFORMASI PEMBAYARAN */}
                  <td className="py-3 px-3 text-left">
                  
                      <Link 
                          to={`schedules/${sch.id}`}
                          className="flex items-center gap-1.5 text-[12px] font-bold bg-white text-slate-500 px-2.5 hover:bg-slate-50 hover:text-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer"
                      >
                          {titleLabel}
                          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                      </Link>
                  </td>
                  <td className="py-3 px-3 align-top">{formatDate(upfrontFee.dueDate)}</td>
                  
                  {/* KOLOM EKSISTING */}
                  <td className="py-3 px-3 text-right font-mono">{formatRupiah(sch.sf)}</td>
                  <td className="py-3 px-3 text-right font-mono">{formatRupiah(sch.yield)}</td>
                  <td className="py-3 px-3 text-right relative">
                      <FeeWithTax base={sch.monitoring} tax={sch.taxMonitoring} />
                  </td>
                  <td className="py-3 px-3 text-right relative">
                      <FeeWithTax base={sch.baseTotal} tax={sch.taxTotal} />
                  </td>
                  
                  {/* KOLOM TOTAL + PAJAK */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-xs text-slate-800">
                      {formatRupiah(sch.grandTotal)}
                  </td>

                  {/* KOLOM STATUS */}
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                      <div className="flex items-center justify-center gap-4">
                          <StatusBadge status={sch.status} />
                      </div>
                  </td>
                  {isEditMode && (
                  <td className="py-3 px-3 text-left align-top">
                      <button 
                      onClick={() => openPanel(<RepaymentScheduleEditWrapper scheduleId={sch.id} />)}
                      className="text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1 py-1 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                      </button>
                  </td>)}
                  </tr>
              );
              })
            )}
        </tbody>
        </table>
      </div>
    </div>

    {/* ROW 3: Buat Jadwal Pembayaran Baru (Khusus Edit Mode) */}
    {isEditMode && (
      <div className="p-5 border-t-2 border-slate-200">
        <div className="p-5 border-t-2 border-slate-200">
          <button
            type="button"
            onClick={() => openPanel(<RepaymentScheduleCreateWrapper />)}
            className="flex items-center justify-center w-full py-4 border-2 border-dashed border-amber-300 bg-amber-50/50 text-amber-700 rounded-xl hover:bg-amber-100 hover:border-amber-400 transition-all group focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <div className="flex items-center gap-2">
              <div className="bg-amber-200/60 p-1.5 rounded-full group-hover:bg-amber-300 transition-colors">
                <svg className="w-4 h-4 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span className="text-[11px] font-bold tracking-wider">Buat Tagihan Baru</span>
            </div>
          </button>
        </div>
      </div>
    )}

  </div>
  );
}