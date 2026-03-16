import React, { useState } from "react";
// FIXED: Added Loader2, Play, Pause, Volume2 to imports to prevent "undefined" error
import { Edit2, Check, X, CheckCheck, Loader2, Play, Pause, Volume2 } from "lucide-react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useEditMessageMutation } from "../../Redux/Conversation";

export default function MessageBubble({ messageId, sessionId, text, sender, audio, timestamp }) {
  const { DarkMode } = useSelector((state) => state.webState);
  const isUser = sender === "user";
  
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  const [editMessage, { isLoading: isUpdating }] = useEditMessageMutation();

  const handleUpdate = async () => {
    try {
      await editMessage({ messageId, newText, sessionId }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update message:", err);
      alert("Error: Could not connect to server.");
    }
  };

  const formattedTime = timestamp ? format(new Date(timestamp), "p") : "Just now";

  return (
    <div className={`flex w-full group mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        
        <div className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : DarkMode
            ? "bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none"
            : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
        }`}>
          
          {isEditing ? (
            <div className="flex flex-col gap-2 min-w-[220px]">
              <textarea 
                className="w-full bg-slate-50 dark:bg-slate-900 p-2 text-sm rounded border border-blue-400 outline-none text-slate-900 dark:text-slate-100" 
                value={newText} 
                onChange={(e) => setNewText(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditing(false)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={14} /></button>
                <button onClick={handleUpdate} disabled={isUpdating} className="p-1 text-green-600 hover:bg-green-50 rounded">
                  {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Audio Support */}
              {audio && (
                <div className="mb-2 flex items-center gap-2 p-2 bg-black/5 rounded-lg">
                  <audio ref={audioRef} src={audio} onEnded={() => setIsPlaying(false)} className="hidden" />
                  <button 
                    onClick={() => {
                        if(isPlaying) audioRef.current.pause();
                        else audioRef.current.play();
                        setIsPlaying(!isPlaying);
                    }}
                    className="p-1.5 bg-blue-500 text-white rounded-full"
                  >
                    {isPlaying ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor" />}
                  </button>
                  <div className="text-[10px] opacity-70">Voice Response</div>
                </div>
              )}

              <p className="text-[13.5px] leading-relaxed">{text}</p>
              
              {/* Edit Trigger - Only for AI/Agent messages */}
              {!isUser && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-1 px-1">
          <span className="text-[10px] text-slate-400 font-medium">{formattedTime}</span>
          {isUser && <CheckCheck size={12} className="text-blue-500" />}
        </div>
      </div>
    </div>
  );
}