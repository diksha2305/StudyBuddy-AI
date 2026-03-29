"use client";

import Link from "next/link";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  SparklesIcon,
  ArrowRightIcon,
  BoltIcon
} from "@heroicons/react/24/solid";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center p-6 selection:bg-cyan-500/30 selection:text-cyan-400 font-sans relative overflow-hidden">
      
      {/* 🧭 Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />

      {/* 🚀 Register Hub Card */}
      <div className="w-full max-w-lg animate-fadeInUp">
        <div className="bg-[#0a0e14] rounded-[48px] border border-white/10 p-10 md:p-14 shadow-3xl relative overflow-hidden group hover:border-cyan-400/30 transition-all duration-700">
           {/* Decorative Top Glow */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

           {/* Brand Header */}
           <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <Link href="/" className="mb-2">
                 <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(0,245,255,0.3)] hover:scale-110 transition-transform">
                    <BoltIcon className="w-8 h-8 text-white" />
                 </div>
              </Link>
              <h1 className="text-4xl font-black font-headings italic uppercase tracking-tighter">Registration Hub</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Initialize Academic Identity</p>
           </div>

           {/* Input Protocol */}
           <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                 {/* Name Input */}
                 <div className="relative group/input">
                    <UserIcon className="absolute top-1/2 -translate-y-1/2 left-6 w-5 h-5 text-slate-700 group-focus-within/input:text-cyan-400 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Full Name Protocol" 
                      className="w-full bg-slate-950 border-2 border-slate-900 focus:border-cyan-400/50 rounded-2xl py-5 pl-16 pr-6 text-white font-bold transition-all focus:ring-0 placeholder:text-slate-700"
                    />
                 </div>

                 {/* Email Input */}
                 <div className="relative group/input">
                    <EnvelopeIcon className="absolute top-1/2 -translate-y-1/2 left-6 w-5 h-5 text-slate-700 group-focus-within/input:text-cyan-400 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="Email Connectivity" 
                      className="w-full bg-slate-950 border-2 border-slate-900 focus:border-cyan-400/50 rounded-2xl py-5 pl-16 pr-6 text-white font-bold transition-all focus:ring-0 placeholder:text-slate-700"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password Input */}
                    <div className="relative group/input">
                       <LockClosedIcon className="absolute top-1/2 -translate-y-1/2 left-5 w-4 h-4 text-slate-700 group-focus-within/input:text-cyan-400 transition-colors" />
                       <input 
                         type="password" 
                         placeholder="New Key" 
                         className="w-full bg-slate-950 border-2 border-slate-900 focus:border-cyan-400/50 rounded-2xl py-5 pl-12 pr-6 text-white font-bold transition-all focus:ring-0 placeholder:text-slate-700 text-sm"
                       />
                    </div>
                    {/* Confirm Password */}
                    <div className="relative group/input">
                       <input 
                         type="password" 
                         placeholder="Verify Key" 
                         className="w-full bg-slate-950 border-2 border-slate-900 focus:border-cyan-400/50 rounded-2xl py-5 px-6 text-white font-bold transition-all focus:ring-0 placeholder:text-slate-700 text-sm text-center"
                       />
                    </div>
                 </div>
              </div>

              {/* Terms Checkbox - Decorative */}
              <div className="flex items-center gap-3 px-4 py-4 bg-slate-950 border border-white/5 rounded-2xl">
                 <div className="w-5 h-5 rounded-lg border-2 border-slate-800 bg-slate-900 flex items-center justify-center group cursor-pointer hover:border-cyan-400/30">
                    <SparklesIcon className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                   Accepting Intelligent System Protocols
                 </span>
              </div>

              <button className="w-full py-6 bg-white text-black font-black rounded-[20px] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl relative overflow-hidden group/btn uppercase italic tracking-tighter text-xl">
                <span className="relative z-10 font-black">Create Identity</span>
                <ArrowRightIcon className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
              </button>
           </form>

           {/* Login Anchor */}
           <div className="text-center mt-12 pt-8 border-t border-white/5">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
                 Already a Scientist? <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors italic">Return to Login Hub</Link>
              </p>
           </div>
        </div>

        {/* Footer Support */}
        <p className="text-center mt-10 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] italic">
           Secure Academic Core • Neural Registration Active
        </p>
      </div>

    </div>
  );
}
