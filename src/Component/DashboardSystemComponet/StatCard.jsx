import { TrendingUp, ArrowUpRight, Minus } from "lucide-react";
import { useSelector } from "react-redux";

export default function StatCard({ 
  title, 
  value, 
  trend = "0%", 
  description = "vs previous period",
  isPositive = true // New prop to handle negative trends (e.g., server downtime)
}) {
  const { DarkMode } = useSelector((state) => state.webState);

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 group ${
      DarkMode 
        ? "bg-slate-900 border-slate-800 hover:border-slate-700 shadow-none" 
        : "bg-white border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md"
    }`}>
      <div className="flex justify-between items-start mb-4">
        {/* Title & Value */}
        <div className="space-y-1">
          <p className={`text-xs font-semibold uppercase tracking-wider ${
            DarkMode ? "text-slate-500" : "text-slate-400"
          }`}>
            {title}
          </p>
          <h3 className={`text-3xl font-bold tracking-tight ${
            DarkMode ? "text-white" : "text-slate-900"
          }`}>
            {value?.toLocaleString() || 0}
          </h3>
        </div>
        
        {/* Decorative Icon */}
        <div className={`p-2 rounded-lg transition-colors ${
          DarkMode 
            ? "bg-slate-800 text-slate-500 group-hover:bg-blue-600/20 group-hover:text-blue-400" 
            : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
        }`}>
          <ArrowUpRight size={20} />
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center gap-2">
        <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
          isPositive 
            ? (DarkMode ? "text-emerald-400 bg-emerald-400/10" : "text-emerald-600 bg-emerald-50")
            : (DarkMode ? "text-rose-400 bg-rose-400/10" : "text-rose-600 bg-rose-50")
        }`}>
          {trend !== "0%" ? (
            <TrendingUp size={12} className={`mr-1 ${!isPositive && "rotate-180"}`} />
          ) : (
            <Minus size={12} className="mr-1" />
          )}
          {trend}
        </span>
        <span className={`text-xs italic ${
          DarkMode ? "text-slate-500" : "text-slate-400"
        }`}>
          {description}
        </span>
      </div>
    </div>
  );
}