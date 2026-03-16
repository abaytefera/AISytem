import { useState } from "react";
import { useSelector } from "react-redux"; // Added for theme access
import { 
  X, 
  Type, 
  Layers, 
  FileText, 
  Sparkles, 
  PencilLine,
  ChevronDown
} from "lucide-react";
import Button from "./Button";
import { useCreateManualEntryMutation } from "../../Redux/kownlegeBase";
import toast from "react-hot-toast";

export default function AddTextEntry({ isOpen, handleCancel }) {
  // Access DarkMode from Redux
  const { DarkMode } = useSelector((state) => state.webState);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });
    
  const [isManual, setIsManual] = useState(false); 
  const [createManualEntry, { isLoading }] = useCreateManualEntryMutation();

  const categories = ["About", "Pricing", "Policies", "Support", "FAQ"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.content) {
        toast.error("Please fill in all fields before training.");
        return;
    }

    const toastId = toast.loading("Processing manual entry...");
    try {
      await createManualEntry({
        title: formData.title,
        category: formData.category,
        content: formData.content,
        type: "Text"
      }).unwrap();
      
      toast.success("AI trained with new text!", { id: toastId });
      setFormData({ title: "", category: "", content: "" });
      handleCancel();
    } catch (error) {
      console.error("Training failed:", error);
      toast.error("Failed to train AI. Please try again.", { id: toastId });
    }
  };

  if (!isOpen) return null;

  // Dynamic Theme Mapping
  const theme = {
    card: DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100",
    input: DarkMode ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/40 placeholder:text-slate-500" : "bg-white border-gray-300 focus:ring-blue-500",
    label: `flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${DarkMode ? "text-slate-400" : "text-gray-500"}`,
    footer: DarkMode ? "bg-slate-900/50 border-slate-800" : "bg-gray-50 border-gray-100"
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-200 ${theme.card}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-8 py-5 border-b ${DarkMode ? "border-slate-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${DarkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
              <Sparkles size={22} />
            </div>
            <h2 className={`text-xl font-bold ${DarkMode ? "text-white" : "text-gray-800"}`}>
              Manual Training
            </h2>
          </div>
          <button 
            onClick={handleCancel}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className={theme.label}>
              <Type size={14} /> Entry Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Working Hours Update"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme.input}`}
            />
          </div>

          {/* Category Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={theme.label}>
                <Layers size={14} /> Category
              </label>
              <button 
                onClick={() => {
                  setIsManual(!isManual);
                  setFormData(prev => ({ ...prev, category: "" })); 
                }}
                className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400"
              >
                {isManual ? "[ List ]" : "[ Manual ]"}
              </button>
            </div>

            {isManual ? (
              <div className="relative animate-in slide-in-from-left-2">
                <PencilLine size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="category"
                  placeholder="New category..."
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-all ${theme.input}`}
                  autoFocus
                />
              </div>
            ) : (
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full appearance-none px-4 py-3 rounded-xl border outline-none pr-10 ${theme.input}`}
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

          {/* Content Textarea */}
          <div className="space-y-2">
            <label className={theme.label}>
              <FileText size={14} /> Knowledge Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Paste the information you want the AI to learn..."
              className={`w-full h-44 px-4 py-3 rounded-xl border outline-none resize-none transition-all ${theme.input}`}
            />
            <div className="flex justify-between items-center">
              <p className={`text-[10px] font-bold uppercase tracking-wider ${DarkMode ? "text-slate-500" : "text-gray-400"}`}>
                Maximum quality recommended
              </p>
              <p className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${DarkMode ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-500"}`}>
                {formData.content.length.toLocaleString()} CHARS
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 px-8 py-5 border-t ${theme.footer}`}>
          <button 
            onClick={handleCancel}
            className={`px-6 py-2.5 font-bold rounded-xl transition-colors ${DarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-200"}`}
          >
            Cancel
          </button>
          <button 
            disabled={isLoading || !formData.content}
            onClick={handleSubmit}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg
              ${isLoading 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95'
              }`}
          >
            {isLoading ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {isLoading ? "Training..." : "Start Training"}
          </button>
        </div>
      </div>
    </div>
  );
}