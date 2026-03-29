"use client";

import { useUser } from "@/lib/UserContext";
import { 
  SparklesIcon, 
  CheckCircleIcon, 
  BoltIcon, 
  FireIcon, 
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon
} from "@heroicons/react/24/solid";
import Link from "next/link";

// --- Mock Stats for scannable UI ---
const DASHBOARD_STATS = [
  { label: "Tasks Due Today", value: "8", icon: BoltIcon, color: "text-[#00f5ff]" },
  { label: "Study Streak", value: "12 Days", icon: FireIcon, color: "text-orange-500" },
  { label: "Mastery Level", value: "Top 4%", icon: AcademicCapIcon, color: "text-[#7c3aed]" }
];

const DAILY_PROTOCOL = [
  { id: 1, task: "Advanced Calculus: Limits", time: "09:00 AM", priority: "High", color: "border-[#00f5ff]" },
  { id: 2, task: "Neurobiology: Synaptic Plasticity", time: "11:30 AM", priority: "Medium", color: "border-[#7c3aed]" },
  { id: 3, task: "Classical Mechanics: Oscillations", time: "02:00 PM", priority: "High", color: "border-[#00f5ff]" },
  { id: 4, task: "Library Session: Deep Focus", time: "05:00 PM", priority: "Low", color: "border-slate-800" },
];

export default function DashboardPage() {
  const { profile } = useUser();
  const firstName = profile?.name ? profile.name.split(" ")[0] : "Scientist";

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-cyan-500/30 selection:text-cyan-400 font-sans pb-32 relative">
      
      {/* 🧭 Dashboard Navbar */}
      <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 bg-[#05070a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-[#00f5ff] to-[#7c3aed] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                <BoltIcon className="w-5 h-5 text-white" />
             </div>
             <span className="text-xl font-black font-headings italic uppercase tracking-tighter">StudySmart</span>
          </Link>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00f5ff]">Neural Link Active</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black italic shadow-inner">
                {firstName[0]}
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 space-y-12">
        
        {/* 👋 Greeting */}
        <header className="animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-black font-headings italic uppercase tracking-tighter leading-none">
            Welcome back, <br/>
            <span className="text-[#00f5ff] font-headings uppercase italic"> {firstName} 👋 </span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">Calibration complete. Ready for high-impact learning.</p>
        </header>

        {/* 📊 Intelligence Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: "100ms" }}>
           {DASHBOARD_STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-[#0a0e14] p-8 rounded-[32px] border border-white/5 shadow-2xl flex items-center gap-6 group hover:border-cyan-400/20 transition-all cursor-pointer">
                   <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform ${stat.color}`}>
                      <Icon className="w-7 h-7" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-black italic uppercase text-white font-headings">{stat.value}</h3>
                   </div>
                </div>
              );
           })}
        </section>

        {/* 📝 Daily Protocol Feed */}
        <section className="space-y-8 animate-fadeInUp" style={{ animationDelay: "200ms" }}>
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black font-headings italic uppercase tracking-tighter flex items-center gap-4">
                 <ClockIcon className="w-6 h-6 text-[#00f5ff]" />
                 Daily Protocol
              </h3>
              <button className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest italic decoration-cyan-400/30 underline decoration-2 underline-offset-4">
                View Full Roadmap
              </button>
           </div>

           <div className="space-y-4">
              {DAILY_PROTOCOL.map((task, idx) => (
                <div key={task.id} className={`group bg-[#0a0e14] rounded-[32px] border-2 ${task.color} p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer`}>
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-slate-600 group-hover:text-white transition-colors">
                        <CheckCircleIcon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5 text-slate-500">
                               {task.priority === "High" ? "Critial" : "Standby"}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#00f5ff]">{task.time}</span>
                         </div>
                         <h4 className="text-xl md:text-2xl font-black italic uppercase text-white font-headings group-hover:text-[#00f5ff] transition-colors">{task.task}</h4>
                      </div>
                   </div>
                   <div className="hidden md:flex items-center gap-3 text-slate-700 group-hover:text-cyan-400 transition-colors">
                      <p className="text-sm font-black italic">Start session</p>
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                   </div>
                </div>
              ))}
           </div>
        </section>

      </main>

      {/* 🔮 Neural Hub - Floating Action */}
      <div className="fixed bottom-10 right-10 group z-50">
         <div className="absolute -inset-4 bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
         <button className="relative w-20 h-20 bg-[#0a0e14] border-2 border-[#00f5ff]/30 rounded-full flex items-center justify-center shadow-3xl hover:scale-110 active:scale-95 transition-all group/btn bg-grid overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-transparent pointer-events-none" />
            <ChatBubbleLeftRightIcon className="w-10 h-10 text-white relative z-10 group-focus:animate-pulse" />
            <div className="absolute bottom-0 w-full h-1 bg-[#00f5ff] opacity-0 group-hover:opacity-100 transition-opacity" />
         </button>
         
         {/* Label Tag */}
         <div className="absolute bottom-24 right-0 transform scale-0 group-hover:scale-100 transition-transform origin-bottom-right">
            <div className="bg-[#0a0e14] border border-[#00f5ff]/30 px-6 py-3 rounded-2xl shadow-3xl whitespace-nowrap">
               <span className="text-xs font-black uppercase tracking-widest text-[#00f5ff] italic">Summon AI Assistant</span>
            </div>
         </div>
      </div>

      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-cyan-400/5 to-transparent pointer-events-none -z-10" />

    </div>
  );
}
