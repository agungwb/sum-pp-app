// --- HELPER KOMPONEN TEXTAREA ---
export const TextArea = ({ label, hasError, colSpan = "1", ...props }: any) => {
    const colSpanClasses: Record<string, string> = { "1": "col-span-1", "2": "col-span-2" };
    const baseClass = "w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors min-h-[80px]";
    const errorClass = hasError ? "border-red-500 bg-red-50" : "border-slate-200";
    const disabledClass = props.disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white text-slate-700";
  
    return (
      <div className={colSpanClasses[colSpan] || ""}>
        <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
        <textarea className={`${baseClass} ${errorClass} ${disabledClass}`} {...props} />
      </div>
    );
  };
  // -----------------------------------