import React from 'react';

const colSpanClasses: Record<string, string> = {
  "1": "col-span-1",
  "2": "col-span-2",
};

export const FileInput = ({ label, hasError, colSpan = "2", ...props }: any) => {
  const wrapperBaseClass = "pb-4 border-b-2 rounded-lg transition-colors";
  const wrapperErrorClass = hasError ? "border-red-500 bg-red-50" : "border-slate-200 bg-white";
  
  // Mengubah border-0 menjadi border tipis abu-abu (border-slate-300)
  // Background sedikit diterangkan (bg-slate-50) agar border lebih terlihat tegas dan clean
  const inputBaseClass = `
    w-full text-xs focus:outline-none 
    file:mr-4 file:py-2 file:px-4 
    file:rounded-lg file:border-1 file:border-slate-300 
    file:text-[10px] file:font-semibold 
    file:bg-slate-50 file:text-slate-700 
    hover:file:bg-slate-100 
    file:transition-all file:cursor-pointer
  `;
  
  // Handling disabled state, bordernya dibuat lebih pudar (border-slate-200)
  const disabledClass = props.disabled 
    ? "text-slate-400 cursor-not-allowed file:bg-slate-50 file:border-slate-200 file:text-slate-400 file:cursor-not-allowed hover:file:bg-slate-50" 
    : "text-slate-600 cursor-pointer";

  return (
    <div className={`${colSpanClasses[colSpan] || ""} ${wrapperBaseClass} ${wrapperErrorClass}`}>
      <label className="block text-[10px] font-semibold text-slate-600 mb-2">
        {label}
      </label>
      <input 
        type="file" 
        className={`${inputBaseClass} ${disabledClass}`} 
        {...props} 
      />
    </div>
  );
};