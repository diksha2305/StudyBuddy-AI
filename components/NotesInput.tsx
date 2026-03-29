"use client";

import { useState, useRef, ChangeEvent } from "react";
import { 
  CloudArrowUpIcon, 
  DocumentArrowUpIcon,
  SparklesIcon,
  ChevronRightIcon
} from "@heroicons/react/24/solid";

interface NotesInputProps {
  value: string;
  onChange: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
  setDifficulty: (diff: "Easy" | "Medium" | "Hard") => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
}

export default function NotesInput({
  value,
  onChange,
  onGenerate,
  isLoading,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount
}: NotesInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setFileName(file.name);
        try {
          const { extractPDFText } = await import("@/lib/pdfExtractor");
          const text = await extractPDFText(file);
          onChange(text);
          setFileName(`✓ Extracted ${file.name}`);
        } catch (err) {
          setFileName(`✗ Failed: ${file.name}`);
        }
      } else {
        alert("System error: Only PDF formats are accepted for intelligent extraction.");
      }
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      try {
        const { extractPDFText } = await import("@/lib/pdfExtractor");
        const text = await extractPDFText(file);
        onChange(text);
        setFileName(`✓ Extracted ${file.name}`);
      } catch (err) {
        setFileName(`✗ Failed: ${file.name}`);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Target Area: Input */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Operational Input Area</label>
             <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest leading-none bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">Ready for data</span>
        </div>
        
        <div className="bg-[#0a0e14] rounded-[32px] border-2 border-slate-950 p-6 shadow-3xl group overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
            
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="No notes yet — upload a PDF or type to begin learning smarter..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-600 min-h-[250px] text-lg font-medium leading-relaxed resize-none transition-all scrollbar-thin scrollbar-thumb-slate-800"
            />

            {/* Float Menu for File Upload */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                 {fileName && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl text-emerald-400 text-xs font-black animate-fadeInScale">
                       <DocumentArrowUpIcon className="w-4 h-4" />
                       {fileName}
                    </div>
                 )}
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   onDragEnter={handleDrag}
                   onDragOver={handleDrag}
                   onDragLeave={handleDrag}
                   onDrop={handleDrop}
                   className={`p-3 rounded-2xl border transition-all shadow-xl group/btn ${dragActive ? "bg-cyan-500 text-slate-900 border-cyan-400 scale-105" : "bg-slate-900 border-white/5 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50"}`}
                 >
                   <CloudArrowUpIcon className="w-6 h-6" />
                 </button>
                 <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
            </div>
        </div>
      </div>

      {/* Control Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
               <SparklesIcon className="w-3.5 h-3.5 text-cyan-400" />
               Difficulty Calibration
            </h4>
            <div className="flex gap-2">
              {["Easy", "Medium", "Hard"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl as any)}
                  className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-tighter text-[11px] transition-all border ${
                    difficulty === lvl 
                      ? "bg-slate-950 border-cyan-400/50 text-white shadow-lg italic" 
                      : "bg-transparent border-transparent text-slate-600 hover:text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
               <SparklesIcon className="w-3.5 h-3.5 text-indigo-400" />
               Quantity Threshold
            </h4>
            <div className="flex gap-2">
              {[5, 10, 15].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-tighter text-[11px] transition-all border ${
                    questionCount === count 
                      ? "bg-slate-950 border-indigo-400/50 text-white shadow-lg italic" 
                      : "bg-transparent border-transparent text-slate-600 hover:text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {count} Qs
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-6">
          <button 
            onClick={onGenerate}
            disabled={isLoading || !value.trim()}
            className="w-full relative group/gen disabled:opacity-30 disabled:cursor-not-allowed"
          >
             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-500 rounded-[28px] blur-sm opacity-20 group-hover/gen:opacity-100 transition duration-1000" />
             <div className="relative bg-[#05070a] hover:bg-black py-6 rounded-[24px] border-2 border-slate-900 flex items-center justify-center gap-6 transition-all shadow-3xl group-hover/gen:border-cyan-400/30">
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xl font-black text-white italic uppercase tracking-tighter">Calibrating Neural Sync...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl font-black text-white italic uppercase tracking-tighter">Initialize Intelligence Synthesis</span>
                    <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center group-hover/gen:translate-x-3 transition-transform">
                       <ChevronRightIcon className="w-5 h-5" />
                    </div>
                  </>
                )}
             </div>
          </button>
          <p className="text-center mt-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">
             Neural Extraction Technology © 2026 / Smart Academic Core
          </p>
      </div>

    </div>
  );
}
