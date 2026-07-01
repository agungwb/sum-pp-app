// src/utils/currency.ts

export const formatRupiah = (num: number): string => {
    if (num === 0 || !num) return '-';
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0,
    }).format(num);
  };