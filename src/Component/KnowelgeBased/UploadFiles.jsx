import { useState, useRef } from "react";
import { useSelector } from "react-redux"; // Added for theme access
import { 
  Layers, 
  FileUp, 
  X, 
  FileText, 
  CloudUpload,
  PencilLine,
  ChevronDown,
  Type
} from "lucide-react";
import Button from "./Button";
import { useCreateFileUploadMutation } from "../../Redux/kownlegeBase";
import toast from "react-hot-toast";

export default function UploadFiles({ isOpen, handleCancel }) {
  const { DarkMode } = useSelector((state) => state.webState);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: ""
  });
  
  const [createFileUpload, { isLoading }] = useCreateFileUploadMutation();
  const inputRef = useRef(null);
  const categories = ["About", "Pricing", "Policies", "Support", "FAQ"];

  if (!isOpen) return null;

  // --- Helpers ---
  const resetForm = () => {
    setSelectedFile(null);
    setFormData({ title: "", category: "" });
    setIsManual(false);
  };

  const handleFiles = (files) => {
    if (files && files[0]) setSelectedFile(files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  const handleStartTraining = async () => {
    if (!selectedFile || !formData.category || !formData.title) {
      toast.error("Please fill in all fields and select a file.");
      return;
    }

    const toastId = toast.loading("Uploading and processing file...");
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("category", formData.category);
    data.append("title", formData.title);

    try {
      await createFileUpload(data).unwrap();
      toast.success("File trained successfully!", { id: toastId });
      resetForm();
      handleCancel();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to start training", { id: toastId });
    }
  };

  // --- Theme Classes ---
  const theme = {
    card: DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100",
    input: DarkMode ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/40" : "bg-white border-gray-300 focus:ring-blue-500",
    label: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60",
    dropzone: dragActive 
      ? (DarkMode ? "border-blue-500 bg-blue-500/10" : "border-blue-500 bg-blue-50")
      : (DarkMode ? "border-slate-700 bg-slate-800/30 hover:bg-slate-800/50" : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50")
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-200 ${theme.card}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-8 py-5 border-b ${DarkMode ? "border-slate-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${DarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
              <FileUp size={22} />
            </div>
            <h2 className={`text-xl font-bold ${DarkMode ? "text-white" : "text-gray-800"}`}>Upload Knowledge</h2>
          </div>
          <button onClick={handleCancel} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Entry Title */}
          <div className="space-y-2">
            <label className={`${theme.label} ${DarkMode ? "text-slate-300" : "text-gray-700"}`}>
              <Type size={14} /> Entry Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Refund Policy 2024"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.input}`}
            />
          </div>

          {/* Category Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`${theme.label} ${DarkMode ? "text-slate-300" : "text-gray-700"}`}>
                <Layers size={14} /> Category
              </label>
              <button 
                onClick={() => {
                  setIsManual(!isManual);
                  setFormData(prev => ({ ...prev, category: "" }));
                }}
                className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
              >
                {isManual ? "[ Select from list ]" : "[ Write manually ]"}
              </button>
            </div>

            {isManual ? (
              <div className="relative animate-in slide-in-from-left-2">
                <PencilLine size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="category"
                  placeholder="Type new category..."
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm transition-all ${theme.input}`}
                  autoFocus
                />
              </div>
            ) : (
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full appearance-none px-4 py-3 rounded-xl border outline-none text-sm transition-all pr-10 ${theme.input}`}
                >
                  <option value="">Choose a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          <input ref={inputRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => handleFiles(e.target.files)} />

          {/* Drop Zone */}
          {!selectedFile ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current.click()}
              className={`group border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${theme.dropzone}`}
            >
              <CloudUpload size={48} className={`mx-auto mb-4 transition-all duration-300 ${dragActive ? 'scale-110 text-blue-500' : 'text-slate-500 group-hover:text-blue-400'}`} />
              <p className={`text-sm font-bold ${DarkMode ? "text-slate-300" : "text-gray-700"}`}>Click to upload or drag and drop</p>
              <p className="text-[10px] text-slate-500 mt-2 uppercase font-black tracking-[0.2em]">PDF, DOCX, TXT • MAX 10MB</p>
            </div>
          ) : (
            <div className={`flex items-center gap-4 p-5 rounded-2xl border animate-in zoom-in-95 ${DarkMode ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50 border-emerald-100"}`}>
              <div className={`p-3 rounded-xl shadow-sm ${DarkMode ? "bg-slate-800 text-emerald-400" : "bg-white text-emerald-600"}`}>
                <FileText size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${DarkMode ? "text-white" : "text-gray-900"}`}>{selectedFile.name}</p>
                <p className="text-[11px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">Ready for Training</p>
              </div>
              <button 
                onClick={() => setSelectedFile(null)} 
                className={`p-2 rounded-full transition-colors ${DarkMode ? "hover:bg-slate-800 text-slate-400 hover:text-red-400" : "hover:bg-red-50 text-gray-400 hover:text-red-500"}`}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 px-8 py-5 border-t ${DarkMode ? "bg-slate-900/50 border-slate-800" : "bg-gray-50 border-gray-100"}`}>
          <button 
            onClick={() => { resetForm(); handleCancel(); }}
            className={`px-6 py-2.5 font-bold rounded-xl transition-colors ${DarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-200"}`}
          >
            Cancel
          </button>
          <button 
            disabled={!selectedFile || !formData.category || !formData.title || isLoading}
            onClick={handleStartTraining}
            className={`px-10 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2
              ${(!selectedFile || !formData.category || !formData.title || isLoading) 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95'
              }`}
          >
            {isLoading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</span> : "Start Training"}
          </button>
        </div>
      </div>
    </div>
  );
}