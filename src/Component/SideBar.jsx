import React, { useEffect } from "react";
import { 
  LayoutDashboard, Users, ShieldCheck, Code2, Database, 
  Settings, LogOut, Plus, MessageSquare, BookOpen, Bot, BarChart2 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get Global State
  const { isAuthenticate, isLoading, user } = useSelector((state) => state.auth);
  const { DarkMode } = useSelector((state) => state.webState);

  // 2. Role logic (assuming your Redux user object has a role property)
  const role = user?.role || "SYSTEM_ADMIN"; 
  const isSystemAdmin = role === "SYSTEM_ADMIN";

  useEffect(() => {
    if (!isLoading && !isAuthenticate) {
      navigate('/');
    }
  }, [isAuthenticate, isLoading, navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  // 3. Theme & Config Mapping
  const config = {
    bgColor: DarkMode ? (isSystemAdmin ? "bg-slate-950" : "bg-slate-900") : "bg-white",
    borderColor: DarkMode ? "border-slate-800" : "border-slate-200",
    accentColor: isSystemAdmin ? "blue" : "blue",
    title: isSystemAdmin ? "System Admin" : "Company Admin",
    shortName: isSystemAdmin ? "SA" : "CA",
    logoBg: isSystemAdmin ? "bg-blue-600" : "bg-blue-600"
  };

  // Helper to check if link is active based on current URL
  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`flex flex-col w-64 h-screen border-r transition-colors duration-500 ${config.bgColor} ${config.borderColor}`}>
      
      {/* BRANDING SECTION */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className={`${config.logoBg} w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20`}>
            {isSystemAdmin ? (
              <ShieldCheck className="text-white w-5 h-5" />
            ) : (
              <span className="text-xs font-black text-white">{config.shortName}</span>
            )}
          </div>
          <h2 className={`text-lg font-bold tracking-tight ${DarkMode ? "text-white" : "text-slate-900"}`}>
            {config.title}
          </h2>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        
        {isSystemAdmin ? (
          /* --- SYSTEM ADMIN LINKS --- */
          <>
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Main Menu</p>
             <Link to="/wwsssssssssssdkakkaksdnsndjsd">
              <NavItem 
                icon={<LayoutDashboard size={18} />} 
                label="Dashboard" 
                active={isActive('/wwsssssssssssdkakkaksdnsndjsd')} 
                darkMode={DarkMode} 
                accent={config.accentColor} 
              />
            </Link>
           
            <Link to="/wedjdjkdjskadjjcbcnxskkkkkkkkdjskd">
              <NavItem 
                icon={<Users size={18} />} 
                label="User Management" 
                active={isActive('/wedjdjkdjskadjjcbcnxskkkkkkkkdjskd')} 
                darkMode={DarkMode} 
                accent={config.accentColor} 
              />
            </Link>
            <Link to="/weijsksskskkxkdkdksalaskdkjdkasjd">
              <NavItem 
                icon={<Plus size={18} />} 
                label="Company Registry" 
                active={isActive('/weijsksskskkxkdkdksalaskdkjdkasjd')} 
                darkMode={DarkMode} 
                accent={config.accentColor} 
              />
            </Link>

            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-6 mb-2">Infrastructure</p>
            <NavItem icon={<ShieldCheck size={18} />} label="Security" darkMode={DarkMode} accent={config.accentColor} />
            <NavItem icon={<Code2 size={18} />} label="API Keys" darkMode={DarkMode} accent={config.accentColor} />
            <NavItem icon={<Database size={18} />} label="System Logs" darkMode={DarkMode} accent={config.accentColor} />
          </>
        ) : (
          /* --- COMPANY ADMIN LINKS --- */
          <>
             <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Main Menu</p>
             <Link to="/wwsssssssssssdkakkaksdnsndjsd">
              <NavItem 
                icon={<LayoutDashboard size={18} />} 
                label="Dashboard" 
                active={isActive('/wwsssssssssssdkakkaksdnsndjsd')} 
                darkMode={DarkMode} 
                accent={config.accentColor} 
              />
            </Link>
            

          <Link to={"/wedjfheijsjdjksjslakadnjfnjdndjddssd"}>
            <NavItem 
            icon={<MessageSquare size={18} />} 
            label="Conversations" 
            darkMode={DarkMode}
             accent={config.accentColor} />

             </Link>
            <Link to="/wecfjjjjjjjjjjjjslakadnjfnjdndjddssd">
              <NavItem 
                icon={<BookOpen size={18} />} 
                label="Knowledge Base" 
                active={isActive('/wecfjjjjjjjjjjjjslakadnjfnjdndjddssd')} 
                darkMode={DarkMode} 
                accent={config.accentColor} 
              />
            </Link>

            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-6 mb-2">Analytics</p>
            <NavItem icon={<Bot size={18} />} label="Automation" darkMode={DarkMode} accent={config.accentColor} />
            <NavItem icon={<BarChart2 size={18} />} label="Performance" darkMode={DarkMode} accent={config.accentColor} />
          </>
        )}
      </nav>

      {/* FOOTER SECTION */}
      <div className={`p-4 border-t ${config.borderColor}`}>
        <NavItem icon={<Settings size={18} />} label="Settings" darkMode={DarkMode} accent={config.accentColor} />
        <div onClick={handleLogout} className="mt-1">
          <NavItem icon={<LogOut size={18} />} label="Logout" isLogout darkMode={DarkMode} accent={config.accentColor} />
        </div> 
      </div>
    </aside>
  );
}

/**
 * NavItem: The individual link component
 * Handles hover, active, and role-based accent colors
 */
function NavItem({ icon, label, active = false, darkMode, accent, isLogout = false }) {
  // Dynamic color generation based on role accent (blue/indigo)
  const colors = {
    activeBg: darkMode ? "bg-slate-800/60 text-white" : `bg-${accent}-50 text-${accent}-700`,
    activeIcon: darkMode ? `text-${accent}-400` : `text-${accent}-600`,
    hover: isLogout 
      ? "hover:bg-rose-500/10 hover:text-rose-500 text-slate-500" 
      : (darkMode 
          ? "hover:bg-slate-800/40 hover:text-white text-slate-400" 
          : `hover:bg-gray-100 hover:text-${accent}-700 text-slate-500`)
  };

  return (
    <div className={`
      relative flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 group
      ${active ? colors.activeBg : colors.hover}
    `}>
      {/* Active Indicator Line */}
      {active && (
        <div className={`absolute left-0 w-1.5 h-6 rounded-r-full bg-${accent}-500 shadow-[4px_0_12px_rgba(59,130,246,0.5)]`} />
      )}

      {/* Icon */}
      <span className={`transition-transform duration-300 group-hover:scale-110 ${active ? colors.activeIcon : "text-current"}`}>
        {icon}
      </span>

      {/* Label */}
      <span className={`text-sm font-bold tracking-tight ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
        {label}
      </span>
    </div>
  );
}