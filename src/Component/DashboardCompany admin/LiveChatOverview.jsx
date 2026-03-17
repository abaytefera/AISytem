import React from "react";
import { useSelector } from "react-redux";
import { MessageCircle, ExternalLink, Plus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LiveChatOverview = ({ recentChats = [] }) => {
  const { DarkMode } = useSelector((state) => state.webState);
  const navigate = useNavigate();

  const handleMessage = (id) => {
    // Navigating to your conversation route with the session ID
    navigate("/wedjfheijsjdjksjslakadnjfnjdndjddssd", { state: { id: id } }); 
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg w-full border transition-all duration-300 ${
      DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    }`}>
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`font-semibold tracking-tight flex items-center gap-2 ${
          DarkMode ? "text-slate-100" : "text-slate-800"
        }`}>
          <MessageCircle size={18} className="text-indigo-500" />
          Live Chat Overview
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500">
            Live Now
          </span>
        </div>
      </div>

      {/* Chat List Section */}
      <div className="space-y-3 min-h-[180px]">
        {recentChats.length > 0 ? (
          recentChats.map((chat) => (
            <ChatItem 
              key={chat.id} 
              name={chat.name} 
              status={chat.status} 
              time={chat.time} 
              lastMessage={chat.lastMessage} // Pass the new field
              darkMode={DarkMode} 
              id={chat.id}
              onSelect={handleMessage}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 opacity-50">
             <MessageCircle size={32} className="mb-2 text-slate-400" />
             <p className="text-xs italic text-slate-500">No active conversations</p>
          </div>
        )}
      </div>

      <button onClick={ ()=>{navigate("/wedjfheijsjdjksjslakadnjfnjdndjddssd")}} className={`mt-6 w-full text-white text-sm font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.97] group ${
        DarkMode 
          ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/20" 
          : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200"
      }`}>
        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
        Monitor Chat
      </button>
    </div>
  );
};

const ChatItem = ({ name, status, time, lastMessage, darkMode, id, onSelect }) => (
  <div 
    onClick={() => onSelect(id)} 
    className={`group flex justify-between items-center p-3 rounded-xl border transition-all cursor-pointer ${
      darkMode 
        ? "bg-slate-800/40 hover:bg-slate-800 border-slate-800 hover:border-slate-700" 
        : "bg-slate-50 hover:bg-white border-slate-100 hover:border-indigo-100 hover:shadow-sm"
    }`}
  >
    <div className="flex items-center gap-3 overflow-hidden">
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
        darkMode ? "bg-slate-700 text-indigo-400" : "bg-indigo-100 text-indigo-600"
      }`}>
        {name?.split(' ')[1]?.charAt(0) || name?.charAt(0) || 'V'}
      </div>
      
      <div className="flex flex-col min-w-0">
        <span className={`text-sm font-semibold truncate transition-colors ${
          darkMode ? "text-slate-200 group-hover:text-white" : "text-slate-700 group-hover:text-indigo-600"
        }`}>
          {name}
        </span>
        
        {/* NEW: Last Message Snippet */}
        <p className="text-[11px] text-slate-500 truncate max-w-[140px] leading-tight">
          {lastMessage || "No messages yet"}
        </p>

        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
          <Clock size={10} />
          {time}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2 flex-shrink-0">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        status === "Active" 
          ? "bg-emerald-500/10 text-emerald-500" 
          : "bg-slate-500/10 text-slate-500"
      }`}>
        {status}
      </span>
      <ExternalLink size={14} className={`transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
        darkMode ? "text-slate-600 group-hover:text-indigo-400" : "text-slate-300 group-hover:text-indigo-500"
      }`} />
    </div>
  </div>
);

export default LiveChatOverview;