import { Big } from "big.js";

/**
 * Mengubah nilai persentase dari Frontend (misal: 2 untuk 2%) 
 * menjadi nilai desimal database (misal: 0.02).
 * * @param percentageValue Nilai dari frontend (string atau number)
 * @returns Nilai desimal untuk database (number atau null)
 */
export function toDatabasePercentage(percentageValue: number | string | null | undefined): number | undefined {
    if (percentageValue === null || percentageValue === undefined || percentageValue === '') {
      return undefined;
    }
  
    const parsed = typeof percentageValue === 'string' ? parseFloat(percentageValue) : percentageValue;
    
    if (isNaN(parsed)) {
      return undefined;
    }
  
    // Menggunakan toFixed dan parseFloat untuk menghindari bug floating-point JavaScript
    return parseFloat((parsed / 100).toFixed(6));
  }
  
  /**
   * Mengubah nilai desimal dari Database (misal: 0.02)
   * menjadi bentuk persentase utuh untuk Frontend (misal: 2).
   * * @param dbValue Nilai desimal dari database
   * @returns Nilai persentase utuh untuk frontend (number atau null)
   */
  export function toFrontendPercentage(dbValue: number | string | null | undefined): number | undefined {
    if (dbValue === null || dbValue === undefined || dbValue === '') {
      return undefined;
    }
  
    const parsed = typeof dbValue === 'string' ? parseFloat(dbValue) : dbValue;
  
    if (isNaN(parsed)) {
      return undefined;
    }
  
    // Menggunakan toFixed untuk menjaga konsistensi presisi desimal saat dikalikan 100
    return parseFloat((parsed * 100).toFixed(4));
  }

  export function toFrontendPercentageStr(dbValue: number | string | null | undefined): string | undefined {
    if (dbValue === null || dbValue === undefined || dbValue === '') {
      return undefined;
    }
  
    const parsed = typeof dbValue === 'string' ? parseFloat(dbValue) : dbValue;
  
    if (isNaN(parsed)) {
      return undefined;
    }
  
    // Menggunakan toFixed untuk menjaga konsistensi presisi desimal saat dikalikan 100
    return (parsed * 100).toFixed(2);
  }

  /**
   * Menghitung tax dan melakukan pembulatan
   * @param {number | string} baseValue - Nilai dasar (e.g., contractFeeAdministration)
   * @param {number | string | null} tax - Tarif PPN (e.g., contractTaxPpn)
   * @param {number | string} factor - Faktor Pajak (e.g., contractTaxFactor)
   * @returns {string | null} Nilai tax yang sudah dibulatkan, atau null jika input tidak valid
   */

  export const calculateTax = (
    baseValue: number | string | Big | null,
    tax: number | string | Big | null,
    factor: number | string | Big | null
  ): string | null => {
    try {
      // 1. Handling Null, Undefined, atau String Kosong
      // Kita buat helper untuk mendeteksi nilai kosong, tapi angka 0 tetap diizinkan
      const isInvalid = (val: any) => val === null || val === undefined || val === '';
      
      if (isInvalid(baseValue) || isInvalid(tax) || isInvalid(factor)) {
        return null; // Silakan ganti dengan '-' jika itu lazim di UI Anda
      }
  
      // 2. Konversi input ke Big.js instance
      // Jika input berupa NaN atau string non-angka yang lolos pengecekan di atas,
      // Big.js akan melempar error dan masuk ke blok catch.
      const bBaseValue = new Big(baseValue!);
      const bTax = new Big(tax!); 
      const bFactor = new Big(factor!);
  
      // 3. Hitung taxWithFactor (tax * factor)
      const taxWithFactor = bTax.times(bFactor);
  
      // 4. Pembulatan 3 angka di belakang koma 
      const taxWithFactorRounded = taxWithFactor.round(3, 1);
  
      // 5. Hitung rawTax (baseValue * taxWithFactorRounded)
      const rawTax = bBaseValue.times(taxWithFactorRounded);
  
      // 6. Output adalah string dengan round(2)
      return rawTax.round(2).toString();
  
    } catch (error) {
      // 7. Penanganan untuk input NaN atau nilai yang tidak valid bagi Big.js
      return null;
    }
  };
  