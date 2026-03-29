"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, Event } from "@/lib/UserContext";
import { extractPDFText } from "@/lib/pdfExtractor";
import { calculateEventSchedule } from "@/lib/scheduler";
import { 
  SparklesIcon, 
  PlusIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  VideoCameraIcon,
  PhoneIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ClockIcon,
  MapIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/solid";

// Logic for task status across all active events
const getTypeStyles = (type: string) => {
  switch (type?.toLowerCase()) {
    case "high yield": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30";
    case "quick win": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
    case "concept": return "text-indigo-400 bg-indigo-400/10 border-indigo-400/30";
    case "revision": return "text-pink-400 bg-pink-400/10 border-pink-400/30";
    default: return "text-slate-400 bg-white/5 border-white/10";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "high": return "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]";
    case "medium": return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]";
    default: return "bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.6)]";
  }
};

function TaskCard({ task, taskId, eventId, isCompleted, onToggle }: { task: any; taskId: string; eventId: string; isCompleted: boolean; onToggle: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const typeStyles = getTypeStyles(task.type);

  // Focus event for Context-Aware AI tracking
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent("focus-event", { 
        detail: { eventId, eventName: task.task } 
      }));
    }
  }, [isOpen, eventId, task.task]);

  return (
    <div className={`group relative bg-[#0a0e14] rounded-3xl border-2 transition-all duration-500 overflow-hidden ${isCompleted ? "border-emerald-500/20 opacity-60" : "border-slate-900 hover:border-cyan-400/30 shadow-2xl"}`}>
      <div className="flex items-stretch min-h-[100px]">
        {/* Verification Hub */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (task.type?.toLowerCase().includes("rest") || task.type?.toLowerCase().includes("meal")) { 
              onToggle(); 
              return; 
            }
            window.dispatchEvent(new CustomEvent("verify-task", { 
              detail: { taskId, taskName: task.task, eventId } 
            }));
          }}
          disabled={isCompleted}
          className={`w-20 flex flex-col items-center justify-center gap-2 border-r-2 transition-all ${isCompleted ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-slate-950 border-slate-900 text-slate-600 hover:text-cyan-400 hover:bg-black"}`}
        >
          {isCompleted ? <CheckCircleIcon className="w-8 h-8" /> : <SparklesIcon className="w-6 h-6 animate-pulse" />}
          <span className="text-[8px] font-black uppercase tracking-tighter leading-none">{isCompleted ? "Done" : "Verify"}</span>
        </button>

        {/* Content Section */}
        <div onClick={() => setIsOpen(!isOpen)} className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest leading-none ${typeStyles}`}>
                 {task.type || "Protocol"}
               </span>
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{task.priority} Prio</span>
               </div>
            </div>
            <h4 className={`text-xl font-black tracking-tight leading-tight italic uppercase ${isCompleted ? "text-slate-500 line-through" : "text-white"}`}>
              {task.task}
            </h4>
            <p className="text-xs text-slate-500 font-medium italic opacity-80">"{task.reason}"</p>
          </div>

          <div className="flex items-center gap-8 text-right underline-offset-4 decoration-cyan-400/30 decoration-2">
             <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Schedule Loop</p>
                <p className="text-sm font-black text-cyan-400 italic leading-none">{task.timeSlot}</p>
             </div>
             <ChevronDownIcon className={`w-6 h-6 text-slate-700 transition-transform duration-500 ${isOpen ? "rotate-180 text-cyan-400" : ""}`} />
          </div>
        </div>
      </div>
      
      {/* Detailed Expansion */}
      {isOpen && task.estimated_time && (
        <div className="px-8 pb-6 animate-fadeInDown">
          <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 space-y-2">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <ClockIcon className="w-3 h-3 text-indigo-400" /> Planned Duration: {task.estimated_time}
             </div>
             <p className="text-xs text-slate-400 leading-relaxed italic">
               Optimization Tip: This task is calibrated for your peak focus window. Maintain hydration and zero-distraction.
             </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AILoadingOverlay({ eventName }: { eventName: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-fadeIn">
      <div className="max-w-md w-full p-8 text-center space-y-10">
        <div className="relative w-40 h-40 mx-auto">
           <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full animate-spin-slow" />
           <div className="absolute inset-2 border-4 border-indigo-500/20 rounded-full animate-reverse-spin" />
           <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanLine opacity-50" />
           <div className="absolute inset-0 flex items-center justify-center">
              <SparklesIcon className="w-16 h-16 text-cyan-400 animate-pulse" />
           </div>
        </div>
        <div className="space-y-2">
           <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Calibrating Strategy</h3>
           <p className="text-xs text-cyan-400 font-black uppercase tracking-widest">Target: {eventName}</p>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
           <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 animate-loadingProgress" />
        </div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">Simulating optimal memory pathways for 8k+ concepts...</p>
      </div>
    </div>
  );
}

export default function StudyPlanner() {
  const { profile, addEvent, updateEvent, toggleTaskCompletion, updateEventPlanTasks, syncAllSchedules } = useUser();
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filePreview, setFilePreview] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  // Aggregate Today's Protocol across all events
  const [todaysTasks, setTodaysTasks] = useState<any[]>([]);

  useEffect(() => {
    const tasks = profile.events.flatMap((event: Event) => {
      const schedule = calculateEventSchedule(event);
      return schedule.map((task: any, idx: number) => ({
        ...task,
        eventId: event.id,
        internalId: `task-${event.id}-${idx}`,
        isCompleted: event.completedTasks?.includes(`task-${event.id}-${idx}`) || false
      }));
    });
    setTodaysTasks(tasks);
  }, [profile.events]);

  // Voice Agent & Status Synchronization Listener
  useEffect(() => {
    const handleSync = () => syncAllSchedules();
    window.addEventListener("sync-schedule", handleSync);

    const controller = new AbortController();
    const poller = setInterval(async () => {
      try {
        const res = await fetch("/api/twilio/status", { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (data && data.updateAvailable && data.eventId) {
            updateEventPlanTasks(data.eventId, data.newTasks);
            import("@/lib/animations").then(lib => lib.createConfetti());
          }
        }
      } catch (e) {}
    }, 5000);

    return () => {
      window.removeEventListener("sync-schedule", handleSync);
      clearInterval(poller);
      controller.abort();
    };
  }, [syncAllSchedules, updateEventPlanTasks]);

  const handleSyllabusUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsExtracting(true);
    setFilePreview(`📄 ${file.name}`);
    try {
      const text = await extractPDFText(file);
      setSyllabus(text);
      setFilePreview(`✓ Extracted ${file.name}`);
    } catch (err) {
      setFilePreview("✗ Failed to extract PDF");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Asynchronous state update safe handling
    const newEvent = addEvent({ 
      name: examName, 
      date: examDate, 
      syllabus, 
      phoneNumber 
    });
    
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          profile: { ...profile, events: [...profile.events, newEvent] }, 
          event: newEvent 
        })
      });
      if (res.ok) {
        const data = await res.json();
        updateEvent(newEvent.id, { plan: data });
      }
    } catch (err) { 
      console.error("Neural calibration failed", err); 
    } finally { 
      setIsLoading(false); 
      setIsModalOpen(false);
      setExamName("");
      setExamDate("");
      setSyllabus("");
      setPhoneNumber("");
      setFilePreview("");
    }
  };

  return (
    <div className="space-y-12 pb-24 relative">
      {isLoading && <AILoadingOverlay eventName={examName || "New Protocol"} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Command Center</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 italic">Active Target Synchronization: {profile.events.length > 0 ? "98%" : "Pending Initialization"}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-indigo-600 text-slate-900 font-black rounded-2xl flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.3)] uppercase italic tracking-tighter"
        >
          <PlusIcon className="w-5 h-5" /> Initialize Target
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Active Protocol Feed */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                 <ClockIcon className="w-6 h-6 text-cyan-400" /> Today's Protocol
              </h3>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{todaysTasks.length} Operations Queued</span>
           </div>

           <div className="space-y-6">
              {todaysTasks.length === 0 ? (
                <div className="bg-[#0a0e14] rounded-[40px] p-24 border-2 border-slate-900 border-dashed text-center space-y-4 group">
                   <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center border border-white/5 transition-transform duration-700 group-hover:rotate-12">
                      <CalendarIcon className="w-10 h-10 text-slate-700" />
                   </div>
                   <p className="text-xl font-black text-slate-500 italic uppercase">No active operations detected.</p>
                </div>
              ) : (
                todaysTasks.map((task, idx) => (
                  <TaskCard 
                    key={idx} 
                    task={task} 
                    taskId={task.internalId} 
                    eventId={task.eventId} 
                    isCompleted={task.isCompleted} 
                    onToggle={() => toggleTaskCompletion(task.eventId, task.internalId)} 
                  />
                ))
              )}
           </div>
        </div>

        {/* Intelligence Side-Stats */}
        <div className="lg:col-span-4 space-y-10">
           <div className="bg-[#0a0e14] p-8 rounded-[40px] border border-white/10 shadow-3xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Strategic Depth</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global Mastery Ranking</p>
              </div>
              <div className="relative h-48 flex items-center justify-center">
                 <svg className="w-40 h-40 -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900" />
                    <circle 
                      cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 70} 
                      strokeDashoffset={2 * Math.PI * 70 * (1 - (todaysTasks.length > 0 ? todaysTasks.filter(t => t.isCompleted).length / todaysTasks.length : 0))} 
                      className="text-cyan-400 transition-all duration-1000" strokeLinecap="round" 
                    />
                 </svg>
                 <div className="absolute text-3xl font-black text-white italic font-mono">
                    {todaysTasks.length > 0 ? Math.round((todaysTasks.filter(t => t.isCompleted).length / todaysTasks.length) * 100) : 0}%
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Resolved</p>
                    <p className="text-lg font-black text-white italic">{todaysTasks.filter(t => t.isCompleted).length}/{todaysTasks.length}</p>
                 </div>
                 <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Calibration</p>
                    <p className="text-lg font-black text-cyan-400 italic">Optimal</p>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-cyan-500/10 to-transparent p-8 rounded-[32px] border border-cyan-400/20 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                 <ExclamationTriangleIcon className="w-6 h-6" />
                 <h4 className="text-sm font-black uppercase tracking-widest">AI DRILL ALERT</h4>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                "{todaysTasks.length > 0 ? "Active session tracking engaged. Maintain high performance." : "System idle. Initialize a new target to generate optimization roadmap."}"
              </p>
           </div>
        </div>
      </div>

      {/* Initialize Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6">
           <div className="bg-[#05070a] w-full max-w-2xl rounded-[48px] border-2 border-slate-900 p-12 shadow-[0_0_100px_rgba(0,0,0,0.9)] space-y-10 animate-scaleUp">
              <div className="space-y-1">
                 <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Target Initialization</h3>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Neural Protocol Setup</p>
              </div>
              
              <form onSubmit={handleGenerate} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descriptor</label>
                       <input value={examName} onChange={e => setExamName(e.target.value)} required placeholder="e.g. Adv. Calculus Final" className="w-full bg-slate-900 border-2 border-slate-900 focus:border-cyan-400/50 rounded-2xl py-5 px-6 text-white font-bold transition-all focus:ring-0" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deadline Date</label>
                       <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} required className="w-full bg-slate-900 border-2 border-slate-900 focus:border-cyan-400/50 rounded-2xl py-5 px-6 text-white font-bold transition-all focus:ring-0 appearance-none" />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Core Syllabus Data</label>
                    <div className="relative group">
                       <input 
                         type="file" 
                         onChange={handleSyllabusUpload} 
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                         accept=".pdf" 
                       />
                       <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl p-8 text-center transition-all group-hover:border-cyan-400/30">
                          {isExtracting ? (
                             <div className="flex items-center justify-center gap-3">
                                <ArrowPathIcon className="w-5 h-5 text-cyan-400 animate-spin" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">Extracting...</span>
                             </div>
                          ) : (
                             <div className="space-y-1">
                                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">{filePreview || "Upload Syllabus PDF"}</p>
                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">or paste data manually below</p>
                             </div>
                          )}
                       </div>
                    </div>
                    <textarea value={syllabus} onChange={e => setSyllabus(e.target.value)} placeholder="Topics to cover..." className="w-full bg-slate-900 border-2 border-slate-900 focus:border-cyan-400/50 rounded-2xl py-4 px-6 text-white font-bold min-h-[120px] transition-all focus:ring-0 text-sm" />
                 </div>

                 <div className="space-y-3 bg-green-500/5 p-6 rounded-3xl border border-green-500/10">
                    <label className="text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                       <PhoneIcon className="w-4 h-4" /> Agentic Override Number
                    </label>
                    <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+1 234 567 8900" className="w-full bg-transparent border-none text-white font-mono text-lg focus:ring-0" />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-900 text-white font-black rounded-2xl border border-white/5 uppercase italic tracking-tighter hover:bg-black transition-all">Abort</button>
                    <button type="submit" className="flex-[2] py-5 bg-cyan-400 text-slate-900 font-black rounded-2xl shadow-3xl uppercase italic tracking-tighter hover:bg-cyan-300 transition-all">Initialize Generation</button>
                 </div>
              </form>
           </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes loadingProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-scanLine {
          animation: scanLine 2s ease-in-out infinite;
        }
        .animate-loadingProgress {
          animation: loadingProgress 15s linear forwards;
        }
      `}</style>
    </div>
  );
}
