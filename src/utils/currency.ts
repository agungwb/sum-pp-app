// src/utils/currency.ts

import { Big } from 'big.js'; // Pastikan import Big jika Anda menggunakannya sebagai tipe

// Jika Anda menggunakan library Big.js, pastikan untuk mengimport tipenya
// import Big from 'big.js'; 

export const formatRupiah = (
  value: number | string | Big | null, 
  withRp: boolean = true,
  fallbackReturn: 'dash' | 'zero' = 'dash' // 👈 Prop baru ditambahkan di sini dengan default 'dash'
): string => {
  // console.log('[formatRupiah] value : ', value);

  // Menentukan nilai yang akan dikembalikan jika error / data kosong
  const fallbackValue = fallbackReturn === 'zero' ? '0' : '-';

  // 1. Early return untuk data kosong (null, undefined, string kosong)
  // Menghindari null terkonversi menjadi 0 jika langsung dipaksa Number(null)
  if (value === null || value === undefined || value === '') {
    return fallbackValue;
  }

  // 2. Konversi ke tipe Number dengan aman
  // Menggunakan .toString() menjamin objek Big.js diubah menjadi string angka dulu,
  // dan ini juga berfungsi sempurna untuk input yang sudah berupa string atau number.
  const num = Number(value.toString());

  // 3. Langkah Preventif: Jika input bukan angka yang valid (misalnya huruf atau format salah)
  if (isNaN(num)) return fallbackValue;
  
  // 4. Format menggunakan Intl.NumberFormat
  return new Intl.NumberFormat('id-ID', { 
    style: withRp ? 'currency' : 'decimal', 
    currency: 'IDR', // Hanya berefek jika style-nya 'currency'
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0,
  }).format(num);
};


// Pastikan import Big sudah ada jika menggunakan tipe Big.js
// import Big from 'big.js';

export const formatPercentage = (
  value: number | string | Big | null,
  fallbackReturn: 'dash' | 'zero' = 'dash' // 👈 Prop baru ditambahkan di sini
): string => {
  // Menentukan nilai yang dikembalikan jika data kosong atau tidak valid
  // Catatan: Anda bisa mengganti '0' menjadi '0%' jika ingin tetap ada simbol persen saat nilainya nol.
  const fallbackValue = fallbackReturn === 'zero' ? '0%' : '-';

  // 1. Early return untuk data kosong (null, undefined, string kosong)
  if (value === null || value === undefined || value === '') {
    return fallbackValue;
  }

  // 2. Ekstrak nilai secara aman (menjamin objek Big.js/string/number terbaca) 
  // lalu konversi ke Number
  const num = Number(value.toString());

  // 3. Langkah Preventif: Jika nilai adalah 0 (termasuk Big(0)) atau input bukan angka valid (NaN)
  // Berdasarkan kode Anda sebelumnya, 0 dianggap sebagai '-' (sekarang menjadi fallbackValue)
  if (num === 0 || isNaN(num)) {
    return fallbackValue;
  }

  // 4. Format menjadi persentase
  return new Intl.NumberFormat('id-ID', { 
    style: 'percent', // 👈 Otomatis mengalikan dengan 100 dan menambah simbol '%'
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2,
  }).format(num);
};
   // Formatters
// export const formatRupiah = (numStr: string | number) => {
//     if (numStr === 0) return '-';
//     return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(typeof numStr === 'string' ? parseFloat(numStr || '0') : numStr);
//   };

