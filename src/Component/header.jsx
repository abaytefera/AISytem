import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToggleDarkMode } from '../Redux/WebState';
import { Bell, Moon, Sun } from 'lucide-react';

const Header = () => {
  const { DarkMode } = useSelector((state) => state.webState);
  const {user}=useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleThemeToggle = () => {
    dispatch(ToggleDarkMode());
  };

  return (
    <header className={`sticky top-0 shadow-md  z-40 backdrop-blur-md max-md:py-8 px-8 py-3 flex justify-between items-center transition-colors duration-300 ${
      DarkMode ? "bg-slate-900/80 " : "bg-white/60 "
    }`}>
      <h2 className={`font-semibold max-md:hidden text-lg ${DarkMode ? "text-white" : "text-slate-800"}`}>
        System Overview
      </h2>
     
      
      <div className="flex max-md:absolute max-md:right-0 items-center gap-6">
        {/* Theme Toggle Button */}
        <button 
          onClick={handleThemeToggle} 
          className={`p-2 rounded-lg transition-all ${
            DarkMode 
              ? "text-slate-400 hover:text-amber-400 hover:bg-slate-800" 
              : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
          }`}
          title={DarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {DarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className={`relative p-2 rounded-lg transition-colors ${DarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}>
          <Bell size={20} />
          <span className={`absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 ${
            DarkMode ? "border-slate-900" : "border-white"
          }`}></span>
        </button>

        {/* User Profile Section */}
        <div className={`flex items-center gap-3 pl-4 border-l transition-colors ${
          DarkMode ? "border-slate-800" : "border-slate-200"
        }`}>
          <div className="text-right">
            <p className={`text-sm font-medium ${DarkMode ? "text-white" : "text-slate-900"}`}>
             {user?.fullname || user?.email}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">{user?.role}</p>
          </div>
         <div className="w-9 h-9 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-transparent hover:ring-indigo-500 transition-all cursor-pointer flex items-center justify-center font-bold text-xs text-white uppercase">
   {/* Use (0, 1) with a comma. toUpperCase() makes it look like a proper avatar icon */}
   {user?.fullName?.slice(0, 1) || user?.email?.slice(0, 1) || "U"}
</div>
        </div>
      </div>
    </header>
  )
}

export default Header