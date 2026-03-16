import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { 
  useGetCompaniesQuery, 
  useRegisterCompanyMutation, 
  useUpdateCompanyMutation, 
  useDeleteCompanyMutation,
  useToggleCompanyStatusMutation 
} from '../Redux/Company';

import { Edit3, Trash2, Building2, Power, PowerOff, ShieldCheck, ShieldAlert, Menu, X, Loader2 } from 'lucide-react';

// Components

import Sidebar from '../Component/SideBar';
import Header from '../Component/header';
import RegisterModal from '../Component/CompanyManagement/RegisterModal';
import DeleteConfirmModal from '../Component/CompanyManagement/DeleteConfirmModal';
import StatusConfirmModal from '../Component/CompanyManagement/StatusConfirmModal';

const CompanyManagement = () => {
  const { DarkMode } = useSelector((state) => state.webState);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- API HOOKS ---
  const { data: companies = [], isLoading: isFetching } = useGetCompaniesQuery();
  const [registerCompany] = useRegisterCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();
  const [toggleStatus] = useToggleCompanyStatusMutation();

  // --- MODAL STATES ---
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // --- ACTION HANDLERS ---
  const handleSave = async (data) => {
    const action = selectedCompany 
      ? updateCompany({ id: selectedCompany.id, ...data }).unwrap()
      : registerCompany({name:data.name, email:data.email}).unwrap();

    toast.promise(action, {
      loading: selectedCompany ? 'Updating organization...' : 'Registering organization...',
      success: <b>{selectedCompany ? 'Profile Updated' : 'Company Registered'}</b>,
      error: <b>Action failed. Please try again.</b>,
    }, {
      style: {
        borderRadius: '15px',
        background: DarkMode ? '#0f172a' : '#fff',
        color: DarkMode ? '#fff' : '#333',
        border: DarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
      },
    });

    try {
      await action;
      closeAllModals();
    } catch (err) {}
  };

  const confirmStatusChange = async () => {
    const newStatus = selectedCompany.status === 'Active' ? 'Inactive' : 'Active';
    const action = toggleStatus({ ...selectedCompany, status: newStatus }).unwrap();

    toast.promise(action, {
      loading: `Switching to ${newStatus}...`,
      success: <b>Status changed to {newStatus}</b>,
      error: <b>Failed to update status.</b>,
    }, {
      style: {
        borderRadius: '15px',
        background: DarkMode ? '#0f172a' : '#fff',
        color: DarkMode ? '#fff' : '#333',
      },
    });

    try {
      await action;
      closeAllModals();
    } catch (err) {}
  };

  const confirmDelete = async () => {
    const action = deleteCompany(selectedCompany.id).unwrap();

    toast.promise(action, {
      loading: 'Deleting organization...',
      success: <b>Organization removed.</b>,
    }, {
      style: {
        borderRadius: '15px',
        background: DarkMode ? '#0f172a' : '#fff',
        color: DarkMode ? '#fff' : '#333',
      },
    });

    try {
      await action;
      closeAllModals();
    } catch (err) {}
  };

  const closeAllModals = () => {
    setIsRegModalOpen(false);
    setIsDelModalOpen(false);
    setIsStatusModalOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${
      DarkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900"
    }`}>
      <Toaster position="top-right" reverseOrder={false} />

      {/* 1. SIDEBAR: Desktop */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <Sidebar />
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-64 transform transition-transform duration-300 lg:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } ${DarkMode ? "bg-slate-900 shadow-2xl" : "bg-white shadow-2xl"}`}>
        
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* 2. HEADER: Unified & Transparent */}
        <div className="flex items-center w-full sticky top-0 z-40 bg-inherit">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="ml-4 p-2 lg:hidden hover:bg-slate-500/10 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <Header />
          </div>
        </div>

        {/* 3. MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Company Registry</h1>
                <p className={`text-xs md:text-sm mt-1 ${DarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Organization profile & security access control.
                </p>
              </div>
              <button 
                onClick={() => setIsRegModalOpen(true)} 
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all w-full sm:w-auto"
              >
                <Building2 size={20} /> <span className="whitespace-nowrap">Register New</span>
              </button>
            </div>

            {isFetching ? (
               <div className="py-20 text-center flex flex-col items-center gap-3">
                 <Loader2 className="animate-spin text-blue-500" size={40} />
                 <span className="font-bold opacity-50">Synchronizing Data...</span>
               </div>
            ) : (
              <>
                {/* MOBILE VIEW (Cards) - Cleaner for Small Screens */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {companies.map((co) => (
                    <div key={co.id} className={`p-5 rounded-2xl border ${DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="font-bold text-lg block">{co.name}</span>
                          <span className="text-xs opacity-50">{co.email}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                          co.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {co.status}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2 pt-3 border-t border-slate-700/20">
                        <button onClick={() => { setSelectedCompany(co); setIsStatusModalOpen(true); }} className={`p-2 rounded-lg ${co.status === 'Active' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-500/10'}`}><Power size={18}/></button>
                        <button onClick={() => { setSelectedCompany(co); setIsRegModalOpen(true); }} className="p-2 text-blue-500 bg-blue-500/10 rounded-lg"><Edit3 size={18}/></button>
                        <button onClick={() => { setSelectedCompany(co); setIsDelModalOpen(true); }} className="p-2 text-rose-500 bg-rose-500/10 rounded-lg"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP VIEW (Table) */}
                <div className={`hidden md:block rounded-3xl border transition-all overflow-hidden ${
                  DarkMode ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <table className="min-w-full text-left">
                    <thead className={DarkMode ? "bg-slate-800/40" : "bg-gray-50/80"}>
                      <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                        <th className="px-8 py-5">Organization</th>
                        <th className="px-8 py-5">Email</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${DarkMode ? "divide-slate-800" : "divide-gray-100"}`}>
                      {companies.map((co) => (
                        <tr key={co.id} className={`group transition-colors ${DarkMode ? "hover:bg-slate-800/30" : "hover:bg-blue-50/40"}`}>
                          <td className="px-8 py-6">
                            <span className="font-bold block">{co.name}</span>
                            <span className="text-[10px] opacity-40 font-mono">REF: {co.id}</span>
                          </td>
                          <td className="px-8 py-6 text-sm opacity-80">{co.email}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              {co.status === 'Active' ? <ShieldCheck size={14} className="text-emerald-500" /> : <ShieldAlert size={14} className="text-amber-500" />}
                              <span className={`text-[11px] font-black uppercase ${co.status === 'Active' ? "text-emerald-500" : "text-amber-500"}`}>
                                {co.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setSelectedCompany(co); setIsStatusModalOpen(true); }} className={`p-2 rounded-xl ${co.status === 'Active' ? "text-emerald-400 hover:bg-emerald-500/10" : "text-slate-500 hover:bg-slate-700"}`}><Power size={18} /></button>
                              <button onClick={() => { setSelectedCompany(co); setIsRegModalOpen(true); }} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl"><Edit3 size={18} /></button>
                              <button onClick={() => { setSelectedCompany(co); setIsDelModalOpen(true); }} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <RegisterModal isOpen={isRegModalOpen} onClose={closeAllModals} onSave={handleSave} initialData={selectedCompany} />
      <DeleteConfirmModal isOpen={isDelModalOpen} onClose={closeAllModals} onConfirm={confirmDelete} companyName={selectedCompany?.name} />
      <StatusConfirmModal isOpen={isStatusModalOpen} onClose={closeAllModals} onConfirm={confirmStatusChange} companyName={selectedCompany?.name} currentStatus={selectedCompany?.status} />
    </div>
  );
};

export default CompanyManagement;