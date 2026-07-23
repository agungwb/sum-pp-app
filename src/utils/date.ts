import { differenceInDays, startOfDay, isValid } from 'date-fns';

export const formatDateForInput = (dateInput: any): string => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  // Memastikan objek date valid sebelum diformat
  if (isNaN(d.getTime())) return ''; 
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`; // Menghasilkan format YYYY-MM-DD secara aman
};

export const formatDate = (dateStr?: string | null) => {
  // 1. Handle null, undefined, atau empty string ("")
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  // 2. Handle jika string yang dikirim bukan format tanggal yang valid (mencegah "Invalid Date")
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat('id-ID', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).format(date);
};

export const formatCompactDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: '2-digit' 
  }).format(date);
};

export const toDate = (dateInput: any): Date | null => {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  
  if (isNaN(d.getTime())) return null;
  
  return d;
};

/**
 * Menghitung selisih hari antara dua tanggal (dateLeft - dateRight).
 * Jika input null, otomatis diganti menjadi hari ini.
 * Jika format tanggal tidak valid, mengembalikan null.
 * 
 * @param dateLeft - Tanggal pertama (String, Date, atau Null)
 * @param dateRight - Tanggal kedua (String, Date, atau Null)
 * @returns number | null - Jumlah selisih hari, atau null jika tanggal tidak valid
 */
export const calculateDays = (
  dateLeft: string | Date | null,
  dateRight: string | Date | null
): number | null => {
  // 1. Jika null, jalankan fallback ke hari ini
  const parsedLeft = dateLeft ? new Date(dateLeft) : new Date();
  const parsedRight = dateRight ? new Date(dateRight) : new Date();

  // 2. Validasi apakah tanggalnya valid menggunakan isValid dari date-fns
  // (Fungsi isValid otomatis mengecek isNaN di balik layar)
  if (!isValid(parsedLeft) || !isValid(parsedRight)) {
    return null; 
  }

  // 3. Jika valid, hitung selisih harinya
  return differenceInDays(
    startOfDay(parsedLeft),
    startOfDay(parsedRight)
  );
};
