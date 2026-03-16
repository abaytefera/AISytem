import React from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, companyName }) => {
  const { DarkMode } = useSelector((state) => state.webState);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className={`w-full max-w-sm p-8 rounded-3xl border text-center transition-all ${
        DarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-gray-200 shadow-2xl"
      }`}>
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className={`text-xl font-bold ${DarkMode ? "text-white" : "text-gray-900"}`}>Delete Company?</h3>
        <p className={`mt-2 text-sm ${DarkMode ? "text-slate-400" : "text-gray-500"}`}>
          You are about to remove <span className="font-bold text-rose-500">{companyName}</span>. 
          This is permanent.
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <button onClick={onConfirm} className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all">
            Confirm Delete
          </button>
          <button onClick={onClose} className={`w-full py-3 font-semibold ${DarkMode ? "text-slate-500" : "text-gray-400"}`}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;