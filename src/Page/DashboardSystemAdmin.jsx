import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X } from "lucide-react";
import { logout } from "../Redux/auth";

// Components
import StatCard from "../Component/DashboardSystemComponet/StatCard";
import Sidebar from "../Component/SideBar";
import UptimeChart from "../Component/DashboardSystemComponet/UptimeChart";
import TrafficChart from "../Component/DashboardSystemComponet/TrafficChart";
import StatusChart from "../Component/DashboardSystemComponet/StatusChart";

import Header from "../Component/header";

export default function DashboardSystem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthenticate, isLoading } = useSelector((state) => state.auth);
  const { DarkMode } = useSelector((state) => state.webState);

  useEffect(() => {
    if (!isLoading && !isAuthenticate) {
      navigate('/');
    }
  }, [isAuthenticate, isLoading, navigate]);

  const onLogout = () => {
    dispatch(logout());
  };

  if (isLoading || !isAuthenticate) {
    return null; 
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${
      DarkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* 1. SIDEBAR: Desktop (Hidden borders/bg for unified look) */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
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
        
        {/* 2. HEADER: Floating/Integrated style */}
        <div className="flex items-center w-full sticky top-0 z-40 bg-inherit">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="ml-4 p-2 lg:hidden hover:bg-slate-500/10 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <Header />
          </div>
        </div>

        {/* 3. MAIN CONTENT: System Dashboard Grid */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* Title Section for Unified Look */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Infrastructure</h1>
              <p className={`text-xs md:text-sm mt-1 ${DarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Global health monitoring and resource allocation.
              </p>
            </div>

            {/* 1. Metric Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Registered Companies" value="145" />
              <StatCard title="Total Admins" value="320" />
              <StatCard title="Active Servers" value="24" />
            </div>

            {/* 2. Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UptimeChart />
              <TrafficChart />
            </div>

            {/* 3. System Health Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                 <StatusChart />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}