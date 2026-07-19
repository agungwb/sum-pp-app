/**
 * Mengubah teks menjadi Title Case (Kapital di setiap awal kata).
 * Mengembalikan "-" (atau string kosong "") jika input null/undefined/invalid.
 */
export const toTitleCase = (text?: string | null): string => {
    // 1. Early return: Tangani null, undefined, string kosong, atau bukan string
    if (!text || typeof text !== 'string') {
      return "-"; // Bisa diubah menjadi "" jika tidak ingin merender strip di UI
    }
  
    // 2. Proses pemotongan dan format
    return text
      .trim() // Menghapus spasi berlebih di awal dan akhir kalimat
      .split(/\s+/) // Memecah kalimat menjadi array kata, menangani spasi ganda dengan aman
      .map((word) => {
        // Pastikan kata tidak kosong
        if (!word) return "";
        
        // Ambil huruf pertama jadikan Kapital, sisanya jadikan huruf kecil
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
      })
      .join(" "); // Gabungkan kembali array menjadi satu kalimat dengan spasi
  };