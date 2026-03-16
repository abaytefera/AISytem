import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { 
  Edit3, 
  Power, 
  Trash2, 
  Search, 
  ExternalLink, 
  FileText, 
  Database, 
  Loader2, 
  CheckCircle2,
  X,
  FileUp,
  Sparkles,
  RefreshCcw,
  Type,
  Layers,
  Info // Added missing import
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  useGetUploadDocumentsQuery, 
  useDeleteDocumentMutation, 
  useToggleDocumentStatusMutation,
  useUpdateFileUploadMutation,
  useUpdateManualEntryMutation,
  useUpdateMetadataMutation 
} from "../../Redux/kownlegeBase";
import FileOpen from "./FileOpen.jsx";
import StatusBadge from "./StatusBadge.jsx";
import TextOpen from "./TextOpen.jsx";

export default function KnowledgeEntries() {
  const { DarkMode } = useSelector((state) => state.webState);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [deleteId, setDeleteId] = useState(null); 
  const [toggleItem, setToggleItem] = useState(null); 
  const [editItem, setEditItem] = useState(null); 
  const [isUpdateContentActive, setIsUpdateContentActive] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedText, setSelectedText] = useState(null);

  const { data: entries = [], isLoading } = useGetUploadDocumentsQuery();
  const [deleteDoc, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [toggleStatus, { isLoading: isToggling }] = useToggleDocumentStatusMutation();
  const [updateFile, { isLoading: isFileUpdating }] = useUpdateFileUploadMutation();
  const [updateText, { isLoading: isTextUpdating }] = useUpdateManualEntryMutation();
  const [updateMetadata, { isLoading: isMetaUpdating }] = useUpdateMetadataMutation();

  const isSaving = isFileUpdating || isTextUpdating || isMetaUpdating;

  const handleSaveEdit = async () => {
    const toastId = toast.loading("Processing update...");
    try {
      if (isUpdateContentActive) {
        if (editItem.type?.toLowerCase() === "file") {
          if (!newFile) {
            toast.error("Please select a new file", { id: toastId });
            return;
          }
          const data = new FormData();
          data.append("file", newFile);
          data.append("title", editItem.title);
          data.append("category", editItem.category);
          data.append("previous_id", editItem.id); 
          await updateFile(data).unwrap();
        } else {
          await updateText({
            title: editItem.title,
            category: editItem.category,
            content: editItem.content, 
            previous_id: editItem.id 
          }).unwrap();
        }
        toast.success("New version created", { id: toastId });
      } else {
        await updateMetadata({
          id: editItem.id,
          title: editItem.title,
          category: editItem.category
        }).unwrap();
        toast.success("Details updated", { id: toastId });
      }
      closeEditModal();
    } catch (err) {
      toast.error(err?.data?.detail || "Update failed", { id: toastId });
    }
  };

  const closeEditModal = () => {
    setEditItem(null);
    setIsUpdateContentActive(false);
    setNewFile(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const toastId = toast.loading("Removing entry...");
    try {
      await deleteDoc(deleteId).unwrap();
      toast.success("Entry deleted", { id: toastId });
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.data?.detail || "Delete failed", { id: toastId });
    }
  };

  const handleConfirmToggle = async () => {
    if (!toggleItem) return;
    const toastId = toast.loading("Updating status...");
    try {
      await toggleStatus(toggleItem.id).unwrap();
      toast.success("Status updated", { id: toastId });
      setToggleItem(null);
    } catch (err) {
      toast.error(err?.data?.detail || "Toggle failed", { id: toastId });
    }
  };

  const filteredEntries = (entries || []).filter((item) => {
    const title = item?.title?.toLowerCase() || "";
    const category = item?.category?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return title.includes(search) || category.includes(search);
  });

  if (isLoading) return (
    <div className="py-20 text-center">
      <Loader2 className="animate-spin inline-block w-10 h-10 text-blue-600" />
    </div>
  );

  return (
    <div className={`w-full transition-colors duration-300 min-h-screen pb-10 ${DarkMode ? "text-slate-100" : "text-slate-800"}`}>
      
      {/* 1. EDIT MODAL - Responsive tweaks: max-height and scrolling for small screens */}
      {editItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`${DarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"} rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95`}>
            <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Edit3 className="text-blue-600" size={20} /> Edit Resource
              </h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-red-500 transition-colors"><X /></button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1"><Type size={12}/> Title</label>
                  <input 
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 ${DarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200"}`}
                    value={editItem.title || ""}
                    onChange={(e) => setEditItem({...editItem, title: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1"><Layers size={12}/> Category</label>
                  <input 
                    className={`w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 ${DarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200"}`}
                    value={editItem.category || ""}
                    onChange={(e) => setEditItem({...editItem, category: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={() => setIsUpdateContentActive(!isUpdateContentActive)}
                className={`w-full py-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 font-bold text-sm transition-all
                  ${isUpdateContentActive ? 'bg-blue-600 border-blue-600 text-white' : DarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                <RefreshCcw size={18} className={isUpdateContentActive ? "animate-spin-slow" : ""} />
                {isUpdateContentActive ? "Versioning Active" : "Update Content?"}
              </button>

              {isUpdateContentActive && (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                  {editItem.type?.toLowerCase() === "file" ? (
                    <div className={`flex flex-col items-center p-6 border-2 border-dashed rounded-2xl ${DarkMode ? "bg-slate-800 border-slate-700" : "bg-blue-50/50 border-blue-200"}`}>
                      {!newFile ? (
                        <>
                          <FileUp className="text-blue-400 mb-2" size={32} />
                          <button onClick={() => fileInputRef.current.click()} className="text-sm font-bold text-blue-600 underline text-center">Select New File</button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-blue-500 font-bold text-center break-all">
                          <CheckCircle2 size={18} className="shrink-0" /> {newFile.name}
                          <button onClick={() => setNewFile(null)} className="ml-2 text-red-500 hover:scale-110 transition-transform"><X size={16}/></button>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setNewFile(e.target.files[0])} />
                    </div>
                  ) : (
                    <textarea 
                      className={`w-full h-32 px-4 py-3 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none ${DarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200"}`}
                      value={editItem.content || ""}
                      onChange={(e) => setEditItem({...editItem, content: e.target.value})}
                      placeholder="Update text content..."
                    />
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button onClick={closeEditModal} className={`w-full sm:flex-1 py-3 font-bold rounded-2xl transition-colors ${DarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Cancel</button>
                <button 
                  onClick={handleSaveEdit} 
                  disabled={isSaving}
                  className="w-full sm:flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />} Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`${DarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"} rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95`}>
            <div className="p-6 sm:p-8 text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${DarkMode ? "bg-red-500/10 text-red-500" : "bg-red-100 text-red-600"}`}>
                <Trash2 size={32} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${DarkMode ? "text-white" : "text-gray-900"}`}>Delete Knowledge?</h3>
              <p className="text-gray-500 text-sm">This action is irreversible and removes all associated AI embeddings.</p>
            </div>
            <div className={`flex flex-col sm:flex-row gap-3 p-4 border-t ${DarkMode ? "bg-slate-800/50 border-slate-800" : "bg-gray-50 border-gray-100"}`}>
              <button onClick={() => setDeleteId(null)} className={`order-2 sm:order-1 flex-1 px-4 py-2.5 font-semibold rounded-xl border transition-colors ${DarkMode ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}`}>Cancel</button>
              <button onClick={handleConfirmDelete} disabled={isDeleting} className="order-1 sm:order-2 flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 transition-all active:scale-95">
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TOGGLE STATUS MODAL */}
      {toggleItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`${DarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"} rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95`}>
            <div className="p-6 sm:p-8 text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 
                ${toggleItem.status === 'Active' ? (DarkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-100 text-amber-600') : (DarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-100 text-emerald-600')}`}>
                <Power size={32} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${DarkMode ? "text-white" : "text-gray-900"}`}>
                {toggleItem.status === 'Active' ? "Deactivate?" : "Activate?"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {toggleItem.status === 'Active'
                  ? "The AI will stop using this resource for answers." 
                  : "The AI will begin including this resource in its knowledge base."}
              </p>
            </div>
            <div className={`flex flex-col sm:flex-row gap-3 p-4 border-t ${DarkMode ? "bg-slate-800/50 border-slate-800" : "bg-gray-50 border-gray-100"}`}>
              <button onClick={() => setToggleItem(null)} className={`order-2 sm:order-1 flex-1 px-4 py-2.5 font-semibold rounded-xl border transition-colors ${DarkMode ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}`}>Cancel</button>
              <button 
                onClick={handleConfirmToggle} 
                disabled={isToggling} 
                className={`order-1 sm:order-2 flex-1 px-4 py-2.5 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${toggleItem.status === 'Active' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {isToggling ? <Loader2 size={18} className="animate-spin" /> : <Power size={18} />} 
                {toggleItem.status === 'Active' ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SEARCH - Adjusted for mobile centering */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-4 pt-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search knowledge..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${DarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
          />
        </div>
      </div>

      {/* 5. TABLE / CARD VIEW */}
      <div className="px-4">
        {/* Mobile View (Cards) - Visible only on small screens */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredEntries.map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl border ${DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-sm"}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="font-bold text-sm leading-tight">{item?.title || "Untitled"}</span>
                  <span className="text-[10px] text-gray-400 font-medium">Ver. {item.version || 1}</span>
                </div>
                <StatusBadge status={item.status} />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${DarkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                    {item.category}
                 </span>
                 <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${DarkMode ? "text-slate-400" : "text-gray-500"}`}>
                    {item.type?.toLowerCase() === "file" ? <FileUp size={12} /> : <Database size={12} />}
                    {item.type || "Text"}
                 </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-700/20">
                <div className="flex gap-2">
                  {item.type?.toLowerCase() === "file" && item?.url && (
                    <button onClick={() => setPreviewUrl(item.url)} className="p-2 text-blue-500 bg-blue-500/10 rounded-lg"><ExternalLink size={16} /></button>
                  )}
                  {item.type?.toLowerCase() === "text" && item?.content && (
                    <button onClick={() => setSelectedText(item)} className="p-2 text-emerald-500 bg-emerald-500/10 rounded-lg"><FileText size={16} /></button>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditItem(item)} className="p-2 text-gray-400 hover:text-blue-500"><Edit3 size={18}/></button>
                  <button onClick={() => setToggleItem(item)} className="p-2 text-gray-400"><Power size={18}/></button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (Table) - Hidden on small screens */}
        <div className={`hidden md:block overflow-hidden border rounded-2xl shadow-sm ${DarkMode ? "border-slate-800 bg-slate-900/50" : "border-gray-100 bg-white"}`}>
          <table className="w-full border-collapse">
            <thead>
              <tr className={`${DarkMode ? "bg-slate-800/50" : "bg-gray-50/50"}`}>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Resource</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Manage</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${DarkMode ? "divide-slate-800" : "divide-gray-100"}`}>
              {filteredEntries.map((item) => (
                <tr key={item.id} className={`${DarkMode ? "hover:bg-slate-800/30" : "hover:bg-blue-50/30"} transition-colors group`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{item?.title || "Untitled"}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 font-medium">Ver. {item.version || 1}</span>
                        {item.type?.toLowerCase() === "file" && item?.url && (
                          <button onClick={() => setPreviewUrl(item.url)} className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 font-bold transition-all">
                            <ExternalLink size={10} /> View Document
                          </button>
                        )}
                        {item.type?.toLowerCase() === "text" && item?.content && (
                          <button onClick={() => setSelectedText(item)} className="flex items-center gap-1 text-[10px] text-emerald-500 hover:text-emerald-700 font-bold transition-all">
                            <FileText size={10} /> View Content
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 text-[11px] font-bold uppercase ${DarkMode ? "text-slate-400" : "text-gray-500"}`}>
                      {item.type?.toLowerCase() === "file" ? <FileUp size={14} /> : <Database size={14} />}
                      {item.type || "Text"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${DarkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditItem(item)} className="p-2 text-gray-400 hover:text-blue-600 transition-all rounded-lg hover:bg-blue-500/10" title="Edit"><Edit3 size={18} /></button>
                      <button onClick={() => setToggleItem(item)} className={`p-2 transition-all rounded-lg ${item.status === 'Active' ? 'text-gray-400 hover:text-amber-500 hover:bg-amber-500/10' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10'}`} title="Toggle"><Power size={18} /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-2 text-gray-400 hover:text-red-600 transition-all rounded-lg hover:bg-red-500/10" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <Info className="mx-auto mb-2 opacity-20" size={40} />
            <p>No resources found matching your search.</p>
          </div>
        )}
      </div>

      <FileOpen previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
      <TextOpen selectedText={selectedText} setSelectedText={setSelectedText} />
    </div>
  );
}