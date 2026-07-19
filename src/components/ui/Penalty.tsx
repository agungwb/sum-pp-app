import React from 'react';
import { formatRupiah } from '../../utils/currency';
import { Big } from 'big.js';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type PenaltyMode = 'normal' | 'ongoing' | 'settled';

interface PenaltyProps {
  penalty: number | string | Big;
  size?: Size;
  withRp?: boolean;
  mode?: PenaltyMode; // 👈 Mengganti isSettled dengan mode
}

const sizePenalty: Record<Size, string> = {
  'xs': 'text-[8px]',
  'sm': 'text-[9px]',
  'md': 'text-[11px]',
  'lg': 'text-[13px]',
  'xl': 'text-[15px]',
};

export default function Penalty({ 
  penalty, 
  size = 'md', 
  withRp = true, 
  mode = 'normal' // 👈 Default mode di-set ke 'normal'
}: PenaltyProps) {
  
  if (!penalty || Big(penalty).eq(0)) {
    return (
      <span className={`font-mono font-normal ${sizePenalty[size]}`}>
        -
      </span>
    );
  }

  // Fungsi helper untuk merender elemen sesuai mode
  const renderPenaltyAmount = () => {
    switch (mode) {
      case 'settled':
        return (
          <span className={`font-mono font-normal text-slate-800 ${sizePenalty[size]}`}>
            {formatRupiah(penalty, withRp)}
          </span>
        );
      case 'ongoing':
        return (
          <span className={`font-mono font-normal text-red-400 ${sizePenalty[size]}`}>
            {formatRupiah(penalty, withRp)}<sup className="ml-0.5">*</sup>
          </span>
        );
      case 'normal':
      default:
        // Style: Normal seperti ongoing, tanpa (*), warna merah (text-red-600)
        return (
          <span className={`font-mono font-normal text-red-600 ${sizePenalty[size]}`}>
            {formatRupiah(penalty, withRp)}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col items-end">
      {renderPenaltyAmount()}
    </div>
  );
}