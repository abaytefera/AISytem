import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const uptimeData = [
  { name: "00:00", uptime: 99.1 },
  { name: "04:00", uptime: 99.5 },
  { name: "08:00", uptime: 98.2 },
  { name: "12:00", uptime: 99.9 },
  { name: "16:00", uptime: 99.4 },
  { name: "20:00", uptime: 99.8 },
  { name: "23:59", uptime: 99.7 },
];

export default function UptimeChart() {
  const { DarkMode } = useSelector((state) => state.webState);

  return (
    <div className={`border rounded-2xl p-6 h-80 transition-all duration-300 ${
      DarkMode 
        ? "bg-slate-900 border-slate-800 shadow-none" 
        : "bg-white border-slate-200 shadow-sm"
    }`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className={`font-semibold text-lg tracking-tight ${DarkMode ? "text-slate-100" : "text-slate-800"}`}>
            Server Uptime
          </h3>
          <p className="text-slate-500 text-xs">Availability over the last 24h</p>
        </div>
        <div className="text-right">
          <span className={`font-mono text-lg font-bold ${DarkMode ? "text-blue-400" : "text-blue-600"}`}>
            99.98%
          </span>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Average</p>
        </div>
      </div>

      <div className="flex-1 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={uptimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={DarkMode ? 0.3 : 0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
              tick={{ fill: DarkMode ? '#64748b' : '#94a3b8', fontSize: 11 }}
              dy={10}
            />
            
            <YAxis 
              domain={[95, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: DarkMode ? '#64748b' : '#94a3b8', fontSize: 11 }} 
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: DarkMode ? '#0f172a' : '#ffffff', 
                border: DarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                borderRadius: '12px',
                color: DarkMode ? '#f8fafc' : '#1e293b',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="uptime"
              stroke={DarkMode ? "#3b82f6" : "#2563eb"}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorUptime)"
              activeDot={{ 
                r: 6, 
                strokeWidth: 2, 
                stroke: DarkMode ? "#0f172a" : "#ffffff", 
                fill: '#3b82f6' 
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 