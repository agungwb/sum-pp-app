export const ConfirmModal = ({ isOpen, onClose, onConfirm }: any) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
          <h3 className="text-md font-bold text-slate-800 mb-4">Konfirmasi</h3>
          <p className="text-xs text-slate-600 mb-6">Apakah data yang ingin disubmit sudah sesuai?</p>
          <div className="flex justify-center gap-4">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-200 rounded-md hover:bg-slate-200 transition-colors">Batal</button>
            <button type="button" onClick={onConfirm} className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors">Ya, Submit</button>
          </div>
        </div>
      </div>
    );
  };