const gridRatioClasses: Record<string, string> = {
  "1:1": "grid-cols-[1fr_1fr]",
  "2:1": "grid-cols-[2fr_1fr]",
  "1:2": "grid-cols-[1fr_2fr]",
};


export const FormGroup = ({ title, children, colRatio="1:1" }: any) => (
    <div>
      {/* Warna dan ukuran judul grup disesuaikan menjadi normal dan tidak orange */}
      <h3 className="text-xs font-semibold text-slate-700 mb-4 border-b border-slate-100">{title}</h3>
      <div className={`grid ${gridRatioClasses[colRatio] || "grid-cols-2"} gap-3`}>
        {children}
      </div>
    </div>
  );