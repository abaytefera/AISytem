import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

export default function TrafficChart({ data }) {
  const { DarkMode } = useSelector((state) => state.webState);

  // Fallback data structure to prevent layout shift during load
  const chartData = data || [
    { name: "Mon", traffic: 0 },
    { name: "Tue", traffic: 0 },
    { name: "Wed", traffic: 0 },
    { name: "Thu", traffic: 0 },
    { name: "Fri", traffic: 0 },
    { name: "Sat", traffic: 0 },
    { name: "Sun", traffic: 0 },
  ];

  // Calculate total sessions for the header summary
  const totalTraffic = data 
    ? data.reduce((acc, curr) => acc + curr.traffic, 0).toLocaleString() 
    : "0";

  return (
    <div className={`border rounded-2xl p-6 h-80 transition-all duration-300 flex flex-col ${
      DarkMode 
        ? "bg-slate-900 border-slate-800 shadow-none" 
        : "bg-white border-slate-200 shadow-sm"
    }`}>
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-semibold text-lg tracking-tight ${DarkMode ? "text-slate-100" : "text-slate-800"}`}>
            Network Traffic
          </h3>
          <p className="text-slate-500 text-xs font-medium">
            Total Sessions: <span className="font-bold text-emerald-500">{totalTraffic}</span>
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={`text-xs font-bold uppercase tracking-widest ${DarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Live
          </span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={DarkMode ? 1 : 0.8} />
                <stop offset="100%" stopColor="#059669" stopOpacity={DarkMode ? 0.6 : 0.4} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={DarkMode ? "#1e293b" : "#f1f5f9"} 
            />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: DarkMode ? '#64748b' : '#94a3b8', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: DarkMode ? '#64748b' : '#94a3b8', fontSize: 11, fontWeight: 500 }} 
            />
            
            <Tooltip 
              cursor={{ fill: DarkMode ? '#1e293b' : '#f8fafc', radius: 4 }}
              contentStyle={{ 
                backgroundColor: DarkMode ? '#0f172a' : '#ffffff', 
                border: DarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: DarkMode ? '#10b981' : '#059669' }}
              formatter={(value) => [value, "Sessions"]}
            />
            
            <Bar 
              dataKey="traffic" 
              fill="url(#barGradient)" 
              radius={[6, 6, 0, 0]} 
              barSize={28}
              animationBegin={200}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}