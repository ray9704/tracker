
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ReferenceLine, Cell
} from 'recharts';
import { Task, TaskStatus } from '../types';
import { TrendingUp, Activity } from 'lucide-react';

interface Props {
  tasks: Task[];
}

const PerformanceCharts: React.FC<Props> = ({ tasks }) => {
  const getWeeklyData = () => {
    const data: any[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = tasks.filter(t => t.date === dateStr);
      
      const total = dayTasks.reduce((acc, t) => acc + t.hours, 0);
      // Use actual workingHrs for completed metric
      const completed = dayTasks.reduce((acc, t) => acc + (t.workingHrs || 0), 0);
      
      data.push({
        name: days[d.getDay()],
        target: total,
        done: completed,
        score: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
    return data;
  };

  const getMonthlyData = () => {
    const data: any[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = tasks.filter(t => t.date === dateStr);
      const total = dayTasks.reduce((acc, t) => acc + t.hours, 0);
      const completed = dayTasks.reduce((acc, t) => acc + (t.workingHrs || 0), 0);
      data.push({
        date: dateStr.slice(8),
        efficiency: total > 0 ? (completed / total) * 100 : 0
      });
    }
    return data;
  };

  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f0f0f] border border-white/10 p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <p className="text-white font-black text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-1">{label}</p>
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between gap-8 mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{p.name}</span>
              <span className="text-sm font-black" style={{ color: p.color || '#e11d48' }}>
                {p.value}{p.name === 'Efficiency' || p.name === 'Score' ? '%' : 'h'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Weekly Efficiency Bar Chart */}
      <div className="glass-card p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-50"></div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-1">Performance Matrix</h3>
            <h4 className="text-xl font-black text-white italic">Weekly Output</h4>
          </div>
          <div className="bg-red-600/10 p-2 rounded-lg">
            <Activity size={20} className="text-red-500" />
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity={1} />
                  <stop offset="100%" stopColor="#9f1239" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="bgBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.05} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={10} 
                fontWeight={800}
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar 
                dataKey="target" 
                name="Quota" 
                fill="url(#bgBarGradient)" 
                radius={[10, 10, 10, 10]} 
                barSize={32}
              />
              <Bar 
                dataKey="done" 
                name="Achieved" 
                fill="url(#barGradient)" 
                radius={[10, 10, 10, 10]} 
                barSize={32}
                animationBegin={200}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex gap-4 text-[10px] font-black uppercase tracking-widest">
           <div className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
              <span>Target Load</span>
           </div>
           <div className="flex items-center gap-2 text-red-500">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              <span>Actual Power</span>
           </div>
        </div>
      </div>

      {/* 30-Day Trend Chart */}
      <div className="glass-card p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-white/10 group-hover:bg-red-600 transition-colors"></div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Trajectory Status</h3>
            <h4 className="text-xl font-black text-white italic">30-Day Efficiency</h4>
          </div>
          <div className="bg-white/5 p-2 rounded-lg">
            <TrendingUp size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="date" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#ffffff" strokeDasharray="3 3" strokeOpacity={0.1} label={{ value: 'ELITE', position: 'insideRight', fill: '#ffffff', opacity: 0.2, fontSize: 8, fontWeight: 900 }} />
              <Area 
                type="monotone" 
                dataKey="efficiency" 
                name="Efficiency"
                stroke="#e11d48" 
                strokeWidth={5}
                fillOpacity={1} 
                fill="url(#areaGradient)" 
                animationDuration={2000}
                activeDot={{ r: 6, fill: '#fff', stroke: '#e11d48', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between">
           <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Timeline: Last 30 Cycles
           </div>
           <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">Stability:</span>
              <span className="text-xs font-black text-red-500">OPTIMIZING</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
