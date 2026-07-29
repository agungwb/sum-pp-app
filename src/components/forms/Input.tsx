import React from "react";

const colSpanClasses: Record<string, string> = {
  "1": "col-span-1",
  "2": "col-span-2",
};

// 1. Definisi Tipe Data Props
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hasError?: boolean;
  colSpan?: "1" | "2";
  inputType?: "text" | "email" | "number" | "alphanumeric" | "tel" | "password" | "date"; // Tambah varian date
}

export const Input = ({ 
  label='', 
  hasError, 
  colSpan = "1", 
  inputType = "text", 
  onChange,
  ...props 
}: InputProps) => {
  
  // 2. Styling Tailwind
  // Menambahkan sedikit padding kanan khusus (pr-3 atau pr-8) agar ikon kalender bawaan browser tidak menumpuk dengan teks
  const baseClass = "w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-2";
  const errorClass = hasError ? "border-red-500 bg-red-50" : "border-slate-200";
  const disabledClass = props.disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white text-slate-700";

  // 3. Pemetaan ke Atribut HTML Native 'type' dan 'inputMode' yang relevan
  let htmlType: string = inputType;
  if (inputType === "alphanumeric" || inputType === "tel") {
    htmlType = "text";
  }

  // Menampilkan keyboard angka otomatis di HP untuk tipe number dan tel
  const inputModeValue = inputType === "number" || inputType === "tel" ? "numeric" : undefined;

  // 4. Handler Validasi dan Penyaringan Karakter Real-time (On Change)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (inputType === "alphanumeric") {
      value = value.replace(/[^a-zA-Z0-9]/g, "");
      e.target.value = value;
    } 
    
    else if (inputType === "number") {
      value = value.replace(/[^0-9.]/g, "");
      e.target.value = value;
    }

    else if (inputType === "tel") {
      value = value.replace(/[^0-9+]/g, "");
      e.target.value = value;
    }

    // Untuk inputType === "date", HTML native secara otomatis mengontrol nilainya 
    // agar selalu berformat ISO "YYYY-MM-DD", sehingga tidak memerlukan regex tambahan.

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={colSpanClasses[colSpan] || ""}>
      {/* Label Komponen */}
      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
        {label}
      </label>
      
      {/* Input Element */}
      <input 
        type={htmlType}
        inputMode={inputModeValue}
        className={`${baseClass} ${errorClass} ${disabledClass}`} 
        onChange={handleInputChange}
        {...props} 
      />
    </div>
  );
};
