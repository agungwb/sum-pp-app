import React from "react";

const colSpanClasses: Record<string, string> = {
  "1": "col-span-1",
  "2": "col-span-2",
};

// 1. Definisikan warna tombol saat kondisi 'checked' aktif
const toggleColorClasses: Record<string, { label: string; activeBg: string }> = {
  normal: {
    label: "text-slate-700",
    activeBg: "bg-amber-500" // Warna default oranye/amber Anda saat ini
  },
  danger: {
    label: "text-red-600",
    activeBg: "bg-red-600"   // Warna merah saat aktif
  },
  warning: {
    label: "text-amber-800",
    activeBg: "bg-yellow-500" // Warna kuning/gold saat aktif
  }
};

export const Toggle = ({ 
  label, 
  checked, 
  onChange, 
  colSpan = "1", 
  mode = "normal", // Tambahkan properti warna dengan default 'normal'
  className = "",   // Terima className dari luar
  ...props      // Ambil sisa props untuk div terluar
}: any) => {
  const currentColor = toggleColorClasses[mode] || toggleColorClasses.normal;

  return (
    // 2. Pasang className dan restProps di div terluar supaya layouting seperti "mt-10" berfungsi
    <div 
      className={`flex items-center justify-between p-3 rounded-md bg-white ${colSpanClasses[colSpan] || ""} ${className}`}
      {...props}
    >
      {/* Warna label bisa menyesuaikan dengan tema variant jika diinginkan */}
      <span className={`text-xs font-semibold ${currentColor.label}`}>{label}</span>
      
      <button
        type="button"
        onClick={() => onChange(!checked)}
        // 3. Ubah bagian bg-amber-500 menjadi currentColor.activeBg yang dinamis
        className={`w-10 h-5 rounded-full transition-colors relative ${checked ? currentColor.activeBg : 'bg-slate-300'}`}
      >
        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
};
