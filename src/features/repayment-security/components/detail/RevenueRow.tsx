// =============================================================================
// REUSABLE HELPER COMPONENTS
// =============================================================================

import FeeWithTax from "../../../../components/ui/FeeWithTax";

// Helper: Teks Informasi Flat

// Helper: Baris Revenue Summary
export default function RevenueRow({ label, value, percentage, tax }: { label: string; value: number; percentage:number; tax: number }) {
    const formatRupiah = (numStr: string | number) => {
      if (numStr === 0 || numStr === '0') return '-';
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(typeof numStr === 'string' ? parseFloat(numStr || '0') : numStr);
    };
    
    return (
      <div className="flex justify-between items-end border-b border-slate-100 pb-2">
        <span className="text-[11px] flex-[5] font-semibold text-slate-500">{label}</span>
        <span className="text-[12px] flex-[3] font-bold font-mono text-slate-800">
          <FeeWithTax base={value} tax={tax} size='large'/>
        </span>
        <span className="text-[11px] flex-[1] font-semibold text-slate-500 text-right">{percentage} %</span>
      </div>
    );
  }