import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const RegisterModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { DarkMode } = useSelector((state) => state.webState);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("what")
    onSave({
      id: initialData?.id || Date.now(),
      name,
      email,
      status: initialData?.status || 'Active',
      usage: initialData?.usage || '0%'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border transition-all ${
        DarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-gray-100 text-gray-800"
      }`}>
        <h2 className="text-2xl font-bold mb-6">{initialData ? "Update Profile" : "Register Company"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase opacity-50 mb-2 block">Company Name</label>
            <input 
              value={name} onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/50 ${
                DarkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"
              }`}
              placeholder="e.g. Abyssinia Bank" required
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase opacity-50 mb-2 block">Email Address</label>
            <input 
              value={email} onChange={(e) => setEmail(e.target.value)}
              type="email"
              className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/50 ${
                DarkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"
              }`}
              placeholder="it@company.com" required
            />
          </div>
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-semibold opacity-60">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30">
              {initialData ? "Update" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;