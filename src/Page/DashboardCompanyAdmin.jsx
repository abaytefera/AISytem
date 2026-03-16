import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "../Component/SideBar";
import LiveChatOverview from "../Component/DashboardCompany admin/LiveChatOverview";
import CustomerSentiment from "../Component/DashboardCompany admin/SentimentChart";
import ConversationChart from "../Component/DashboardCompany admin/ConversationChart";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../Redux/auth";
import Header from "../Component/header";

const DashboardCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { DarkMode } = useSelector((state) => state.webState);
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
      
      {/* 1. SIDEBAR: Same 64-width as original on PC */}
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

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* 2. HEADER: Integrated Mobile Toggle */}
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

        {/* 3. MAIN CONTENT: Grid structure matches your original on PC */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-y-6 gap-x-20 w-full">
            
            {/* These items will sit 2-per-row on PC, 1-per-row on Mobile */}
            <LiveChatOverview />
            <CustomerSentiment />
            <ConversationChart />
            
            {/* If you add a 4th component here, it will fill the empty spot on PC */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardCompany;