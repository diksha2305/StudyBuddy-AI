"use client";

import StudyPlanner from "./StudyPlanner";
import NotesInput from "./NotesInput";
import InsightCard from "./InsightCard";
import FocusTimer from "./FocusTimer";
import InteractiveMiniCalendar from "./InteractiveMiniCalendar";
import { 
  BookOpenIcon, 
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ArrowRightIcon
} from "@heroicons/react/24/solid";

interface DashboardGridProps {
  notesText: string;
  setNotesText: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
  setDifficulty: (diff: "Easy" | "Medium" | "Hard") => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
}

export default function DashboardGrid({
  notesText,
  setNotesText,
  onGenerate,
  isLoading,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount
}: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16 pb-24 animate-stagger relative">
      
      {/* 1. Smart Study Planner (Large) */}
      <div className="lg:col-span-8 space-y-8 animate-fadeInUp">
        <div className="bg-[#0a0e14] rounded-[32px] p-1 border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <StudyPlanner />
        </div>
      </div>

      {/* 2. Mini Calendar & Quick Stats (Small) */}
      <div className="lg:col-span-4 space-y-8 animate-fadeInUp" style={{ animationDelay: "100ms" }}>
        <div className="bg-[#0a0e14] rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 mb-8 relative">
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 shadow-inner group-hover:scale-110 transition-transform">
              <CalendarDaysIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none">Timeline</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Master Schedule</p>
            </div>
          </div>
          <div className="relative z-10">
            <InteractiveMiniCalendar />
          </div>
        </div>

        <FocusTimer />
      </div>

      {/* 3. Notes & PDF Intelligence (Medium) */}
      <div className="lg:col-span-7 space-y-8 animate-fadeInUp" style={{ animationDelay: "200ms" }}>
        <div className="bg-[#05070a] rounded-[40px] p-10 border-2 border-slate-900 shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative overflow-hidden group/notes">
          
          {/* Intense Gradient Accents for Visibility */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px] -mr-64 -mt-64 group-hover/notes:bg-cyan-400/10 transition-colors pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400/20 to-sky-600/20 rounded-2xl shadow-2xl border border-cyan-400/30 flex items-center justify-center group-hover/notes:scale-110 transition-transform duration-500">
                <BookOpenIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Notes Intelligence</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Industrial extraction: Active</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full border border-white/5 shadow-inner">
              <SparklesIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-0.5">Neural GPU Linked</span>
            </div>
          </div>

          <div className="relative z-10 transition-all duration-500 group-hover/notes:translate-y-[-2px]">
            <NotesInput 
              value={notesText}
              onChange={setNotesText}
              onGenerate={onGenerate}
              isLoading={isLoading}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
            />
          </div>
          
          <div className="mt-8 flex items-center gap-3 relative z-10 opacity-40 group-hover/notes:opacity-100 transition-opacity">
             <div className="flex-1 h-px bg-slate-800" />
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-none">End of operational stack</p>
             <div className="flex-1 h-px bg-slate-800" />
          </div>
        </div>
      </div>

      {/* 4. Performance Insights (Small) */}
      <div className="lg:col-span-5 animate-fadeInUp" style={{ animationDelay: "300ms" }}>
        <InsightCard />
      </div>

      {/* 5. Hero AI Tutor Landing Card */}
      <div className="lg:col-span-12 mt-12 animate-fadeInUp" style={{ animationDelay: "400ms" }}>
        <div className="bg-gradient-to-r from-[#0a0e14] via-indigo-900/10 to-[#0a0e14] rounded-[48px] p-12 border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12 group hover:border-cyan-400/30 transition-all cursor-pointer relative overflow-hidden shadow-3xl">
          
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          
          <div className="flex items-center gap-10 relative z-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-cyan-400 to-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(34,211,238,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Calibrate your AI Tutor</h3>
              <p className="text-lg text-slate-400 max-w-lg italic font-medium leading-relaxed">"System calibration required for real-time concept synthesis and flashcard generation."</p>
            </div>
          </div>
          
          <button className="relative group/btn whitespace-nowrap z-10">
             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-600 rounded-2xl blur opacity-30 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-200" />
             <div className="relative px-12 py-6 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all border border-white/10 flex items-center gap-4 text-lg italic uppercase tracking-tighter">
                Initialize session
                <ArrowRightIcon className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
             </div>
          </button>
        </div>
      </div>

    </div>
  );
}
