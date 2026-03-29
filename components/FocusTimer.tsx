"use client";

import { useState, useEffect } from "react";
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowPathIcon,
  SunIcon,
  ShieldCheckIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";

export default function FocusTimer() {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState<"Focus" | "Break">("Focus");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      setIsActive(false);
      // alert logic or sound
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(type === "Focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = (time / (type === "Focus" ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="bg-[#05070a] rounded-[32px] p-8 border border-white/10 shadow-2xl space-y-8 animate-fadeInUp relative overflow-hidden group">
      
      {/* Dynamic Background Pulse */}
      <div className={`absolute inset-0 transition-opacity duration-1000 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${type === "Focus" ? "from-cyan-500/5 to-transparent" : "from-secondary-rgb/5 to-transparent"}`} />

      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl border ${type === "Focus" ? "bg-cyan-500/20 border-cyan-500/30" : "bg-purple-500/20 border-purple-500/30"} shadow-inner group-hover:scale-110 transition-transform`}>
            {type === "Focus" ? (
              <SparklesIcon className="w-6 h-6 text-cyan-400" />
            ) : (
              <SunIcon className="w-6 h-6 text-purple-400" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">{type} Protocol</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target: Deep State</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-full shadow-lg">
           <div className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" : "bg-slate-700"}`} />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">
              {isActive ? "Active" : "Standby"}
           </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 relative py-4">
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Progress Ring */}
          <svg className="w-full h-full -rotate-90 group-hover:scale-105 transition-transform duration-700">
            <circle
              cx="112"
              cy="112"
              r="100"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-900 shadow-inner"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - progress / 100)}
              className={`${type === "Focus" ? "text-cyan-400" : "text-purple-400"} transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)]`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl font-black text-white tracking-tighter italic">
              {formatTime(time)}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${type === "Focus" ? "text-cyan-400" : "text-purple-400"}`}>
               {type === "Focus" ? "Productivity Cell" : "Neural Refresh"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={toggleTimer}
            className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[20px] font-black uppercase tracking-tighter text-sm italic transition-all active:scale-95 shadow-2xl ${
              isActive 
                ? "bg-slate-900 border border-white/10 text-white hover:bg-slate-800"
                : type === "Focus" 
                  ? "bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_10px_30px_rgba(6,182,212,0.4)]"
                  : "bg-purple-500 text-white hover:bg-purple-400 shadow-[0_10px_30px_rgba(168,85,247,0.4)]"
            }`}
          >
            {isActive ? (
              <>
                <PauseIcon className="w-6 h-6" /> Stop
              </>
            ) : (
              <>
                <PlayIcon className="w-6 h-6" /> Start Session
              </>
            )}
          </button>
          
          <button 
            onClick={resetTimer}
            className="p-5 bg-slate-900 border border-white/10 hover:border-cyan-400/50 rounded-[20px] text-slate-400 hover:text-cyan-400 transition-all shadow-xl active:scale-90"
          >
            <ArrowPathIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 relative overflow-hidden group/alert shadow-inner">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-amber-500 group-hover/alert:scale-110 transition-transform">
             <ShieldCheckIcon className="w-5 h-5 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
          </div>
          <div className="flex-1">
             <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">Tactical Instruction</p>
             <p className="text-xs text-slate-500 italic leading-relaxed font-medium">
               "Neural pathways reinforce strongest in the last 5 minutes. Push through the exhaustion barrier."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
