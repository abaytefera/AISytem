import React, { useEffect, useState } from "react";
import { Menu, Loader2, AlertCircle } from "lucide-react";
import Sidebar from "../Component/SideBar";
import LiveChatOverview from "../Component/DashboardCompany admin/LiveChatOverview";
import CustomerSentiment from "../Component/DashboardCompany admin/SentimentChart";
import ConversationChart from "../Component/DashboardCompany admin/ConversationChart";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../Redux/auth";
import Header from "../Component/header";

// Import the new API hook

import { useGetDashboardDataQuery } from "../Redux/dashboard";
const DashboardCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { DarkMode } = useSelector((state) => state.webState);
  const { isAuthenticate } = useSelector((state) => state.auth);

  // 1. Fetch live analytics with 30s polling
  const { data: stats, isLoading, error, refetch } = useGetDashboardDataQuery(undefined, {
    skip: !isAuthenticate,
    pollingInterval: 30000, 
  });

  useEffect(() => {
    if (!isAuthenticate) navigate('/');
  }, [isAuthenticate, navigate]);

  const onLogout = () => dispatch(logout());

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
      DarkMode ? "bg-slate-900 text-slate-200" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* SIDEBARS (Logic same as your original) */}
      <aside className="w-64 flex-shrink-0 hidden lg:block border-r border-slate-200 dark:border-slate-800">
        <Sidebar onLogout={onLogout} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center w-full sticky top-0 z-40 bg-inherit border-b border-slate-200 dark:border-slate-800">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-4 lg:hidden hover:bg-slate-500/10 transition-colors">
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <Header />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-sm text-slate-500 font-medium">Analyzing company data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertCircle className="text-red-500 mb-2" size={48} />
              <p className="text-slate-500">Failed to load analytics.</p>
              <button onClick={refetch} className="mt-4 text-blue-600 text-sm font-bold">Try Again</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
              
              {/* Pass the dynamic data as props */}
              <LiveChatOverview recentChats={stats?.recent} />
              <CustomerSentiment sentimentData={stats?.sentiment} />
              
              <div className="xl:col-span-2">
                <ConversationChart chartData={stats?.volume} />
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardCompany;