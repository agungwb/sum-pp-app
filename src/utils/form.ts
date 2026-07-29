// src/common/helpers/mapDtoToFormData.ts

/**
 * Memetakan object DTO dari Form menjadi FormData siap kirim ke NestJS
 * Fungsi ini sudah otomatis mendeteksi kolom file spesifik di aplikasi
 */
export const mapDtoToFormData = (dtoPayload: Record<string, any>): FormData => {
    const formData = new FormData();
  
    Object.keys(dtoPayload).forEach((key) => {
      const value = dtoPayload[key];
  
      // Abaikan jika null, undefined, atau string kosong
      if (value !== null && value !== undefined && value !== '') {
        
        // PEMETAAN OTOMATIS: Deteksi semua key yang mengandung kata 'Url', 'File', atau 'Document'
        // dan pastikan nilainya adalah object File mentah dari browser
        if ((key.toLowerCase().includes('url') || key.toLowerCase().includes('file')) && value instanceof File) {
          formData.append(key, value);
        } 
        else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        }
        else if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false');
        }
        else {
          formData.append(key, value);
        }
  
      }
    });
  
    return formData;
  };
  