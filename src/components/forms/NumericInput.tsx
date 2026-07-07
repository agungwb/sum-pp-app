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

  const formatNumber = (val: number) => {
    if (val === 0 || !val) return '';
    let parts = val.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  };

  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    // Hanya perbolehkan angka dan koma
    raw = raw.replace(/[^0-9,]/g, '');
    
    // Cegah koma berlebih
    const parts = raw.split(',');
    if (parts.length > 2) {
      raw = parts[0] + ',' + parts.slice(1).join('');
    }

    setDisplayValue(raw);

    if (raw === '') {
      onValueChange(0);
      return;
    }

    // Ubah ke format standard javascript number saat dikembalikan ke Parent
    const numericString = raw.replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(numericString);
    onValueChange(isNaN(parsed) ? 0 : parsed);
  };

  const handleBlur = () => {
    setDisplayValue(formatNumber(value));
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