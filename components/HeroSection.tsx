"use client";

import { useUser } from "@/lib/UserContext";
import { 
  SparklesIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  AcademicCapIcon,
  CloudIcon
} from "@heroicons/react/24/solid";

export default function HeroSection() {
  const { profile } = useUser();
  const firstName = profile?.name ? profile.name.split(" ")[0] : "Scholar";

  return (
    <div className="relative pt-32 pb-12 animate-fadeIn">
      {/* Visual Accents - Stronger Contrast */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] -translate-y-1/2 -z-10" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[150px] -translate-y-1/2 -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
        
        {/* User Badge - Solid Background */}
        <div className="flex items-center gap-3 px-6 py-2 bg-slate-900 border border-white/10 rounded-full shadow-2xl animate-fadeInDown">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none pt-0.5">
            System Online: <span className="text-white">Active session</span>
          </span>
        </div>

        {/* Headline - Elegant & Pleasing */}
        <div className="space-y-6 animate-fadeInUp">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white leading-tight">
            Spark your genius, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]">
               {firstName} ✨
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-2xl font-medium text-slate-400 leading-relaxed italic">
            "Where curiosity meets artificial intelligence to spark absolute brilliance." <br/>
            Your journey to academic mastery begins here.
          </p>
        </div>

        {/* AI Recommendation Panel - More Solid Contrast */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 animate-fadeInUp" style={{ animationDelay: "200ms" }}>
          
          <div className="bg-[#0a0e14] p-8 rounded-[32px] border border-white/10 shadow-2xl flex items-center gap-6 group hover:border-cyan-400/30 transition-all cursor-pointer overflow-hidden relative">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors" />
            <div className="w-16 h-16 bg-cyan-400/10 rounded-2xl flex items-center justify-center border border-cyan-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
               <SparklesIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-left flex-1">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">AI Priority Recomendation</span>
              <h3 className="text-xl font-bold text-white mt-1 group-hover:text-cyan-400 transition-colors">Neural Synchronization</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">System suggests reviewing <span className="text-white font-bold">Concept A</span> to improve mastery from 68% to 85%.</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-slate-800 group-hover:text-cyan-400 transition-all group-hover:translate-x-1" />
          </div>

          <div className="bg-[#0a0e14] p-8 rounded-[32px] border border-white/10 shadow-2xl flex items-center gap-6 group hover:border-indigo-400/30 transition-all cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/5 rounded-full blur-3xl group-hover:bg-indigo-400/10 transition-colors" />
            <div className="w-16 h-16 bg-indigo-400/10 rounded-2xl flex items-center justify-center border border-indigo-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
               <AcademicCapIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="text-left flex-1">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mastery Status</span>
              <h3 className="text-xl font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors">Top 4% Global Elite</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">You've maintained a <span className="text-white font-bold">12-day streak</span>. Your focus profile is 92% calibrated.</p>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-slate-800 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
          </div>

        </div>

        {/* Global Stats - Visible with High Contrast */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fadeInUp" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
             <span className="text-sm font-black text-white italic tracking-tighter uppercase whitespace-nowrap">84% Core Mastery</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)]" />
             <span className="text-sm font-black text-white italic tracking-tighter uppercase whitespace-nowrap">125 Concepts Resolved</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,1)]" />
             <span className="text-sm font-black text-white italic tracking-tighter uppercase whitespace-nowrap">Current Streak: 12d</span>
          </div>
        </div>

      </div>
    </div>
  );
}
