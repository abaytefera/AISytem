import React from "react";
import { useSelector } from "react-redux"; // Added
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Positive", value: 60 },
  { name: "Neutral", value: 30 },
  { name: "Negative", value: 10 },
];

const COLORS = ["#10b981", "#f59e0b", "#f43f5e"];

const CustomerSentiment = () => {
  // 1. Pull DarkMode from Redux
  const { DarkMode } = useSelector((state) => state.webState);

  return (
    <div className={`p-6 rounded-xl shadow-lg w-full max-w-sm border transition-all duration-300 ${
      DarkMode 
        ? "bg-slate-900 border-slate-800" 
        : "bg-white border-slate-200"
    }`}>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className={`font-semibold tracking-tight ${
          DarkMode ? "text-slate-100" : "text-slate-800"
        }`}>
          Customer Sentiment
        </h2>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          DarkMode ? "text-slate-400 bg-slate-800" : "text-slate-500 bg-slate-100"
        }`}>
          Real-time
        </span>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            
            {/* 2. Dynamic Tooltip Styling */}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: DarkMode ? '#1e293b' : '#ffffff', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                color: DarkMode ? '#f8fafc' : '#1e293b' 
              }}
              itemStyle={{ color: DarkMode ? '#f8fafc' : '#1e293b' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className={`mt-4 flex justify-between text-xs font-medium ${
        DarkMode ? "text-slate-400" : "text-slate-500"
      }`}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" /> Positive
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" /> Neutral
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500" /> Negative
        </div>
      </div>
    </div>
  );
};

export default CustomerSentiment;