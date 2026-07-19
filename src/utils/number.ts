import { Big } from 'big.js';

/**
 * Mengonversi nilai mentah (string/number) menjadi instance Big secara aman.
 * Jika input tidak valid atau kosong, akan mengembalikan Big("0").
 * 
 * @param value - Nilai mentah yang ingin dikonversi
 * @returns Instance dari Big.js
 */
export function toSafeBig(value: string | number | null | undefined): Big {
  if (value === null || value === undefined || value === '') {
    return new Big('0');
  }

  try {
    return new Big(value);
  } catch (error) {
    // Log error opsional jika ingin memantau input yang rusak di development
    // console.warn(`Invalid Big number format: "${value}". Defaulting to Big("0").`, error);
    return new Big('0');
  }
}
