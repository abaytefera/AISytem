import React from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  Positive: "#10b981", // Emerald-500
  Neutral: "#f59e0b",  // Amber-500
  Negative: "#f43f5e", // Rose-500
  Unknown: "#94a3b8"   // Slate-400
};

const CustomerSentiment = ({ sentimentData = [] }) => {
  const { DarkMode } = useSelector((state) => state.webState);

  // Calculate total for percentage display if needed
  const total = sentimentData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className={`p-6 rounded-xl shadow-lg w-full border transition-all duration-300 ${
      DarkMode 
        ? "bg-slate-900 border-slate-800" 
        : "bg-white border-slate-200"
    }`}>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`font-semibold tracking-tight ${
            DarkMode ? "text-slate-100" : "text-slate-800"
          }`}>
            Customer Sentiment
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Analysis of {total} interactions</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${
          DarkMode ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-600 bg-emerald-50"
        }`}>
          Real-time
        </span>
      </div>

      <div className="h-[200px] w-full relative">
        {/* Center Label for Donut Chart */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-2xl font-bold ${DarkMode ? "text-white" : "text-slate-800"}`}>
            {sentimentData.find(d => d.name === "Positive")?.value || 0}
          </span>
          <span className="text-[10px] text-slate-500 uppercase">Positive</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sentimentData.length > 0 ? sentimentData : [{ name: 'Unknown', value: 1 }]}
              innerRadius={65}
              outerRadius={85}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1200}
            >
              {sentimentData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name] || COLORS.Unknown} 
                  className="outline-none"
                />
              ))}
            </Pie>
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: DarkMode ? '#1e293b' : '#ffffff', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                fontSize: '12px'
              }}
              itemStyle={{ color: DarkMode ? '#f8fafc' : '#1e293b', fontWeight: 'bold' }}
              cursor={{ fill: 'transparent' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Legend */}
      <div className={`mt-6 grid grid-cols-3 gap-2 text-[11px] font-semibold ${
        DarkMode ? "text-slate-400" : "text-slate-500"
      }`}>
        {Object.keys(COLORS).filter(k => k !== 'Unknown').map((label) => (
          <div key={label} className="flex items-center gap-1.5 justify-center">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[label] }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerSentiment;