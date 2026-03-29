"use client";

import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";

export default function TopNav({ onProfileClick }: { onProfileClick?: () => void }) {
  const { profile } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? "bg-[#05070a]/90 backdrop-blur-2xl py-3 border-white/10 shadow-2xl" 
          : "bg-transparent py-6 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand - ENLARGED CIRCULAR NEURAL HUB */}
        <div onClick={onProfileClick} className="flex items-center cursor-pointer group">
          <div className="relative w-32 h-32 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
            {/* Dynamic Glow Layer */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-purple-600/20 blur-xl animate-pulse" />
            
            {/* Logo Hub with Neon Ring */}
            <div className="relative w-full h-full rounded-full border-2 border-cyan-400/50 overflow-hidden bg-transparent flex items-center justify-center p-2 shadow-[0_0_50px_rgba(0,242,255,0.4)]">
              <img 
                src="/logo.png" 
                alt="Study Buddy AI Logo" 
                className="w-full h-full object-contain mix-blend-screen hue-rotate-15 brightness-125 contrast-125 filter drop-shadow(0 0 10px rgba(0,242,255,0.8))"
              />
            </div>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden md:flex flex-1 max-w-lg mx-12">
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-cyan-400/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-slate-900/80 border border-white/5 group-hover:border-cyan-400/30 rounded-2xl px-4 py-2.5 transition-all">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources, topics, or AI notes..."
                className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 placeholder-slate-500 w-full ml-3 font-medium"
              />
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-slate-800 rounded-lg border border-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span className="text-slate-400">Ctrl</span> K
              </div>
            </div>
          </div>
        </div>

        {/* Controls - Right */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 lg:gap-6 border-r border-white/10 pr-6 mr-2">
            <button className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-400/20">
              <SunIcon className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-400/20 relative">
              <BellIcon className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#05070a] shadow-[0_0_10px_rgba(236,72,153,1)]"></div>
            </button>
          </div>

          <div onClick={onProfileClick} className="flex items-center gap-4 group cursor-pointer pl-2">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-black text-white tracking-tight">{profile.name || "Guest Scholar"}</p>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest opacity-70">
                {profile.isLoggedIn ? "Master Scholar" : "Not Authenticated"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-800 group-hover:border-cyan-400 transition-all p-0.5 bg-transparent">
               <div className="w-full h-full bg-slate-900/40 rounded-xl flex items-center justify-center">
                  <UserCircleIcon className="w-full h-full text-slate-400" />
               </div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
