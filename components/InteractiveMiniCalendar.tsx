"use client";

import { useState } from "react";
import { useUser } from "@/lib/UserContext";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CalendarIcon
} from "@heroicons/react/24/solid";

export default function InteractiveMiniCalendar() {
  const { profile } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  if (!profile.isLoggedIn) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const startOfMonth = new Date(year, month, 1);
  const startDay = startOfMonth.getDay();
  const endOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const today = new Date();

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const handleDayClick = (day: number) => setSelectedDate(new Date(year, month, day));

  const getEventsForDate = (date: Date) => 
    profile.events.filter(event => isSameDay(new Date(event.date), date));

  const hasEvents = (day: number) => getEventsForDate(new Date(year, month, day)).length > 0;

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="w-full h-full flex flex-col gap-8 animate-fadeIn">
      
      {/* Calendar Architecture */}
      <div className="bg-[#05070a] p-6 rounded-[32px] border border-white/5 shadow-inner">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handlePrevMonth} className="p-2 rounded-xl bg-slate-900 text-slate-500 hover:text-cyan-400 border border-white/5 transition-all">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <div className="text-sm font-black text-white uppercase italic tracking-widest border-b border-cyan-400/30 pb-1">
            {currentDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </div>
          <button onClick={handleNextMonth} className="p-2 rounded-xl bg-slate-900 text-slate-500 hover:text-cyan-400 border border-white/5 transition-all">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
            <div key={day} className="text-center text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="p-1" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const currentRenderDate = new Date(year, month, day);
            const isToday = isSameDay(currentRenderDate, today);
            const isSelected = selectedDate ? isSameDay(currentRenderDate, selectedDate) : false;
            const dayHasEvents = hasEvents(day);

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-2xl text-[11px] font-black italic transition-all active:scale-90 ${
                  isSelected
                    ? "bg-cyan-400 text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110 z-10"
                    : isToday
                      ? "bg-slate-900 border-2 border-cyan-400/50 text-cyan-400"
                      : "text-slate-500 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {day}
                {dayHasEvents && !isSelected && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                )}
                {dayHasEvents && isSelected && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-slate-950/40" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Targets Feed for Selected Date */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 min-h-[140px] scrollbar-thin scrollbar-thumb-slate-900">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5 pb-3 italic flex items-center gap-3">
          <CalendarIcon className="w-4 h-4 text-purple-400" />
          {selectedDate?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </h3>

        {selectedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-slate-950/50 rounded-3xl border border-white/5 border-dashed">
            <ExclamationCircleIcon className="w-8 h-8 text-slate-800 mb-2" />
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">No operations detected</p>
          </div>
        ) : (
          selectedEvents.map(event => (
            <div key={event.id} className="bg-[#0a0e14] p-5 rounded-3xl border border-white/5 shadow-2xl space-y-4 group">
              <div className="flex items-start justify-between">
                 <h4 className="text-base font-black text-white italic uppercase group-hover:text-cyan-400 transition-colors leading-none tracking-tight">
                   {event.name}
                 </h4>
                 {event.plan ? <CheckCircleIcon className="w-5 h-5 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed line-clamp-2 italic">
                {event.syllabus}
              </p>
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest pt-2 border-t border-white/5">
                 <span className={event.plan ? "text-emerald-400" : "text-amber-400"}>
                    {event.plan ? "Syllabus Deployed" : "Calibration Pending"}
                 </span>
                 <span className="text-slate-600 font-mono">
                    {new Date(event.date).toLocaleDateString()}
                 </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
