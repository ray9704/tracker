
import React from 'react';

const MotivationalQuote: React.FC = () => {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="flex flex-col xl:flex-row items-stretch gap-6 mb-10">
      <div className="flex-1 red-gradient-bg text-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(225,29,72,0.3)] border-b-4 border-black/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V3L4 14H11V21L20 10H13Z"/></svg>
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 opacity-80 italic">Commander's Intent</h3>
        <p className="text-xl md:text-2xl font-extrabold leading-tight drop-shadow-md">
          "tmhara brain ek super power ek great weapon uska use kro<br/>
          usko is trh waste mt karo buhat si umeeday wabasta hain<br/>
          tm tarah sai iska use kr k kuch b kr sktay ho khudi abilities ko smjho bs<br/>
          bcz tmharay parents ko tm sai buhat umeeday hain"
        </p>
        
        <div className="mt-8 pt-6 border-t border-white/20 space-y-4">
          <p className="text-lg md:text-xl font-black italic text-red-100 drop-shadow-sm opacity-80">
            "Tum paisay banao, log tumse rishtey khud banayenge."
          </p>
          
          <div className="relative group/quote mt-4 p-4 bg-black/20 rounded-xl border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-white/5 group-hover/quote:bg-white/10 transition-colors"></div>
            <p className="relative z-10 text-2xl md:text-3xl font-[900] text-white tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] animate-pulse">
              "Paisay se barh kar dunya mein koi cheez nahi rayyan"
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 text-white p-8 rounded-2xl shadow-xl flex items-center justify-center min-w-[240px] relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/5 animate-pulse"></div>
        <div className="text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2 block">Journey Status</span>
          <h2 className="text-5xl font-black tracking-tighter">Day {dayOfYear}</h2>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-red-600 h-full rounded-full" style={{ width: `${(dayOfYear / 365) * 100}%` }}></div>
          </div>
          <p className="text-sm opacity-50 font-bold mt-2">Leveling up {Math.round((dayOfYear / 365) * 100)}% through the year</p>
        </div>
      </div>
    </div>
  );
};

export default MotivationalQuote;
