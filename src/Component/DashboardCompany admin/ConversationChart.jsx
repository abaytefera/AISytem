import React from "react";
import { useSelector } from "react-redux";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const ConversationChart = ({ chartData = [] }) => {
  const { DarkMode } = useSelector((state) => state.webState);

  // Dynamic theme colors for the SVG chart
  const themeColors = {
    grid: DarkMode ? "#1e293b" : "#f1f5f9",
    text: DarkMode ? "#94a3b8" : "#64748b",
    tooltipBg: DarkMode ? "#0f172a" : "#ffffff",
    tooltipBorder: DarkMode ? "#1e293b" : "#e2e8f0",
    dotStroke: DarkMode ? "#0f172a" : "#ffffff",
    cursor: DarkMode ? "#334155" : "#cbd5e1",
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg w-full border transition-all duration-300 ${
      DarkMode 
        ? "bg-slate-900 border-slate-800" 
        : "bg-white border-slate-200"
    }`}>
      {/* Chart Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className={`font-bold text-lg tracking-tight ${
            DarkMode ? "text-slate-100" : "text-slate-800"
          }`}>
            Conversation Volume
          </h2>
          <p className="text-xs text-slate-500 font-medium">Weekly traffic overview</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-emerald-500 text-sm font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
            +12.5%
          </span>
          <p className="text-[10px] text-slate-400 uppercase mt-1 font-bold">vs last week</p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* FIXED: Use standard lowercase SVG tags here. 
               Recharts doesn't export these as React Components.
            */}
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={themeColors.grid} 
              vertical={false} 
            />
            
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: themeColors.text, fontSize: 11, fontWeight: 500 }} 
              dy={15}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: themeColors.text, fontSize: 11, fontWeight: 500 }} 
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: themeColors.tooltipBg, 
                border: `1px solid ${themeColors.tooltipBorder}`, 
                borderRadius: '12px',
                fontSize: '12px',
                color: DarkMode ? "#f8fafc" : "#1e293b",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
              cursor={{ stroke: themeColors.cursor, strokeWidth: 2 }}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)" // Matches the ID in <defs>
              dot={{ 
                fill: '#6366f1', 
                strokeWidth: 2, 
                r: 4, 
                stroke: themeColors.dotStroke 
              }}
              activeDot={{ 
                r: 6, 
                strokeWidth: 0,
                fill: '#4f46e5'
              }}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConversationChart;