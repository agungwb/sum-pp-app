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