import React from 'react';

interface FormFooterProps {
  mode?: 'add' | 'edit';
  validationError?: string | null;
  submissionError?: string | null;
  isLoading?: boolean;
  handlePreSubmit?: (e?: React.FormEvent | React.MouseEvent<HTMLButtonElement> | any) => void;
  closePanel: () => void;      // Menjadi opsional
}

export default function FormFooter({
  mode = 'add',
  validationError = null, // Default null
  submissionError = null, // Default null
  isLoading = false,
  handlePreSubmit, // Default fungsi
  closePanel,           // Default fungsi
}: FormFooterProps) {
  
  // Menampilkan validationError terlebih dahulu, jika tidak ada baru submissionError
  const displayError = validationError || submissionError;

  return (
    <div className="sticky bottom-0 z-50 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      
      {/* Kontainer Error Message (Hanya muncul jika ada error) */}
      <div className="flex-1 min-w-0 pr-2">
        {displayError && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 w-fit max-w-full max-h-12 overflow-y-auto scrollbar-thin scrollbar-thumb-red-200 animate-fade-in">
            {/* Ubah span menjadi div agar bisa pakai flex-col untuk menumpuk error */}
            <div className="text-[10px] font-light text-red-600 flex flex-col gap-1 whitespace-pre-wrap break-words">
                
                {validationError && (<>
                  <div>⚠️ [Validation Error]</div>
                  <div>{validationError}</div>
                </>
                )}
                
                {submissionError && (<>
                  <div>⚠️ [Submission Error]</div>
                  <div>{submissionError}</div>
                </>
                )}
                
            </div>
            </div>
        )}
        </div>

      {/* Kontainer Tombol */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          type="button" 
          onClick={closePanel}
          className="px-4 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors h-8 flex items-center"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handlePreSubmit}
          disabled={isLoading}
          className="px-6 py-2 text-xs font-bold text-white bg-amber-600 rounded-md shadow hover:bg-amber-700 transition-colors disabled:opacity-50 h-8 flex items-center"
        >
          {isLoading ? 'Menyimpan...' : (mode === 'edit' ? 'Ubah' : 'Tambah')}
        </button>
      </div>

    </div>
  );
}