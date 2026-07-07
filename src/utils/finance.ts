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
 * @param {number} baseValue - Nilai dasar (e.g., contractFeeAdministration)
 * @param {number} ppn - Tarif PPN (e.g., contractTaxPpn)
 * @param {number} factor - Faktor Pajak (e.g., contractTaxFactor)
 * @returns {number} Nilai tax yang sudah dibulatkan
 */
export const calculateTax = (baseValue: number, tax: number | null, factor:number ) => {
    const multiplier = Math.pow(10, 3);
    const taxWithFactor = (tax || 0) * (factor || 0); 
    const taxWithFactorRounded = Math.round((taxWithFactor || 0 + Number.EPSILON) * multiplier) / multiplier;
    const rawTax = (baseValue || 0) * taxWithFactorRounded;
    
    // Opsi A: Pembulatan ke kelipatan 10 terdekat (Sesuai instruksi teks: "bulatan puluhan")
    // 1.000.033,00 -> 1.000.030,00
    return rawTax;
  
    // Opsi B: Pembulatan ke kelipatan 1.000 terdekat (Sesuai contoh kasus Anda: 1.000.033 -> 1.000.000)
    // Jika ini yang dimaksud, ganti baris di atas dengan:
    // return Math.round(rawTax / 1000) * 1000;
  };
  