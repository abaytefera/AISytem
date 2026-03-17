import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSelector } from "react-redux";

// Matching your brand colors: Blue (Active), Yellow (Maintenance), Red (Inactive/Critical)
const COLORS = ["#3b82f6", "#facc15", "#ef4444"]; 

export default function StatusChart({ data }) {
  const { DarkMode } = useSelector((state) => state.webState);

  // Fallback data structure
  const chartData = data || [
    { name: "Active", value: 0 },
    { name: "Maintenance", value: 0 },
    { name: "Inactive", value: 0 },
  ];

  // Calculate total for the center label
  const totalItems = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className={`border rounded-2xl p-6 h-[350px] transition-all duration-300 flex flex-col ${
      DarkMode 
        ? "bg-slate-900 border-slate-800 shadow-none" 
        : "bg-white border-slate-200 shadow-sm"
    }`}>
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h3 className={`font-semibold tracking-wide ${DarkMode ? "text-slate-100" : "text-slate-800"}`}>
          Organization Status
        </h3>
        <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold tracking-tighter ${
          DarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
        }`}>
          Real-time
        </span>
      </div>

      {/* Chart Section */}
      <div className="flex-1 w-full relative">
        {/* Total Label in the center of the Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className={`text-2xl font-bold ${DarkMode ? "text-white" : "text-slate-800"}`}>
            {totalItems}
          </span>
          <span className="text-[10px] uppercase text-slate-500 font-bold">Total</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={400}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: DarkMode ? '#0f172a' : '#ffffff', 
                border: DarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0', 
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: DarkMode ? '#f8fafc' : '#1e293b' }}
              formatter={(value) => [value, "Companies"]}
            />
            
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => (
                <span className={`text-sm ml-1 font-medium ${
                  DarkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}