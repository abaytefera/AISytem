import { Database, X } from 'lucide-react';
import React from 'react';
import Button from './Button';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'; // Added Redux hook for consistency

const TextOpen = ({ selectedText, setSelectedText, DarkMode: propDarkMode }) => {
  // Pull from Redux if prop isn't provided, ensuring it works either way
  const { DarkMode: reduxDarkMode } = useSelector((state) => state.webState || {});
  const isDark = propDarkMode !== undefined ? propDarkMode : reduxDarkMode;

  // If selectedText is null, don't render anything
  if (!selectedText) return null;

  const displayTitle = typeof selectedText === 'object' ? selectedText.title : "Knowledge Content";
  const displayContent = typeof selectedText === 'object' ? selectedText.content : selectedText;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border-gray-100"}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-slate-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-2">
            <Database size={18} className="text-emerald-500" />
            <h3 className={`font-bold text-sm ${isDark ? "text-slate-100" : "text-slate-800"}`}>
              {displayTitle || "Knowledge Content"}
            </h3>
          </div>
          <button 
            onClick={() => setSelectedText(null)} 
            className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={`p-6 overflow-y-auto max-h-[60vh] ${isDark ? "bg-slate-900" : "bg-white"}`}>
          <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? "text-slate-300" : "text-gray-600"}`}>
            {displayContent || "No content available."}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 flex justify-end gap-3 border-t ${isDark ? "bg-slate-800/50 border-slate-800" : "bg-gray-50 border-gray-100"}`}>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(displayContent);
              toast.success("Content copied!");
            }}
            className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors mr-auto"
          >
            Copy to clipboard
          </button>
          
          {/* Ensure Button component also handles dark mode or pass a variant */}
          <Button 
            variant={isDark ? "outline" : "secondary"} 
            onClick={() => setSelectedText(null)}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TextOpen;