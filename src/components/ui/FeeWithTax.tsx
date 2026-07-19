// src/components/ui/FeeWithTax.tsx
import React from 'react';
// Pastikan import Big jika tipenya digunakan
// import Big from 'big.js'; 
import { formatRupiah } from '../../utils/currency';

type FeeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type FeeWeight = 'light' | 'normal' | 'semibold' | 'bold' | 'extrabold';
type FeeColor = 'black' | 'green' | 'blue' | 'red' | 'yellow'; // 👈 Tipe baru untuk warna

interface FeeWithTaxProps {
  base: number | string | Big;
  tax?: number | string | Big;
  size?: FeeSize; 
  weight?: FeeWeight;
  color?: FeeColor; // 👈 Prop baru untuk menentukan warna
  withRp?: boolean;
}

const sizeFee: Record<FeeSize, string> = {
  'xs': 'text-[8px]',
  'sm': 'text-[10px]',
  'md': 'text-[12px]',
  'lg': 'text-[14px]',
  'xl': 'text-[16px]',
};

const sizeTax: Record<FeeSize, string> = {
  'xs': 'text-[8px] font-light',
  'sm': 'text-[9px] font-normal',
  'md': 'text-[10px] font-normal',
  'lg': 'text-[10px] font-medium',
  'xl': 'text-[11px] font-medium',
};

const sizeWeight: Record<FeeWeight, string> = {
  'light': 'font-light',
  'normal': 'font-normal',
  'semibold': 'font-semibold',
  'bold': 'font-bold',
  'extrabold': 'font-extrabold',
};

// 👇 Mapping warna untuk nilai base (utama)
const colorBaseMap: Record<FeeColor, string> = {
  black: 'text-slate-800',
  green: 'text-emerald-700', 
  blue: 'text-blue-700',
  red: 'text-rose-700',
  yellow: 'text-amber-600',
};

// 👇 Mapping warna untuk nilai pajak (tax)
const colorTaxMap: Record<FeeColor, string> = {
  black: 'text-gray-500',
  green: 'text-emerald-500',
  blue: 'text-blue-500',
  red: 'text-rose-500',
  yellow: 'text-amber-500',
};

export default function FeeWithTax({ 
  base, 
  tax = 0, 
  size = 'md', 
  weight = 'normal', 
  color = 'black', // 👈 Set default warna ke 'black'
  withRp = true
}: FeeWithTaxProps) {
  return (
    <div className="flex flex-col items-end">
      {/* 👈 Implementasi mapping colorBaseMap pada class base */}
      <span className={`font-mono ${colorBaseMap[color]} ${sizeFee[size]} ${sizeWeight[weight]}`}>
        {formatRupiah(base, withRp)}
      </span>
      
      {/* Defensive rendering: Hanya render tax jika ada nilainya dan di atas 0 */}
      {tax != null && tax > 0 && (
        // 👈 Implementasi mapping colorTaxMap pada class tax
        <span className={`absolute fixed mt-4 ${colorTaxMap[color]} font-sans tracking-tight ${sizeTax[size]}`}>
          +ppn {formatRupiah(tax, withRp)}
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