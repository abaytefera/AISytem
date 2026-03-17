import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bot, Menu } from "lucide-react";
import Sidebar from '../Component/SideBar';
import ChatList from "../Component/ConversationComponent/ChatList";
import ChatWindow from "../Component/ConversationComponent/ChatWindow";
import Header from "../Component/header";
import { logout } from "../Redux/auth";
import { useNavigate,useLocation } from "react-router-dom";

export default function Conversations() {
  const dispatch = useDispatch();
  const { DarkMode } = useSelector((state) => state.webState);
  const navigate = useNavigate();
  const location=useLocation()
  const id=location.state?.id

  useEffect(()=>{
    console.log("what is id")
    console.log(id)
 if(id){
  setSelectedSessionId(id)
 }
  },[id])
  // State to track which visitor chat is currently open
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const { isAuthenticate } = useSelector((state) => state.auth);
   useEffect(() => {
      if (!isAuthenticate) {
        navigate('/');
      }
    }, [isAuthenticate, navigate]);
  
    const onLogout = () => {
      dispatch(logout());
    };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
      DarkMode ? "bg-slate-900 text-slate-200" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* 1. SIDEBAR (Desktop) */}
      <aside className="w-64 flex-shrink-0 hidden lg:block border-r border-slate-200 dark:border-slate-800">
        <Sidebar onLogout={onLogout} />
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-64 transform transition-transform duration-300 lg:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } ${DarkMode ? "bg-slate-900 shadow-2xl" : "bg-white shadow-2xl"}`}>
        <Sidebar onLogout={onLogout} />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center w-full sticky top-0 z-40 bg-inherit border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-4 lg:hidden hover:bg-slate-500/10 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <Header />
          </div>
        </div>

        {/* 2. CHAT INTERFACE: This is the core of the Conversations page */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* Column 1: List of all visitor sessions */}
          <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r ${
            DarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-100 bg-white"
          } ${selectedSessionId ? "hidden md:flex" : "flex"} flex-col`}>
            <ChatList 
              onSelectSession={setSelectedSessionId} 
              activeSessionId={selectedSessionId} 
            />
          </div>

          {/* Column 2: The Chat Window (Messages) */}
          <div className={`flex-1 ${ DarkMode ? " bg-slate-900/50" : " bg-white"} flex flex-col min-w-0 ${
            !selectedSessionId ? "hidden md:flex items-center justify-center bg-slate-50 dark:bg-slate-900/30" : "flex"
          }`}>
            {selectedSessionId ? (
              <ChatWindow 
                sessionId={selectedSessionId} 
                onBack={() => setSelectedSessionId(null)} // Mobile "Go Back"
              />
            ) : (
              <div className={`text-center ${ DarkMode ? " bg-slate-900/50" : " bg-white"} p-8`}>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot size={32} />
                </div>
                <h3 className="text-lg font-semibold">Select a conversation</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
                  Choose a visitor from the left to view their interaction history with the AI.
                </p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}