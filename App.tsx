
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, CheckCircle2, Circle, TrendingUp, BrainCircuit, 
  GripVertical, Calendar, Target, Zap, LayoutDashboard, 
  Milestone, ChevronRight, Info, Save, X, Edit3, Clock, Sparkles
} from 'lucide-react';
import { Task, TaskStatus, SidebarTask, MonthlyGoal } from './types';
import MotivationalQuote from './components/MotivationalQuote';
import PerformanceCharts from './components/PerformanceCharts';
import { getAIProductivityFeedback } from './services/geminiService';

const STORAGE_KEY = 'superpower_routine_tasks_v2';
const GOALS_KEY = 'superpower_routine_goals_v2';
const MONTHLY_ROADMAP_KEY = 'superpower_monthly_roadmap_v2';
const QUICK_TASKS_KEY = 'superpower_quick_tasks_v2';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sidebarTasks, setSidebarTasks] = useState<SidebarTask[]>([]);
  const [monthlyRoadmap, setMonthlyRoadmap] = useState<MonthlyGoal[]>([]);
  const [quickTasks, setQuickTasks] = useState<string[]>(['Morning Exercise', 'Deep Work', 'Lunch Break', 'Study Session', 'Skill Practice', 'Daily Review']);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingTaskNotes, setEditingTaskNotes] = useState<string | null>(null);

  // Load Data
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    const savedSidebar = localStorage.getItem(GOALS_KEY);
    const savedRoadmap = localStorage.getItem(MONTHLY_ROADMAP_KEY);
    const savedQuickTasks = localStorage.getItem(QUICK_TASKS_KEY);
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSidebar) setSidebarTasks(JSON.parse(savedSidebar));
    if (savedRoadmap) setMonthlyRoadmap(JSON.parse(savedRoadmap));
    if (savedQuickTasks) setQuickTasks(JSON.parse(savedQuickTasks));
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(sidebarTasks));
  }, [sidebarTasks]);

  useEffect(() => {
    localStorage.setItem(MONTHLY_ROADMAP_KEY, JSON.stringify(monthlyRoadmap));
  }, [monthlyRoadmap]);

  useEffect(() => {
    localStorage.setItem(QUICK_TASKS_KEY, JSON.stringify(quickTasks));
  }, [quickTasks]);

  const generateAIFeedback = async () => {
    setLoadingAi(true);
    const todayTasks = tasks.filter(t => t.date === currentDate);
    if (todayTasks.length > 0) {
      const feedback = await getAIProductivityFeedback(todayTasks);
      setAiFeedback(feedback || '');
    } else {
      setAiFeedback("Commander, is date pr koi task nahi hai. Pehle plan krein phir feedback lein!");
    }
    setLoadingAi(false);
  };

  const addTask = (description = 'New Task') => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      timeRange: '09:00am - 10:00am',
      hours: 1,
      description,
      status: TaskStatus.NOT_COMPLETED,
      workingHrs: 0,
      notes: '',
      date: currentDate
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateSidebarTask = (id: string, updates: Partial<SidebarTask>) => {
    setSidebarTasks(sidebarTasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteSidebarTask = (id: string) => {
    setSidebarTasks(sidebarTasks.filter(t => t.id !== id));
  };

  const addSidebarTask = () => {
    setSidebarTasks([...sidebarTasks, { id: crypto.randomUUID(), description: 'New Focus Area', status: 'Priority' }]);
  };

  // Monthly Roadmap Functions
  const addMonthlyGoal = () => {
    const newGoal: MonthlyGoal = {
      id: crypto.randomUUID(),
      title: 'New Strategic Goal',
      description: 'Define the objective details here...',
      deadline: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      progress: 0,
      priority: 'Medium'
    };
    setMonthlyRoadmap([...monthlyRoadmap, newGoal]);
  };

  const updateMonthlyGoal = (id: string, updates: Partial<MonthlyGoal>) => {
    setMonthlyRoadmap(monthlyRoadmap.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteMonthlyGoal = (id: string) => {
    setMonthlyRoadmap(monthlyRoadmap.filter(g => g.id !== id));
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, taskName: string) => {
    e.dataTransfer.setData('text/plain', taskName);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskName = e.dataTransfer.getData('text/plain');
    if (taskName) addTask(taskName);
  };

  const todayTasks = tasks.filter(t => t.date === currentDate);
  const actualWorkedHrs = todayTasks.reduce((sum, t) => sum + (t.workingHrs || 0), 0);
  const totalAllocatedHrs = todayTasks.reduce((sum, t) => sum + t.hours, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Premium Navigation */}
      <nav className="glass-card sticky top-0 z-[100] px-8 py-5 border-b border-white/5 shadow-2xl">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 red-gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
              <Zap className="text-white fill-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-[900] tracking-tighter text-white uppercase italic">
                Super<span className="text-red-500">Power</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase">Routine Intelligence v4.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                <button 
                  onClick={() => setActiveTab('daily')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'daily' ? 'red-gradient-bg text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <LayoutDashboard size={16} />
                  Daily Command
                </button>
                <button 
                  onClick={() => setActiveTab('monthly')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'monthly' ? 'red-gradient-bg text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <Milestone size={16} />
                  Monthly Roadmap
                </button>
             </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-400">
                  <Calendar size={16} className="text-red-500" />
                  <input 
                    type="date" 
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 outline-none text-white cursor-pointer"
                  />
                </div>
              </div>
              <button 
                onClick={generateAIFeedback} 
                disabled={loadingAi}
                title="Get AI Feedback"
                className={`p-3 rounded-xl bg-red-600 border border-red-500 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 ${loadingAi ? 'animate-spin opacity-50' : 'hover:scale-110 active:scale-95'}`}
              >
                <BrainCircuit size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-8 mt-12">
        <MotivationalQuote />

        {activeTab === 'daily' ? (
          <div className="space-y-10">
            <PerformanceCharts tasks={tasks} />

            {/* AI Feedback Section */}
            {!aiFeedback && !loadingAi && (
              <div className="glass-card p-10 rounded-3xl border border-dashed border-red-600/30 flex flex-col items-center justify-center text-center animate-pulse">
                <Sparkles className="text-red-500 mb-4" size={40} />
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Ready for Analysis?</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6 font-bold max-w-sm">Click the button below to generate your performance report using the SuperPower Mentor AI.</p>
                <button 
                  onClick={generateAIFeedback}
                  className="red-gradient-bg px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  <BrainCircuit size={18} />
                  Generate AI Report
                </button>
              </div>
            )}

            {aiFeedback && (
              <div className="glass-card p-8 rounded-2xl border-l-8 border-red-600 animate-in fade-in zoom-in duration-700 relative overflow-hidden group">
                 <div className="absolute top-[-20px] left-[-20px] opacity-[0.03] group-hover:scale-110 transition-transform">
                    <BrainCircuit size={150} />
                 </div>
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                    <div className="bg-red-600/20 p-2 rounded-lg">
                      <BrainCircuit className="text-red-500" size={24} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-red-500">AI Mentor Insight</span>
                   </div>
                   <button onClick={() => setAiFeedback('')} className="text-gray-600 hover:text-white transition-colors"><X size={18}/></button>
                 </div>
                 <p className="text-lg md:text-2xl text-white font-bold italic leading-relaxed relative z-10 drop-shadow-sm">
                   "{aiFeedback}"
                 </p>
                 <div className="mt-6 flex justify-end">
                    <button 
                      onClick={generateAIFeedback}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 flex items-center gap-2"
                    >
                      <Sparkles size={12}/> Refresh Report
                    </button>
                 </div>
              </div>
            )}

            {/* Immediate Focus Area: Full Width */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 bg-red-600/[0.02]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-red-500" size={24} />
                  <div>
                    <h3 className="font-black text-xl text-white italic uppercase tracking-tighter">Immediate Focus Control</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mission Critical Priorities</p>
                  </div>
                </div>
                <button onClick={addSidebarTask} className="red-gradient-bg p-2 rounded-xl text-white hover:scale-110 transition-transform shadow-lg shadow-red-600/20"><Plus size={20}/></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sidebarTasks.length === 0 && (
                  <div className="col-span-full py-10 text-center border border-dashed border-white/5 rounded-2xl">
                    <p className="text-gray-600 text-xs font-black uppercase">No priorities active. Add one now.</p>
                  </div>
                )}
                {sidebarTasks.map(goal => (
                  <div key={goal.id} className="p-6 bg-black/40 border border-white/5 rounded-2xl group hover:border-red-500/30 transition-all relative">
                    <input 
                      value={goal.description} 
                      onChange={(e) => updateSidebarTask(goal.id, { description: e.target.value })}
                      className="w-full bg-transparent border-none text-base font-black text-white p-0 focus:ring-0 mb-1"
                    />
                    <div className="flex items-center justify-between">
                      <input 
                        value={goal.status} 
                        onChange={(e) => updateSidebarTask(goal.id, { status: e.target.value })}
                        className="bg-transparent border-none text-[10px] text-red-500 font-black p-0 focus:ring-0 uppercase tracking-widest"
                      />
                      <button onClick={() => deleteSidebarTask(goal.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-opacity"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Task Bank: Left Column */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-red-500" size={20} />
                  <div>
                    <h3 className="font-black text-sm text-white uppercase italic tracking-widest">Strategic Bank</h3>
                    <p className="text-[8px] text-gray-500 uppercase">Action Repository</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {quickTasks.map(qt => (
                    <div 
                      key={qt}
                      draggable
                      onDragStart={(e) => handleDragStart(e, qt)}
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-white/10 hover:border-red-500/50 transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Zap size={14} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                        <span>{qt}</span>
                      </div>
                      <GripVertical size={14} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const name = prompt("Enter task name:");
                      if(name) setQuickTasks([...quickTasks, name]);
                    }}
                    className="w-full p-4 border border-dashed border-white/10 rounded-2xl text-gray-600 hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16}/>
                    <span className="text-[9px] font-black uppercase tracking-widest">Add New</span>
                  </button>
                </div>
              </div>

              {/* Main Schedule: Right Column (Span 3) */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`xl:col-span-3 glass-card rounded-3xl border transition-all overflow-hidden ${isDragOver ? 'drag-over' : 'border-white/10'}`}
              >
                <div className="p-8 bg-white/5 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-2xl text-white italic tracking-tighter uppercase">Daily Operation Protocol</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.3em]">Tactical Schedule Execution</p>
                  </div>
                  <button 
                    onClick={() => addTask()}
                    className="red-gradient-bg hover:scale-105 active:scale-95 text-white p-4 rounded-2xl transition-all shadow-xl shadow-red-600/20 flex items-center gap-3 font-black text-xs uppercase"
                  >
                    <Plus size={20} />
                    New Task
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40">
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest w-44">Timeline</th>
                        <th className="px-4 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center w-24">Allocation</th>
                        <th className="px-4 py-5 text-[10px] font-black uppercase text-red-500 tracking-widest text-center w-24">Executed</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Strategic Objective</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center w-40">Status</th>
                        <th className="px-8 py-5 w-16"></th>
                        <th className="px-8 py-5 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {todayTasks.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-32 text-gray-600 font-black uppercase tracking-[0.4em] italic opacity-30">
                            Operational status: Idle. Deploy tasks now.
                          </td>
                        </tr>
                      )}
                      {todayTasks.map((task) => (
                        <React.Fragment key={task.id}>
                          <tr className="hover:bg-white/[0.03] group transition-all duration-300">
                            <td className="px-8 py-6">
                              <input 
                                value={task.timeRange} 
                                onChange={(e) => updateTask(task.id, { timeRange: e.target.value })}
                                className="w-full bg-transparent border-none text-gray-400 font-bold focus:ring-0 p-0 text-xs tracking-tighter"
                              />
                            </td>
                            <td className="px-4 py-6">
                              <div className="flex flex-col items-center">
                                <input 
                                  type="number" step="0.5"
                                  value={task.hours} 
                                  onChange={(e) => updateTask(task.id, { hours: parseFloat(e.target.value) || 0 })}
                                  className="w-16 text-center bg-white/5 border border-white/10 rounded-xl p-2 font-black text-white focus:border-red-500 transition-all outline-none"
                                />
                                <span className="text-[8px] font-black text-gray-600 mt-1">HRS</span>
                              </div>
                            </td>
                            <td className="px-4 py-6">
                              <div className="flex flex-col items-center">
                                <input 
                                  type="number" step="0.1"
                                  value={task.workingHrs} 
                                  placeholder="0"
                                  onChange={(e) => updateTask(task.id, { workingHrs: parseFloat(e.target.value) || 0 })}
                                  className="w-16 text-center bg-red-600/10 border border-red-500/20 rounded-xl p-2 font-black text-red-500 focus:border-red-500 transition-all outline-none"
                                />
                                <span className="text-[8px] font-black text-red-500 mt-1">DONE</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <input 
                                value={task.description} 
                                onChange={(e) => updateTask(task.id, { description: e.target.value })}
                                className="w-full bg-transparent border-none text-white font-black text-base focus:ring-0 p-0 tracking-tight"
                              />
                            </td>
                            <td className="px-8 py-6 text-center">
                              <button 
                                onClick={() => updateTask(task.id, { 
                                  status: task.status === TaskStatus.COMPLETED ? TaskStatus.NOT_COMPLETED : TaskStatus.COMPLETED 
                                })}
                                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all flex items-center justify-center gap-2 mx-auto uppercase shadow-sm ${
                                  task.status === TaskStatus.COMPLETED 
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                                    : 'bg-red-600/10 text-red-500 border border-red-600/30 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/20'
                                }`}
                              >
                                {task.status === TaskStatus.COMPLETED ? <CheckCircle2 size={12}/> : <Circle size={12}/>}
                                {task.status}
                              </button>
                            </td>
                            <td className="px-8 py-6">
                              <button 
                                onClick={() => setEditingTaskNotes(editingTaskNotes === task.id ? null : task.id)}
                                className={`p-2 rounded-lg transition-all ${editingTaskNotes === task.id ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                              >
                                <Info size={18} />
                              </button>
                            </td>
                            <td className="px-8 py-6">
                              <button 
                                onClick={() => deleteTask(task.id)}
                                className="text-gray-800 hover:text-red-500 transition-colors p-2"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                          {editingTaskNotes === task.id && (
                            <tr className="bg-black/50 animate-in fade-in slide-in-from-top-2 duration-300">
                              <td colSpan={7} className="px-12 py-10 border-l-8 border-red-600">
                                 <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                                        <div>
                                          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-red-500">Field Execution Intelligence</h4>
                                          <p className="text-[10px] text-gray-500 font-bold uppercase">Detailed mission parameters for: {task.description}</p>
                                        </div>
                                      </div>
                                      <button onClick={() => setEditingTaskNotes(null)} className="text-gray-600 hover:text-white bg-white/5 p-2 rounded-full transition-colors"><X size={16}/></button>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Notes & Workflow</label>
                                        <textarea 
                                          value={task.notes || ''}
                                          onChange={(e) => updateTask(task.id, { notes: e.target.value })}
                                          placeholder="Break down the steps, list resources, or record key thoughts..."
                                          className="w-full h-44 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-gray-300 focus:border-red-500/50 focus:bg-white/[0.05] outline-none resize-none transition-all shadow-inner"
                                        />
                                      </div>
                                      <div className="space-y-6">
                                        <div className="space-y-2">
                                          <label className="text-[10px] font-black uppercase text-red-500 tracking-widest">Failure Analysis / Post-Mortem</label>
                                          <input 
                                            value={task.reason || ''}
                                            onChange={(e) => updateTask(task.id, { reason: e.target.value })}
                                            placeholder="What exactly went wrong? Why did you fail?"
                                            className="w-full bg-red-600/[0.05] border border-red-600/20 rounded-xl p-5 text-sm italic text-red-400 focus:border-red-500 transition-all outline-none"
                                          />
                                        </div>
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                          <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Efficiency Ratio</span>
                                            <span className="text-sm font-black text-white">{(task.workingHrs / (task.hours || 1) * 100).toFixed(0)}%</span>
                                          </div>
                                          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                            <div 
                                              className="h-full red-gradient-bg transition-all duration-1000" 
                                              style={{ width: `${Math.min(100, (task.workingHrs / (task.hours || 1) * 100))}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                 </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
               <StatCard title="Total Capacity" value={`${totalAllocatedHrs}h`} sub={`${Math.round(totalAllocatedHrs*60)}m`} color="bg-white/5" />
               <StatCard title="Net Worked" value={`${actualWorkedHrs}h`} sub={`${Math.round(actualWorkedHrs*60)}m`} color="bg-red-600 shadow-[0_15px_40px_rgba(225,29,72,0.3)] border-red-500" />
               <StatCard title="Focus Quotient" value={`${totalAllocatedHrs > 0 ? Math.round((actualWorkedHrs/totalAllocatedHrs)*100) : 0}%`} sub="Efficiency Index" color="bg-white/5" />
               <StatCard title="Mental Power" value="98.2" sub="Optimized" color="bg-white/5" />
            </div>
          </div>
        ) : (
          /* MONTHLY ROADMAP VIEW */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between mb-10">
               <div>
                 <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Strategic Roadmap</h2>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Long-Term Conquest Mapping</p>
               </div>
               <button 
                onClick={addMonthlyGoal}
                className="red-gradient-bg px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-3 shadow-xl shadow-red-600/20 hover:scale-105 transition-all"
               >
                 <Plus size={20} />
                 Initiate New Objective
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {monthlyRoadmap.length === 0 && (
                   <div className="col-span-full py-40 flex flex-col items-center text-center">
                      <Milestone size={80} className="text-gray-800 mb-8" />
                      <h3 className="text-2xl font-black text-gray-700 uppercase italic">No Strategic Objectives Set</h3>
                      <p className="text-gray-600 text-sm mt-4 max-w-lg font-bold">The elite do not drift. They set a destination and map the route. Start your monthly planning now.</p>
                   </div>
                )}
                {monthlyRoadmap.map(goal => (
                   <div key={goal.id} className="glass-card p-10 rounded-[2.5rem] border border-white/10 hover:border-red-500/30 transition-all group relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
                        <Target size={140} />
                      </div>
                      
                      <div className="flex items-start justify-between mb-8 relative z-10">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${goal.priority === 'High' ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                           {goal.priority} Priority
                        </div>
                        <button onClick={() => deleteMonthlyGoal(goal.id)} className="bg-white/5 p-2 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-600/10 transition-all"><Trash2 size={18}/></button>
                      </div>

                      <div className="relative z-10 flex-1">
                        <input 
                          value={goal.title}
                          onChange={(e) => updateMonthlyGoal(goal.id, { title: e.target.value })}
                          className="w-full bg-transparent border-none text-2xl font-[900] text-white mb-4 p-0 focus:ring-0 tracking-tighter uppercase italic"
                        />
                        <textarea 
                          value={goal.description}
                          onChange={(e) => updateMonthlyGoal(goal.id, { description: e.target.value })}
                          placeholder="Describe the victory conditions..."
                          className="w-full bg-transparent border-none text-sm text-gray-500 font-bold mb-8 p-0 focus:ring-0 resize-none h-28 leading-relaxed"
                        />
                      </div>

                      <div className="space-y-5 pt-8 border-t border-white/10 relative z-10">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                           <span className="text-gray-500">Operation Completion</span>
                           <span className="text-red-500">{goal.progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                           <div className="h-full red-gradient-bg shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all duration-1000" style={{ width: `${goal.progress}%` }}></div>
                        </div>
                        <input 
                          type="range"
                          min="0" max="100"
                          value={goal.progress}
                          onChange={(e) => updateMonthlyGoal(goal.id, { progress: parseInt(e.target.value) })}
                          className="w-full accent-red-600 bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
                        />
                        
                        <div className="flex items-center justify-between pt-4">
                           <div className="flex items-center gap-3">
                             <div className="bg-white/5 p-2 rounded-lg">
                              <Clock size={16} className="text-red-500" />
                             </div>
                             <div className="flex flex-col">
                               <span className="text-[8px] font-black uppercase text-gray-600">Deadline Alpha</span>
                               <input 
                                type="date"
                                value={goal.deadline}
                                onChange={(e) => updateMonthlyGoal(goal.id, { deadline: e.target.value })}
                                className="bg-transparent border-none text-[11px] font-black text-white p-0 focus:ring-0 cursor-pointer"
                               />
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <button 
                              onClick={() => updateMonthlyGoal(goal.id, { priority: goal.priority === 'High' ? 'Medium' : goal.priority === 'Medium' ? 'Low' : 'High' })}
                              className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                             >
                               Cycle Priority
                             </button>
                           </div>
                        </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ title, value, sub, color }: { title: string, value: string, sub: string, color: string }) => (
  <div className={`${color} p-8 rounded-[2rem] border border-white/10 group hover:scale-[1.03] active:scale-95 transition-all cursor-default relative overflow-hidden`}>
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:bg-white/10 transition-colors"></div>
    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 group-hover:text-white transition-colors relative z-10">{title}</p>
    <p className="text-4xl font-[1000] text-white tracking-tighter relative z-10">{value}</p>
    <div className="flex items-center gap-2 mt-2 relative z-10">
      <div className="w-1 h-1 bg-red-600 rounded-full animate-ping"></div>
      <p className="text-[10px] font-black text-gray-500 uppercase italic opacity-80">{sub}</p>
    </div>
  </div>
);

export default App;
