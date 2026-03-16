import React from "react";
import { useSelector } from "react-redux"; // Added
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", value: 5 },
  { day: "Tue", value: 8 },
  { day: "Wed", value: 12 },
  { day: "Thu", value: 10 },
  { day: "Fri", value: 18 },
  { day: "Sat", value: 25 },
  { day: "Sun", value: 21 },
];

const ConversationChart = () => {
  // 1. Access the global theme state
  const { DarkMode } = useSelector((state) => state.webState);

  // 2. Define dynamic colors for Recharts SVG elements
  const themeColors = {
    grid: DarkMode ? "#1e293b" : "#e2e8f0",
    text: DarkMode ? "#64748b" : "#94a3b8",
    tooltipBg: DarkMode ? "#0f172a" : "#ffffff",
    tooltipBorder: DarkMode ? "#1e293b" : "#e2e8f0",
    dotStroke: DarkMode ? "#0f172a" : "#ffffff",
    cursor: DarkMode ? "#334155" : "#cbd5e1",
  };

  return (
    <div className={`p-6 rounded-xl shadow-xl w-full border transition-all duration-300 ${
      DarkMode 
        ? "bg-slate-900 border-slate-800" 
        : "bg-white border-slate-200"
    }`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`font-semibold tracking-tight ${
            DarkMode ? "text-slate-100" : "text-slate-800"
          }`}>
            Conversation Volume
          </h2>
          <p className="text-xs text-slate-500">Weekly traffic overview</p>
        </div>
        <div className="text-right">
          <span className="text-emerald-500 text-sm font-bold">+12.5%</span>
          <p className="text-[10px] text-slate-500 uppercase">vs last week</p>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={themeColors.grid} 
              vertical={false} 
            />
            
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: themeColors.text, fontSize: 12 }} 
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: themeColors.text, fontSize: 12 }} 
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: themeColors.tooltipBg, 
                border: `1px solid ${themeColors.tooltipBorder}`, 
                borderRadius: '8px',
                fontSize: '12px',
                color: DarkMode ? "#f8fafc" : "#1e293b",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: '#6366f1' }}
              cursor={{ stroke: themeColors.cursor, strokeWidth: 2 }}
            />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0d34be"
              strokeWidth={3}
              // Dot stroke matches the background color to create a "gap" effect
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: themeColors.dotStroke }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConversationChart;