const colSpanClasses: Record<string, string> = {
    "1": "col-span-1",
    "2": "col-span-2",
  };

export const Toggle = ({ label, checked, onChange, colSpan = "1", ...props }: any) => (
    <div className={`flex items-center justify-between p-3 rounded-md bg-white ${colSpanClasses[colSpan] || ""}`}>
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-amber-500' : 'bg-slate-300'}`} {...props} 
      >
        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
  
  