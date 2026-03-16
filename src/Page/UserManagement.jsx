import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserModal from '../Component/AdminManagment/UserModal';
import DeleteConfirmModal from '../Component/CompanyManagement/DeleteConfirmModal';
import Sidebar from '../Component/SideBar';
import Header from '../Component/header'; // Standalone Header
import { Edit3, Trash2, UserPlus, Loader2, Menu, X, Mail } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import { 
  useGetAdminsQuery, 
  useCreateAdminMutation, 
  useUpdateAdminMutation, 
  useDeleteAdminMutation 
} from '../Redux/UserApi';

const UserManagement = () => {
  const { DarkMode } = useSelector((state) => state.webState);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- RTK QUERY HOOKS ---
  const { data: admins = [], isLoading, isError } = useGetAdminsQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();

  // Local UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  // --- HANDLERS ---
  const handleSave = async (data) => {
    const loadId = toast.loading(selectedAdmin ? "Updating Admin..." : "Creating Admin...");
    try {
      if (selectedAdmin) {
        await updateAdmin({ id: selectedAdmin.id, ...data }).unwrap();
        toast.success("Admin updated successfully!", { id: loadId });
      } else {
        await createAdmin(data).unwrap();
        toast.success("Admin registered successfully!", { id: loadId });
      }
      setIsModalOpen(false);
      setSelectedAdmin(null);
    } catch (err) {
      const errorMsg = err?.data?.message || "Operation failed. Please try again.";
      toast.error(errorMsg, { id: loadId });
    }
  };

  const confirmDelete = async () => {
    const loadId = toast.loading("Deleting Administrator...");
    try {
      await deleteAdmin(adminToDelete.id).unwrap();
      toast.success("Administrator removed.", { id: loadId });
      setIsDeleteOpen(false);
      setAdminToDelete(null);
    } catch (err) {
      toast.error("Failed to delete. Access denied.", { id: loadId });
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${
      DarkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900"
    }`}>
      <Toaster 
        position="top-right" 
        toastOptions={{
            duration: 4000,
            style: {
                background: DarkMode ? '#1e293b' : '#fff',
                color: DarkMode ? '#f8fafc' : '#1e293b',
                borderRadius: '16px',
                border: DarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
            }
        }} 
      />

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

        {/* 3. MAIN CONTENT: User Table/Card List */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
                <p className={`text-xs md:text-sm mt-1 ${DarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Manage administrative privileges and system access.
                </p>
              </div>
              <button 
                onClick={() => { setSelectedAdmin(null); setIsModalOpen(true); }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <UserPlus size={20} /> <span className="whitespace-nowrap">Create Admin</span>
              </button>
            </div>

            {/* Content Logic */}
            {isLoading ? (
               <div className="py-20 text-center">
                 <Loader2 className="animate-spin inline-block text-blue-500" size={40} />
               </div>
            ) : isError ? (
               <div className="py-20 text-center text-rose-500 font-medium">Error fetching data.</div>
            ) : (
              <>
                {/* MOBILE VIEW (Cards) */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {admins.map((admin) => (
                    <div key={admin.id} className={`p-5 rounded-2xl border transition-all ${DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-base">{admin.fullName}</span>
                          <span className="text-[11px] text-slate-500">{admin.email}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                          admin.role === 'System Admin' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {admin.role}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2 pt-3 border-t border-dashed border-slate-700/20">
                        <button onClick={() => { setSelectedAdmin(admin); setIsModalOpen(true); }} className="p-2 text-blue-500 bg-blue-500/10 rounded-lg"><Edit3 size={18}/></button>
                        <button onClick={() => { setAdminToDelete(admin); setIsDeleteOpen(true); }} className="p-2 text-rose-500 bg-rose-500/10 rounded-lg"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP VIEW (Table) */}
                <div className={`hidden md:block rounded-3xl border transition-all overflow-hidden ${
                  DarkMode ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <table className="w-full text-left">
                    <thead className={`${DarkMode ? "bg-slate-800/50" : "bg-slate-50"} text-[11px] uppercase tracking-widest font-black text-slate-400`}>
                      <tr>
                        <th className="px-8 py-5">Administrator</th>
                        <th className="px-8 py-5">Role</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${DarkMode ? "divide-slate-800" : "divide-slate-100"}`}>
                      {admins.map((admin) => (
                        <tr key={admin.id} className={`transition-colors group ${DarkMode ? "hover:bg-slate-800/30" : "hover:bg-slate-50/50"}`}>
                          <td className="px-8 py-5">
                            <div className="font-bold">{admin.fullName}</div>
                            <div className="text-xs text-slate-500">{admin.email}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                              admin.role === 'System Admin' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setSelectedAdmin(admin); setIsModalOpen(true); }} className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg"><Edit3 size={18}/></button>
                              <button onClick={() => { setAdminToDelete(admin); setIsDeleteOpen(true); }} className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg"><Trash2 size={18}/></button>
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
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleSave} 
        initialData={selectedAdmin} 
        isSubmitting={isCreating || isUpdating}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={confirmDelete} 
        adminName={adminToDelete?.fullName} 
      />
    </div>
  );
};

export default UserManagement;