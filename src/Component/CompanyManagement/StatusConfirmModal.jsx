import React from 'react';
import { useSelector } from 'react-redux';
import { Power, AlertCircle } from 'lucide-react';

const StatusConfirmModal = ({ isOpen, onClose, onConfirm, companyName, currentStatus }) => {
  const { DarkMode } = useSelector((state) => state.webState);
  const isActivating = currentStatus !== 'Active';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className={`w-full max-w-sm p-8 rounded-3xl border text-center transition-all ${
        DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-2xl"
      }`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isActivating 
            ? (DarkMode ? "bg-emerald-500/10 text-emerald-500" : "bg-green-100 text-green-600")
            : (DarkMode ? "bg-amber-500/10 text-amber-500" : "bg-amber-100 text-amber-600")
        }`}>
          {isActivating ? <Power size={32} /> : <AlertCircle size={32} />}
        </div>

        <h3 className={`text-xl font-bold ${DarkMode ? "text-white" : "text-gray-900"}`}>
          {isActivating ? "Activate Company?" : "Deactivate Company?"}
        </h3>
        
        <p className={`mt-2 text-sm ${DarkMode ? "text-slate-400" : "text-gray-500"}`}>
          You are about to set <span className="font-bold underline">{companyName}</span> to 
          <span className={isActivating ? "text-emerald-500" : "text-amber-500"}> {isActivating ? "Active" : "Inactive"}</span>.
        </p>

        <div className="mt-8 flex flex-col gap-2">
          <button 
            onClick={onConfirm} 
            className={`w-full py-3 text-white rounded-xl font-bold transition-all ${
              isActivating ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            Confirm Change
          </button>
          <button onClick={onClose} className={`w-full py-3 font-semibold ${DarkMode ? "text-slate-500" : "text-gray-400"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusConfirmModal;