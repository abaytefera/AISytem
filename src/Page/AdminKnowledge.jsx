import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FileUp, 
  PlusCircle, 
  Database, 
  BrainCircuit, 
  Info,
  Menu // Added for mobile trigger
} from "lucide-react";

import Header from "../Component/header";

import Sidebar from "../Component/SideBar";
import UploadFiles from "../Component/KnowelgeBased/UploadFiles";
import AddTextEntry from "../Component/KnowelgeBased/AddTextEntry";
import KnowledgeEntries from "../Component/KnowelgeBased/KnowledgeEntries";
import { Toaster } from "react-hot-toast";
import { logout } from "../Redux/auth";

export default function AdminKnowledge() {
  const dispatch = useDispatch();
  const { DarkMode } = useSelector((state) => state.webState);
  
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [isTextTrain, setIsTextTrain] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Mobile sidebar state

  const onLogout = () => dispatch(logout());
  
  const handleCancel = () => {
    setUploadOpen(false);
    setIsTextTrain(false);
  };

  const onSubmit = () => {};

  const theme = {
    pageBg: DarkMode ? "bg-slate-900" : "bg-[#F8F9FB]",
    headerBg: DarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-200",
    card: DarkMode ? "bg-slate-900 border-slate-800 shadow-xl" : "bg-white border-gray-100 shadow-sm",
    textTitle: DarkMode ? "text-white" : "text-gray-900",
    textSub: DarkMode ? "text-slate-400" : "text-gray-500",
    infoBanner: DarkMode ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-100"
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${theme.pageBg}`}>
      
      {/* Sidebar - Desktop */}
      <aside className={`w-64 hidden lg:flex fixed h-screen shadow-sm z-50 transition-colors duration-300 ${DarkMode ? "bg-slate-900 border-r border-slate-800" : "bg-white border-r border-gray-100"}`}>
        <Sidebar onLogout={onLogout} />
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-64 transform transition-transform duration-300 lg:hidden ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${DarkMode ? "bg-slate-900" : "bg-white"}`}>
        <Sidebar onLogout={onLogout} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:ml-64 relative min-w-0">

        {/* Header Section */}
        <div className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${theme.headerBg}`}>
          <div className="flex items-center px-4 lg:px-0">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 mr-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1">
              <Header />
            </div>
          </div>
        </div>
        
        <Toaster 
          toastOptions={{
            style: DarkMode ? { background: '#1e293b', color: '#fff', border: '1px solid #334155' } : {},
          }} 
          position="top-right" 
        />

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          
          {/* Welcome & Action Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h1 className={`text-xl md:text-2xl font-bold flex items-center gap-2 transition-colors duration-300 ${theme.textTitle}`}>
                <BrainCircuit className="text-blue-500 shrink-0" size={28} />
                Knowledge Base
              </h1>
              <p className={`text-sm mt-1 transition-colors duration-300 ${theme.textSub}`}>
                Train your AI by uploading documents or entering custom text data.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Train via File */}
              <button 
                onClick={() => setUploadOpen(true)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all border
                  ${DarkMode 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"}`}
              >
                <FileUp size={18} />
                <span className="whitespace-nowrap">Upload Files</span>
              </button>

              {/* Train via Text */}
              <button 
                onClick={() => setIsTextTrain(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <PlusCircle size={18} />
                <span className="whitespace-nowrap">Manual Entry</span>
              </button>
            </div>
          </div>

          {/* Quick Stats or Info Banner */}
          <div className={`${theme.infoBanner} rounded-2xl p-4 mb-8 flex items-start gap-3 transition-all duration-300`}>
            <Info className="text-blue-500 mt-0.5 shrink-0" size={20} />
            <p className={`text-xs md:text-sm ${DarkMode ? "text-blue-200" : "text-blue-800"}`}>
              <b className={DarkMode ? "text-blue-400" : ""}>Pro Tip:</b> Higher quality text descriptions result in more accurate AI responses. 
            </p>
          </div>

          {/* Data Table / Entries Section */}
          <div className={`${theme.card} rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300`}>
            <div className={`p-4 md:p-6 border-b flex items-center gap-2 ${DarkMode ? "border-slate-800" : "border-gray-50"}`}>
              <Database size={18} className="text-gray-400" />
              <h3 className={`font-bold text-sm md:text-base ${theme.textTitle}`}>Existing Knowledge Entries</h3>
            </div>
            <div className="p-0 sm:p-2 overflow-x-auto">
               <KnowledgeEntries />
            </div>
          </div>

        </main>

        <AddTextEntry isOpen={isTextTrain} handleCancel={handleCancel} onSubmit={onSubmit} />
        <UploadFiles isOpen={isUploadOpen} handleCancel={handleCancel} />

      </div>
    </div>
  );
}