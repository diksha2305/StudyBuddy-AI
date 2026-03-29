"use client";

import Link from "next/link";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon,
  BoltIcon
} from "@heroicons/react/24/solid";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center p-6 selection:bg-cyan-500/30 selection:text-cyan-400 font-sans relative overflow-hidden">
      
      {/* 🧭 Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />

      {/* 🚀 Login Hub Card */}
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="bg-[#0a0e14] rounded-[40px] border border-white/10 p-10 md:p-12 shadow-3xl relative overflow-hidden group hover:border-cyan-400/30 transition-all duration-700">
           {/* Decorative Top Glow */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

           {/* Brand Header */}
           <div className="flex flex-col items-center text-center space-y-4 mb-10">
              <Link href="/" className="mb-2">
                 <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,245,255,0.3)] hover:scale-110 transition-transform">
                    <BoltIcon className="w-8 h-8 text-white" />
                 </div>
              </Link>
              <h1 className="text-3xl font-black font-headings italic uppercase tracking-tighter">Welcome Access</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Initialize Academic session</p>
           </div>

           {/* Input Protocol */}
           <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                 <div className="relative group/input">
                    <EnvelopeIcon className="absolute top-1/2 -translate-y-1/2 left-6 w-5 h-5 text-slate-700 group-focus-within/input:text-cyan-400 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="Email Protocol" 
                      className="w-full bg-slate-950 border-2 border-slate-900 focus:border-cyan-400/50 rounded-2xl py-5 pl-16 pr-6 text-white font-bold transition-all focus:ring-0 placeholder:text-slate-700"
                    />
                 </div>

                 <div className="relative group/input">
                    <LockClosedIcon className="absolute top-1/2 -translate-y-1/2 left-6 w-5 h-5 text-slate-700 group-focus-within/input:text-cyan-400 transition-colors" />
                    <input 
                      type="password" 
                      placeholder="Encryption Key" 
                      className="w-full bg-slate-950 border-2 border-slate-900 focus:border-cyan-400/50 rounded-2xl py-5 pl-16 pr-6 text-white font-bold transition-all focus:ring-0 placeholder:text-slate-700"
                    />
                 </div>
              </div>

              <div className="flex items-center justify-end px-2">
                 <Link href="#" className="text-[10px] font-black text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                   Recover Access Code?
                 </Link>
              </div>

              <button className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl relative overflow-hidden group/btn uppercase italic tracking-tighter text-lg">
                <span className="relative z-10 font-black">Login to System</span>
                <ArrowRightIcon className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
           </form>

           {/* Social Calibration */}
           <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4 text-slate-800">
                 <div className="flex-1 h-px bg-white/5" />
                 <span className="text-[9px] font-black uppercase tracking-widest leading-none">Social Calibration</span>
                 <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button className="flex items-center justify-center gap-3 py-4 bg-slate-950 border border-white/5 rounded-2xl hover:bg-black transition-all hover:border-cyan-400/30 group/social shadow-xl">
                    <svg className="w-5 h-5 group-hover/social:scale-110 transition-transform" viewBox="0 0 24 24">
                       <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.224 1.224-3.136 2.504-6.392 2.504-5.112 0-9.216-4.14-9.216-9.256s4.104-9.256 9.216-9.256c2.768 0 4.768 1.088 6.256 2.488l2.312-2.312C18.424 1.488 15.656 0 12.192 0 5.864 0 .912 5.052.912 11.232c0 6.18 4.952 11.232 11.28 11.232 3.424 0 6.016-1.128 7.952-3.152 2.032-2.032 2.68-4.872 2.68-7.392 0-.64-.048-1.264-.144-1.84h-10.2z"/>
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Google</span>
                 </button>
                 <button className="flex items-center justify-center gap-3 py-4 bg-slate-950 border border-white/5 rounded-2xl hover:bg-black transition-all hover:border-purple-400/30 group/social shadow-xl">
                    <svg className="w-5 h-5 group-hover/social:scale-110 transition-transform" viewBox="0 0 24 24">
                       <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">GitHub</span>
                 </button>
              </div>
           </div>

           {/* Brand Secondary CTA */}
           <div className="text-center mt-10">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
                 New Scientist? <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors italic">Initiate Registration</Link>
              </p>
           </div>
        </div>

        {/* Footer Support */}
        <p className="text-center mt-8 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
           Core Encryption Active • 2026 Intelligence Source
        </p>
      </div>

    </div>
  );
}
