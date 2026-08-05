import React, { useState, useEffect } from 'react';

// Mendefinisikan interface props agar tipe datanya jelas
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode?: 'add' | 'edit' | 'delete'; // Menambahkan prop mode (opsional, default 'add')
}

// Diletakkan di luar komponen agar tidak dirender ulang terus menerus
const DELETE_CONFIRMATION_PHRASES = [
  "Ya saya mau menghapus data",
  "Saya sadar akan menghapus data",
  "Saya setuju untuk menghapus data",
  "Ya hapus data ini",
  "Konfirmasi hapus data"
];

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  mode = 'add' 
}) => {
  const [targetPhrase, setTargetPhrase] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Memilih kalimat acak dan mereset input saat modal delete dibuka
  useEffect(() => {
    if (isOpen && mode === 'delete') {
      const randomIndex = Math.floor(Math.random() * DELETE_CONFIRMATION_PHRASES.length);
      setTargetPhrase(DELETE_CONFIRMATION_PHRASES[randomIndex]);
      setInputValue('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // Menentukan teks judul, deskripsi, dan teks tombol berdasarkan mode
  let titleText = 'Konfirmasi Tambah Data';
  let descriptionText = 'Apakah data yang ingin ditambahkan sudah sesuai?';
  let confirmButtonText = 'Ya, Tambah';

  if (mode === 'edit') {
    titleText = 'Konfirmasi Ubah Data';
    descriptionText = 'Apakah perubahan data sudah sesuai?';
    confirmButtonText = 'Ya, Ubah';
  } else if (mode === 'delete') {
    titleText = 'Konfirmasi Hapus Data';
    descriptionText = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.';
    confirmButtonText = 'Hapus';
  }

  // Validasi Disable
  const isMatch = inputValue === targetPhrase;
  const isConfirmDisabled = mode === 'delete' ? !isMatch : false;

  // Mengatur class warna tombol konfirmasi
  let confirmButtonClass = '';
  if (mode === 'delete') {
    if (isConfirmDisabled) {
      // 2. Style disabled: background & border abu-abu, text redup
      confirmButtonClass = 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed';
    } else {
      // Style aktif delete: merah
      confirmButtonClass = 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 border-transparent text-white';
    }
  } else {
    // Style bawaan/lainnya: amber
    confirmButtonClass = 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 border-transparent text-white'; 
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      {/* 1. Kembalikan ke ukuran w-96 sesuai original */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center animate-scale-up">
        
        <h3 className={`text-md font-bold mb-2 ${mode === 'delete' ? 'text-rose-700' : 'text-slate-800'}`}>
          {titleText}
        </h3>
        
        <p className="text-xs text-slate-600 mb-4 px-2 leading-relaxed">
          {descriptionText}
        </p>

        {/* Hanya muncul jika mode === 'delete' */}
        {mode === 'delete' && (
          <div className="mb-5 text-left px-6">
            {/* 3. Boks target diperkecil padding (p-1.5) dan teks (text-[10px]) */}
            <div className="bg-rose-50 border border-rose-200 border-dashed rounded p-1.5 mb-2 flex items-center justify-center select-none">
              <span className="font-mono text-[12px] font-bold text-rose-700 tracking-tight text-center">
                {targetPhrase}
              </span>
            </div>
            
            {/* 3. Input form diperkecil padding (py-1.5 px-2) dan teks (text-[11px]) */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ketik persis seperti di atas..."
              className="w-full px-2 py-1.5 text-[12px] text-[#090f26] border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 font-mono placeholder:text-slate-400 transition-all"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        )}
        
        <div className="flex justify-center gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={() => {
              if (!isConfirmDisabled) onConfirm();
            }} 
            disabled={isConfirmDisabled}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors border focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm ${confirmButtonClass}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};