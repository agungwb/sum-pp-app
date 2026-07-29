import React from 'react';

interface FormHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function FormHeader({
  title = 'Form Title',
  subtitle = 'Form Subtitle',
}: FormHeaderProps) {
  return (
    <div className="shrink-0 border-b border-slate-200 px-5 py-4 bg-white flex items-center justify-between">
      <div>
        <h2 className="text-sm font-bold text-slate-800">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}