"use client";

import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ExclamationTriangleIcon,
  GlobeAltIcon
} from "@heroicons/react/24/solid";

export default function InsightCard() {
  const weeklyData = [
    { day: "Mon", score: 65 },
    { day: "Tue", score: 85 },
    { day: "Wed", score: 55 },
    { day: "Thu", score: 95 },
    { day: "Fri", score: 75 },
    { day: "Sat", score: 45 },
    { day: "Sun", score: 68 },
  ];

  return (
    <div className="bg-[#0a0e14] rounded-[32px] p-8 border border-white/10 shadow-2xl space-y-8 animate-fadeInUp relative overflow-hidden group">
      
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-indigo-500/10 transition-colors" />

      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/20 shadow-inner">
            <ChartBarIcon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Intelligence Report</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time sync: Active</p>
          </div>
        </div>
        <button className="text-[10px] font-black text-white hover:text-cyan-400 transition-colors uppercase tracking-widest border border-white/10 bg-slate-900 px-4 py-2 rounded-full hover:border-cyan-400/50 shadow-lg">
          Full Report
        </button>
      </div>

      <div className="space-y-6 pt-4 relative">
        <div className="flex items-center justify-between px-1">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Weekly Performance Score</p>
           <span className="text-sm font-black text-cyan-400 italic">Avg: 75%</span>
        </div>
        
        <div className="flex items-end justify-between gap-2 h-40 px-1 pt-6">
          {weeklyData.map((data) => (
            <div key={data.day} className="flex-1 flex flex-col items-center group cursor-pointer relative">
              <div 
                className="w-full bg-slate-900 border border-white/5 rounded-t-xl transition-all duration-700 group-hover:bg-gradient-to-t group-hover:from-indigo-600/50 group-hover:to-cyan-400/50 group-hover:border-cyan-400/30 relative overflow-hidden"
                style={{ height: `${data.score}%` }}
              >
                 <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(34,211,238,1)]" />
                 <div className="invisible group-hover:visible absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-white">{data.score}%</div>
              </div>
              <span className="text-[9px] font-black text-slate-500 mt-4 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative">
        <div className="bg-slate-900 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-xl relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500/20 group-hover:bg-emerald-500/50 transition-colors" />
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <ArrowTrendingUpIcon className="w-5 h-5 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Strength</span>
          </div>
          <h4 className="text-base font-black text-white mb-1 group-hover:text-emerald-400 transition-colors italic uppercase leading-none">Neural Dynamics</h4>
          <p className="text-[10px] text-slate-500 leading-tight font-medium">Concept synthesis 92% mastery.</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-white/5 hover:border-rose-500/40 transition-all cursor-pointer group shadow-xl relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-rose-500/20 group-hover:bg-rose-500/50 transition-colors" />
          <div className="flex items-center gap-2 text-rose-400 mb-3">
            <ExclamationTriangleIcon className="w-5 h-5 shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Focus Target</span>
          </div>
          <h4 className="text-base font-black text-white mb-1 group-hover:text-rose-400 transition-colors italic uppercase leading-none">Signals & Systems</h4>
          <p className="text-[10px] text-slate-500 leading-tight font-medium">Complex math review needed.</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-sky-500/10 p-6 rounded-3xl border border-white/5 flex items-center gap-6 relative shadow-2xl">
        <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
          <GlobeAltIcon className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Ranking Status</p>
             <span className="text-xs font-black text-cyan-400 italic">Score: 2.8k</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5 shadow-inner">
              <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-600 rounded-full w-[84%] animate-shimmer" />
            </div>
            <span className="text-base font-black text-white whitespace-nowrap tracking-tighter italic">#1,402</span>
          </div>
        </div>
      </div>
    </div>
  );
}
