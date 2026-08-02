import React, { useState, useEffect } from 'react';

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onValueChange: (val: number) => void;
  hasError?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({ 
  value, 
  onValueChange, 
  hasError, 
  className,
  disabled,
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState('');

  const formatToIndonesian = (val: number) => {
    if (val === 0 || !val) return '';
    const parts = val.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  };

  useEffect(() => {
    // 1. Ekstrak nilai asli dari displayValue saat ini
    const currentNumericString = displayValue.replace(/\./g, '').replace(/,/g, '.');
    const currentParsed = parseFloat(currentNumericString) || 0;

    // 2. Cegah penimpaan koma (,) saat sedang mengetik desimal.
    // HANYA update layar jika ada perubahan data asli dari luar komponen 
    // (misal: tombol reset diklik, atau data API selesai dimuat)
    if (currentParsed !== value) {
      setDisplayValue(formatToIndonesian(value));
    }
  }, [value]); // Menghapus displayValue dari depedency mencegah infinite loop

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    
    // Hanya perbolehkan angka dan koma
    raw = raw.replace(/[^0-9,]/g, '');
    
    // Cegah koma berlebih
    const parts = raw.split(',');
    if (parts.length > 2) {
      raw = parts[0] + ',' + parts.slice(1).join('');
    }

    // [PERBAIKAN] Auto-format titik ribuan secara real-time saat user mengetik
    const finalParts = raw.split(',');
    finalParts[0] = finalParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formattedRaw = finalParts.join(',');

    setDisplayValue(formattedRaw);

    if (formattedRaw === '') {
      onValueChange(0);
      return;
    }

    // Ubah ke format standard javascript number saat dikembalikan ke Parent
    const numericString = formattedRaw.replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(numericString);
    onValueChange(isNaN(parsed) ? 0 : parsed);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Saat blur, rapikan input jika ada koma gantung (misal: "1.000," menjadi "1.000")
    setDisplayValue(formatToIndonesian(value));
    
    // Jangan lupa teruskan event onBlur bawaan jika dikirim dari parent
    if (props.onBlur) props.onBlur(e); 
  };

  const baseClass = "w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors";
  const errorClass = hasError ? "border-red-500 bg-red-50" : "border-slate-200";
  const disabledClass = disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white text-slate-700";

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      className={`${baseClass} ${errorClass} ${disabledClass} ${className || ''}`}
      {...props}
    />
  );
};