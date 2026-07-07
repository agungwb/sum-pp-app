import React, { useState, useEffect } from 'react';

interface SafeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Hard-coded variasi string
const CONFIRMATION_PHRASES = [
  "Saya sadar ini mode edit",
  "Ya saya ingin mengubah data",
  "Buka akses untuk edit data",
  "Saya ingin mengedit data",
  "Konfirmasi mode edit",
  "Saya mau melakukan edit data",
  "Aktifkan mode edit"
];

export const SafeEditModal: React.FC<SafeEditModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [targetPhrase, setTargetPhrase] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  // State untuk Mount/Unmount & Animasi CSS Transisi
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Kasih jeda 10ms agar DOM ke-render duluan sebelum class opacity masuk
      const timer = setTimeout(() => setIsAnimating(true), 10);
      
      const randomIndex = Math.floor(Math.random() * CONFIRMATION_PHRASES.length);
      setTargetPhrase(CONFIRMATION_PHRASES[randomIndex]);
      setInputValue('');
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Tunggu durasi transisi (300ms) beres sebelum cabut elemen dari DOM (unmount)
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const isMatch = inputValue === targetPhrase;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isAnimating ? 'bg-slate-900/40 backdrop-blur-sm opacity-100' : 'bg-transparent opacity-0'
      }`}
    >
      {/* Modal Container */}
      <div 
        className={`bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-md w-full p-6 transition-all duration-300 ease-out transform ${
          isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          {/* Icon Badge */}
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          {/* Identik dengan styling teks di SUM-PP */}
          <h3 className="text-[16px] font-bold text-[#090f26]">Akses Mode Edit</h3>
        </div>
        
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Anda akan masuk ke mode manajemen. Kesalahan perubahan data pada mode ini dapat memengaruhi sistem inti. 
          Silakan ketik kalimat di bawah ini untuk melanjutkan:
        </p>

        {/* Target String Area */}
        <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-lg p-3 mb-4 flex items-center justify-center select-none">
          <span className="font-mono text-sm font-bold text-slate-700 tracking-tight text-center">
            {targetPhrase}
          </span>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ketik persis seperti di atas..."
          className="w-full px-3 py-2 text-sm text-[#090f26] border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-400 mb-8 font-mono placeholder:text-slate-400 transition-all"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
          
          {/* Tombol Batal - Merah Solid */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-500 border-2 border-transparent hover:bg-rose-600 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          
          {/* Tombol Konfirmasi */}
          <button
            onClick={() => {
              if (isMatch) onConfirm();
            }}
            disabled={!isMatch}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border-2 ${
              isMatch
                ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:border-amber-600 cursor-pointer shadow-md shadow-amber-200'
                : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            Masuk Mode Edit
          </button>
        </div>
      </div>
    </div>
  );
};