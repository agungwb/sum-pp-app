import React from "react";

const gridRatioClasses: Record<string, string> = {
  "1:1": "grid-cols-[1fr_1fr]",
  "2:1": "grid-cols-[2fr_1fr]",
  "1:2": "grid-cols-[1fr_2fr]",
};

const colorClasses: Record<string, { text: string; border: string }> = {
  normal: {
    text: "text-slate-700",
    border: "border-slate-100"
  },
  danger: {
    text: "text-red-600",
    border: "border-red-200"
  },
  warning: {
    text: "text-amber-600",
    border: "border-amber-200"
  }
};

// Menggunakan ...restProps untuk menampung sisa properti lainnya (termasuk className, id, onClick, dll)
export const FormGroup = ({ title, children, colRatio = "1:1", color = "normal", ...props }: any) => {
  const currentColor = colorClasses[color] || colorClasses.normal;

  return (
    // Mengalirkan semua sisa properti ke div terluar
    <div {...props}>
      <h3 className={`text-xs font-semibold ${currentColor.text} mb-4 border-b ${currentColor.border}`}>
        {title}
      </h3>
      <div className={`grid ${gridRatioClasses[colRatio] || "grid-cols-2"} gap-3`}>
        {children}
      </div>
    </div>
  );
};
