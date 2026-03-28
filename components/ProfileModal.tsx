"use client";

import { useState } from "react";
import { useUser } from "@/lib/UserContext";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.15)] p-6 overflow-hidden animate-scaleIn">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold gradient-text">Student Profile</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="e.g. Alex Chen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Study Level</label>
              <select
                value={studyLevel}
                onChange={(e) => setStudyLevel(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
              >
                <option value="" disabled>Select Level...</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate / College</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Professional">Professional / Certification</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Institution</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="e.g. MIT, Regional High School"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Target Course / Major</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="e.g. AP Physics, Computer Science"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)]"
              >
                {profile.isLoggedIn ? "Save Changes" : "Initialize Neural Profile"}
              </button>
            </div>
            
            {profile.isLoggedIn && (
              <div className="pt-2">
                 <button
                   type="button"
                   onClick={() => {
                     logout();
                     onClose();
                   }}
                   className="w-full bg-slate-800 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-slate-700 hover:border-red-500/50 py-2 rounded-lg transition-all text-sm font-semibold"
                 >
                   Disconnect (Logout)
                 </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
