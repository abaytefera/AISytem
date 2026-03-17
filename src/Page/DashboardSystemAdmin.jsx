import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, RefreshCcw } from "lucide-react";
import { logout } from "../Redux/auth";

import { useGetSystemStatsQuery } from "../Redux/dashboard";

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

  // RTK Query Hook
  const { data, isLoading, isError, refetch, isFetching } = useGetSystemStatsQuery();

  const { isAuthenticate, isLoading: authLoading } = useSelector((state) => state.auth);
  const { DarkMode } = useSelector((state) => state.webState);

  useEffect(() => {
    if (!authLoading && !isAuthenticate) {
      navigate('/');
    }
  }, [isAuthenticate, authLoading, navigate]);

  const onLogout = () => {
    dispatch(logout());
  };

  if (authLoading || isLoading) {
    return (
      <div className={`h-screen flex flex-col items-center justify-center ${DarkMode ? "bg-slate-950 text-white" : "bg-slate-50"}`}>
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium animate-pulse">Syncing System Data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-bold">Failed to connect to system infrastructure.</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Retry Connection</button>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${
      DarkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <Sidebar onLogout={onLogout} />
      </aside>

      {/* MOBILE SIDEBAR */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-64 transform transition-transform duration-300 lg:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } ${DarkMode ? "bg-slate-900 shadow-2xl" : "bg-white shadow-2xl"}`}>
        <Sidebar onLogout={onLogout} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center w-full sticky top-0 z-40 bg-inherit">
          <button onClick={() => setIsMobileMenuOpen(true)} className="ml-4 p-2 lg:hidden hover:bg-slate-500/10 rounded-xl">
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <Header />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Infrastructure</h1>
                <p className={`text-xs md:text-sm mt-1 ${DarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Global health monitoring and resource allocation.
                </p>
              </div>
              <button 
                onClick={() => refetch()} 
                disabled={isFetching}
                className="p-2 rounded-full hover:bg-indigo-500/10 text-indigo-500 transition-all flex items-center gap-2"
              >
                <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />
                <span className="text-xs font-bold uppercase hidden md:inline">Live Sync</span>
              </button>
            </div>

            {/* 1. Metric Overview - Dynamic Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Registered Companies" value={data?.metrics?.companies || 0} />
              <StatCard title="Total Admins" value={data?.metrics?.admins || 0} />
              <StatCard title="Active Servers" value={data?.metrics?.servers || 0} trend="Stable" description="No downtime reported" />
            </div>

            {/* 2. Analytics Section - Passing Data to Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UptimeChart data={data?.uptime} />
              <TrafficChart data={data?.traffic} />
            </div>

            {/* 3. System Health Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                 <StatusChart data={data?.status} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}