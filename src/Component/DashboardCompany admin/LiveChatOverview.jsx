import React from "react";
import { useSelector } from "react-redux"; // Added
import { MessageCircle, ExternalLink, Plus } from "lucide-react";

const LiveChatOverview = () => {
  // 1. Access the global theme state
  const { DarkMode } = useSelector((state) => state.webState);

  return (
    <div className={`p-6 rounded-xl shadow-xl w-full border transition-all duration-300 ${
      DarkMode 
        ? "bg-slate-900 border-slate-800" 
        : "bg-white border-slate-200"
    }`}>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className={`font-semibold tracking-tight flex items-center gap-2 ${
          DarkMode ? "text-slate-100" : "text-slate-800"
        }`}>
          <MessageCircle size={18} className="text-indigo-400" />
          Live Chat Overview
        </h2>
        <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
          Live Now
        </span>
      </div>

      <div className="space-y-2">
        {/* Pass DarkMode down to child items */}
        <ChatItem name="Visitor Tasing Chats" status="Viewed" time="2m ago" darkMode={DarkMode} />
        <ChatItem name="Visitor Accounts" status="Viewed" time="5m ago" darkMode={DarkMode} />
        <ChatItem name="Shipping Policy" status="Viewed" time="12m ago" darkMode={DarkMode} />
      </div>

      <button className={`mt-6 w-full text-white text-sm font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
        DarkMode 
          ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-indigo-500/20" 
          : "bg-blue-600 hover:bg-blue-700 shadow-md"
      }`}>
        <Plus size={16} />
        New Incoming Chat
      </button>
    </div>
  );
};

const ChatItem = ({ name, status, time, darkMode }) => (
  <div className={`group flex justify-between items-center p-3 rounded-lg border transition-all cursor-pointer ${
    darkMode 
      ? "bg-slate-800/50 hover:bg-slate-800 border-transparent hover:border-slate-700" 
      : "bg-slate-50 hover:bg-slate-100 border-slate-100 hover:border-slate-200"
  }`}>
    <div className="flex flex-col">
      <span className={`text-sm font-medium group-hover:text-indigo-600 transition-colors ${
        darkMode ? "text-slate-200 group-hover:text-white" : "text-slate-700"
      }`}>
        {name}
      </span>
      <span className="text-[11px] text-slate-500">{time}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
        {status}
      </span>
      <ExternalLink size={14} className={`${
        darkMode ? "text-slate-600 group-hover:text-slate-400" : "text-slate-400 group-hover:text-slate-600"
      }`} />
    </div>
  </div>
);

export default LiveChatOverview;