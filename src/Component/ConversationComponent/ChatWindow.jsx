import React, { useEffect, useRef, useState } from "react";

import { Send, Loader2, AlertCircle, ChevronLeft } from "lucide-react";

import { useSelector } from "react-redux";

import MessageBubble from "./MessageBubble";

import { useGetChatHistoryQuery, useSendAdminMessageMutation } from "../../Redux/Conversation";



export default function ChatWindow({ sessionId, onBack }) {

  const { DarkMode } = useSelector((state) => state.webState);

  const scrollRef = useRef(null);

  const [input, setInput] = useState("");



  const { data: rawMessages = [], isLoading, error } = useGetChatHistoryQuery(sessionId, { skip: !sessionId });

  const [sendAdminMessage, { isLoading: isSending }] = useSendAdminMessageMutation();



  const handleSend = async () => {

    if (!input.trim() || isSending) return;

    try {

      await sendAdminMessage({ sessionId, text: input }).unwrap();

      setInput("");

    } catch (err) {

      console.error("Send failed:", err);

    }

  };



  useEffect(() => {

    scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [rawMessages]);
  useEffect(()=>{

  console.log(rawMessages)
  },[rawMessages])



  return (

    <div className={`flex-1 flex flex-col h-full ${DarkMode ? "bg-slate-900" : "bg-slate-50"}`}>

   {/* 1. Chat Header */}

      <div className={`p-4 border-b flex items-center justify-between sticky top-0 z-10 transition-colors ${

        DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"

      }`}>

        <div className="flex items-center gap-3">

          <button onClick={onBack} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">

            <ChevronLeft size={20} />

          </button>

          

          <div className="relative">

            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">

              {sessionId?.slice(0, 1).toUpperCase() || 'V'}

            </div>

        

          </div>



          <div>

            <h2 className={`font-bold text-sm ${DarkMode ? "text-slate-100" : "text-slate-800"}`}>

              Visitor {sessionId?.slice(0, 8)}

            </h2>

           

          </div>

        </div>

        

        

      </div>



      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">

        {isLoading ? <Loader2 className="animate-spin m-auto" /> : 

         rawMessages.map((msg, i) => (

          <MessageBubble 

            key={msg.id || i} 

            messageId={msg.id} // Pass ID for editing

            sessionId={sessionId}

            text={msg.text} 

            sender={msg.role === 'visitor' ? 'user' : 'agent'} 

            audio={msg.audio}

            timestamp={msg.created_at}

          />

        ))}

        <div ref={scrollRef} />

      </div>



      <div className={`p-4 border-t ${DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>

        <div className={`flex items-center gap-2 p-1.5 rounded-2xl border ${DarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>

          <input

            value={input}

            onChange={(e) => setInput(e.target.value)}

            onKeyDown={(e) => e.key === 'Enter' && handleSend()}

            placeholder="Type a correction..."

            className="flex-1 bg-transparent p-2 text-sm outline-none"

          />

          <button 

            onClick={handleSend}

            disabled={!input.trim() || isSending}

            className={`p-2.5 rounded-xl text-white transition-all ${!input.trim() || isSending ? "bg-slate-400" : "bg-blue-600 shadow-lg shadow-blue-500/20"}`}

          >

            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}

          </button>

        </div>

      </div>

    </div>

  );

}