// src/components/ui/FeeWithTax.tsx
import React from 'react';
import { formatRupiah } from '../../utils/currency';

type FeeSize = 'small' | 'small-bold' | 'medium' | 'medium-bold' | 'large' | 'large-bold';

interface FeeWithTaxProps {
  base: number;
  tax?: number;
  size?: FeeSize; // 👈 Prop baru untuk mode
}

const sizeFee: Record<FeeSize, string> = {
    'small': 'text-[10px] font-normal',
    'small-bold': 'text-[10px] font-semibold',
    'medium': 'text-[12px] font-normal',
    'medium-bold': 'text-[12px] font-semibold',
    'large': 'text-[14px] font-medium',
    'large-bold': 'text-[14px] font-bold ',
  };

const sizeTax: Record<FeeSize, string> = {
    'small': 'text-[9px] font-normal',
    'small-bold': 'text-[9px] font-semibold',
    'medium': 'text-[10px] font-normal',
    'medium-bold': 'text-[10px] font-semibold',
    'large': 'text-[10px] font-medium',
    'large-bold': 'text-[10px] font-bold ',
  };

export default function FeeWithTax({ base, tax = 0, size = 'medium' }: FeeWithTaxProps) {
  return (
    <div className="flex flex-col items-end">
      <span className={`font-mono font-bold text-[12px] text-slate-800 ${sizeFee[size]}`}>
        {formatRupiah(base)}
      </span>
      
      {/* Defensive rendering: Hanya render tax jika ada nilainya dan di atas 0 */}
      {tax != null && tax > 0 && (
        <span className={`absolute fixed mt-4 text-blue-600 font-sans tracking-tight ${sizeTax[size]}`}>
          +tax {formatRupiah(tax)}
        </span>
      )}
    </div>
  );
}

// function FeeWithTax({ base, tax=0, isTotal = false }: { base: number; tax?: number; isTotal?: boolean }) {
//     const formatRupiah = (num: number) => {
//       if (num === 0) return '-';
//       return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
//     };
    
//     return (
//       <div className="flex flex-col items-end">
//         <span className={`font-mono ${isTotal ? 'font-bold text-[12px] text-slate-800' : 'text-[12px]'}`}>
//           {formatRupiah(base)}
//         </span>
//         {tax != null && tax > 0 && (
//           <span className="absolute mt-4 placeholder:text-[8px] text-rose-700 font-sans font-normal text-[9px] tracking-tight font-light">
//             +tax {formatRupiah(tax)}
//           </span>
//         )}
//       </div>
//     );
// }