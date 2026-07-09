import { NumericInput } from "./NumericInput";

const colSpanClasses: Record<string, string> = {
  "1": "col-span-1",
  "2": "col-span-2",
};

export const NumberField = ({ label, hasError, value, onValueChange, colSpan = "1", isPercentage=false, ...props }: any) => (
  <div className={colSpanClasses[colSpan] || ""}>
    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
    
    {isPercentage?
      <div className="flex items-center justify-end gap-2">
        <div className="basis-4/5">
        <NumericInput value={value} onValueChange={onValueChange} hasError={hasError} {...props} />
        </div>
        
        <div className="basis-1/5">
          <div className="text-slate-400">%</div>
        </div>
      </div>
    :
      <NumericInput value={value} onValueChange={onValueChange} hasError={hasError} {...props} />
    }
  </div>
);