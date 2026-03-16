import React, { useState } from "react";
import { Search, User, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { useGetSessionsQuery } from "../../Redux/Conversation";
import { useLocation } from "react-router-dom";

export default function ChatList({ onSelectSession, activeSessionId }) {
  const { DarkMode } = useSelector((state) => state.webState);
  const [searchTerm, setSearchTerm] = useState("");
const location=useLocation()
  // 1. RTK Query Hook - Handles loading, error, and data automatically
const { 
  data: sessions = [], 
  isLoading, 
  isFetching, 
  error,
  refetch 
} = useGetSessionsQuery(undefined, {
  pollingInterval: location.pathname === "/wedjfheijsjdjksjslakadnjfnjdndjddssd" ? 1000 : 0
});
  // 2. Filter logic
 const filteredSessions = [...sessions]
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
    .filter((s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.last_message && s.last_message.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className={`flex flex-col h-full ${DarkMode ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}>
      
      {/* Header & Search */}
      <div className={`p-5 border-b ${DarkMode ? "border-slate-800" : "border-slate-100"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Messages
            {!isLoading && (
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                {sessions.length}
              </span>
            )}
          </h2>
          {/* Subtle indicator for background syncing */}
          {isFetching && !isLoading && <RefreshCw size={14} className="animate-spin text-slate-400" />}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search visitor ID..."
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all ${
              DarkMode 
                ? "bg-slate-800 border-slate-700 focus:border-blue-500" 
                : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white shadow-sm"
            }`}
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
            <Loader2 className="animate-spin text-blue-600" size={28} />
            <span className="text-xs font-medium uppercase tracking-widest">Loading Inbox</span>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 text-sm">
            Failed to loading conversations. <br />
            <button onClick={refetch} className="mt-2 text-blue-500 underline">Try again</button>
          </div>
        ) : filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`p-4 cursor-pointer transition-all border-b flex items-start gap-3 relative overflow-hidden ${
                DarkMode ? "border-slate-800/50" : "border-slate-50"
              } ${
                activeSessionId === session.id
                  ? (DarkMode ? "bg-blue-600/10" : "bg-blue-50")
                  : (DarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50")
              }`}
            >
              {/* Active Indicator Bar */}
              {activeSessionId === session.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 animate-in slide-in-from-left duration-300" />
              )}

              <div className={`p-2 rounded-full flex-shrink-0 ${
                activeSessionId === session.id 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : (DarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")
              }`}>
                <User size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className={`font-bold text-sm truncate ${
                    activeSessionId === session.id ? "text-blue-600 dark:text-blue-400" : ""
                  }`}>
                    Visitor {session.id.slice(0, 8)}
                  </h3>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-2 whitespace-nowrap">
  {session.updated_at ? formatDistanceToNow(new Date(session.updated_at), { 
      addSuffix: true // This adds the word "ago" or "in"
  }) : "Just now"}
</span>
                </div>
                <p className={`text-xs truncate ${
                  activeSessionId === session.id 
                    ? (DarkMode ? "text-slate-200" : "text-slate-900 font-medium") 
                    : "text-slate-500"
                }`}>
                  {session.last_message || "New chat started"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center opacity-40">
            <MessageSquare size={40} className="mx-auto mb-3" />
            <p className="text-sm">No results match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}