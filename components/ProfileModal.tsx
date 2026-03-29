"use client";

import { useState } from "react";
import { useUser } from "@/lib/UserContext";
import { 
  UserIcon, 
  AcademicCapIcon, 
  BuildingLibraryIcon, 
  BookOpenIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from "@heroicons/react/24/solid";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileModal({ isOpen, onClose }: Props) {
  const { profile, updateProfile, logout } = useUser();

  const [name, setName] = useState(profile.name || "");
  const [studyLevel, setStudyLevel] = useState(profile.studyLevel || "");
  const [school, setSchool] = useState(profile.school || "");
  const [course, setCourse] = useState(profile.course || "");

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      studyLevel,
      school,
      course,
      isLoggedIn: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fadeIn">
      {/* Heavy Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Obsidian Panel */}
      <div className="relative w-full max-w-xl bg-[#05070a] rounded-[48px] border-2 border-slate-900 p-12 shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden animate-scaleUp">
        
        {/* Visual Pulse Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 space-y-10">
          <div className="flex justify-between items-start border-b border-white/5 pb-8">
            <div className="space-y-1">
               <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Intelligence Profile</h2>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Core Synchronization: {profile.isLoggedIn ? "Active" : "New Link"}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-slate-900 rounded-2xl text-slate-500 hover:text-white transition-all border border-white/5"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Scalar</label>
                  <div className="relative group">
                    <UserIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-[#0a0e14] border-2 border-slate-900 rounded-2xl py-4 pl-14 pr-6 text-white font-bold transition-all focus:border-cyan-400/50 focus:ring-0 placeholder:text-slate-700"
                      placeholder="e.g. Alex Chen"
                    />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Capability Level</label>
                  <div className="relative group">
                    <AcademicCapIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                    <select
                      value={studyLevel}
                      onChange={(e) => setStudyLevel(e.target.value)}
                      required
                      className="w-full bg-[#0a0e14] border-2 border-slate-900 rounded-2xl py-4 pl-14 pr-10 text-white font-bold transition-all focus:border-cyan-400/50 focus:ring-0 appearance-none"
                    >
                      <option value="" disabled>Select Tier...</option>
                      <option value="High School">High School Candidate</option>
                      <option value="Undergraduate">Undergraduate Elite</option>
                      <option value="Postgraduate">Postgraduate Scholar</option>
                      <option value="Professional">Professional Architect</option>
                    </select>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Node</label>
                  <div className="relative group">
                    <BuildingLibraryIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      required
                      className="w-full bg-[#0a0e14] border-2 border-slate-900 rounded-2xl py-4 pl-14 pr-6 text-white font-bold transition-all focus:border-cyan-400/50 focus:ring-0 placeholder:text-slate-700"
                      placeholder="e.g. Oxford / Remote Hub"
                    />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Discipline</label>
                  <div className="relative group">
                    <BookOpenIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      required
                      className="w-full bg-[#0a0e14] border-2 border-slate-900 rounded-2xl py-4 pl-14 pr-6 text-white font-bold transition-all focus:border-cyan-400/50 focus:ring-0 placeholder:text-slate-700"
                      placeholder="e.g. Quantum Computing"
                    />
                  </div>
               </div>
            </div>

            <div className="pt-6 space-y-6">
               <button
                 type="submit"
                 className="w-full relative group/btn"
               >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-600 rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition duration-1000" />
                  <div className="relative py-5 bg-slate-900 hover:bg-black border-2 border-slate-900 group-hover/btn:border-cyan-400/30 text-white font-black rounded-2xl transition-all shadow-3xl text-lg italic uppercase tracking-tighter flex items-center justify-center gap-4">
                    {profile.isLoggedIn ? "Commit Modifications" : "Initialize Neural Link"}
                    <ArrowRightIcon className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </div>
               </button>

               {profile.isLoggedIn && (
                 <button
                   type="button"
                   onClick={() => { logout(); onClose(); }}
                   className="w-full py-4 bg-[#0a0e14] text-rose-500 font-black rounded-2xl border border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all text-[10px] uppercase tracking-[0.2em] italic"
                 >
                   Sever Neural Connection (Logout)
                 </button>
               )}
            </div>
          </form>

          <div className="pt-4 flex items-center justify-center gap-3 opacity-30">
             <ShieldCheckIcon className="w-4 h-4 text-cyan-400" />
             <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Encrypted Synchronization: 256-Bit SSL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
