import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  UserPlus, Building2, ShieldCheck, X, 
  RefreshCw, Lock, Edit3, CheckCircle2, Copy, Loader2 
} from 'lucide-react';
import { useGetCompaniesQuery } from '../../Redux/Company';

const UserModal = ({ isOpen, onClose, onAdd, initialData = null, isSubmitting }) => {
  const { DarkMode } = useSelector((state) => state.webState);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Company Admin',
    assignedCompany: '',
    password: '',
  });

  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const { data: companies } = useGetCompaniesQuery();

  const generatePassword = useCallback(() => {
    const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
    const newPass = Array.from({ length: 14 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    setFormData(prev => ({ ...prev, password: newPass }));
    setIsCopied(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          fullName: initialData.fullName || initialData.full_name || '',
          email: initialData.email || '',
          role: initialData.role === 'SYSTEM_ADMIN' ? 'System Admin' : 'Company Admin',
          assignedCompany: initialData.company_id || '',
          password: '', 
        });
      } else {
        setFormData({
          fullName: '',
          email: '',
          role: 'Company Admin',
          assignedCompany: '',
          password: '',
        });
        generatePassword();
      }
      setErrors({});
    }
  }, [isOpen, initialData, generatePassword]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role === 'System Admin' ? 'SYSTEM_ADMIN' : 'COMPANY_ADMIN',
      company_id: formData.role === 'System Admin' ? null : formData.assignedCompany,
    };

    if (!initialData) {
      payload.password = formData.password;
    }

    onAdd(payload);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formData.password);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  const theme = {
    card: DarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-100 shadow-2xl text-slate-900",
    input: DarkMode ? "bg-slate-900 border-slate-800 focus:border-blue-500" : "bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10",
    label: DarkMode ? "text-slate-500" : "text-slate-400"
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      {/* MAX-HEIGHT and FLEX-COL are key for scrolling */}
      <div className={`w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-[2.5rem] border transition-all animate-in zoom-in-95 duration-300 ${theme.card}`}>
        
        {/* FIXED HEADER */}
        <div className={`${DarkMode ? "bg-slate-900" : "bg-slate-50"} p-6 shrink-0 flex justify-between items-center border-b ${DarkMode ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
              {initialData ? <Edit3 size={22} /> : <UserPlus size={22} />}
            </div>
            <h2 className={`text-xl font-black tracking-tight ${DarkMode ? "text-slate-200" : "text-slate-800"}`}>
              {initialData ? 'Update Admin' : 'Register Admin'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          <section className="space-y-4">
            <label className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${theme.label}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 1. Personnel Details
            </label>
            <div className="grid gap-3">
              <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className={`w-full p-4 rounded-2xl outline-none border transition-all font-semibold ${theme.input}`} />
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className={`w-full p-4 rounded-2xl outline-none border transition-all font-semibold ${theme.input}`} />
            </div>
          </section>

          <section className="space-y-4">
            <label className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${theme.label}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 2. Access Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Company Admin', 'System Admin'].map((role) => (
                <button 
                  key={role} type="button" 
                  onClick={() => setFormData(p => ({ ...p, role }))} 
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold text-xs ${
                    formData.role === role 
                    ? 'border-blue-600 bg-blue-600/10 text-blue-500' 
                    : (DarkMode ? 'border-slate-800 bg-slate-900 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400')
                  }`}
                >
                  {role === 'System Admin' ? <ShieldCheck size={20} /> : <Building2 size={20} />}
                  {role}
                </button>
              ))}
            </div>
            
            {formData.role === 'Company Admin' && (
              <select name="assignedCompany" value={formData.assignedCompany} onChange={handleInputChange} className={`w-full p-4 rounded-2xl font-bold outline-none border transition-all ${theme.input}`}>
                <option value="">Select Organization</option>
                {companies?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </section>

          {/* PASSWORD: COMPLETELY HIDDEN IF initialData (EDIT MODE) */}
          {!initialData && (
            <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <label className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${theme.label}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 3. Security Credentials
              </label>
              <div className={`rounded-3xl p-6 border transition-all ${DarkMode ? "bg-black border-slate-800 shadow-inner" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                  <span className="font-mono text-xl tracking-widest text-blue-500 font-bold">{formData.password}</span>
                  <button type="button" onClick={generatePassword} className="p-2 text-slate-400 hover:text-blue-600 active:rotate-180 transition-transform duration-500">
                    <RefreshCw size={20} />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 italic uppercase">
                    <Lock size={12} /> Auto-Generated
                  </div>
                  <button type="button" onClick={handleCopy} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black transition-all ${isCopied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'}`}>
                    {isCopied ? <CheckCircle2 size={12}/> : <Copy size={12}/>}
                    {isCopied ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            </section>
          )}

        </form>

        {/* FIXED FOOTER */}
        <div className={`p-6 border-t shrink-0 flex gap-4 ${DarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}>
          <button onClick={onClose} disabled={isSubmitting} type="button" className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (initialData ? 'Update Profile' : 'Confirm Registration')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;