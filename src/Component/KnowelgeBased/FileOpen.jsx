import { CloudUpload, FileText, X } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux';

const FileOpen = ({previewUrl, setPreviewUrl}) => {
  const { DarkMode } = useSelector((state) => state.webState);

  return (
    <div>
      {/* DOCUMENT PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-10">
          <div className={`relative w-full h-full max-w-6xl flex flex-col rounded-3xl overflow-hidden shadow-2xl ${DarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"}`}>
            
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${DarkMode ? "border-slate-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-2">
                <FileText className="text-blue-500" size={20} />
                <h3 className={`font-bold text-sm ${DarkMode ? "text-slate-100" : "text-slate-800"}`}>
                  Document Preview
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={previewUrl} 
                  download 
                  className={`p-2 rounded-lg transition-colors ${DarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}
                  title="Download Document"
                >
                  <CloudUpload size={20} />
                </a>
                <button 
                  onClick={() => setPreviewUrl(null)}
                  className={`p-2 rounded-lg transition-colors ${DarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body (The Iframe) */}
            <div className={`flex-1 ${DarkMode ? "bg-slate-950" : "bg-gray-100/50"}`}>
              <iframe
                src={`${previewUrl}#toolbar=0`} 
                className="w-full h-full border-none"
                title="Document Preview"
              />
            </div>

            {/* Footer Info */}
            <div className={`px-6 py-3 text-[10px] font-medium border-t ${DarkMode ? "border-slate-800 text-slate-500" : "border-gray-100 text-gray-400"}`}>
              Note: If the document doesn't load, your browser may be blocking the preview or the file type is not supported.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileOpen