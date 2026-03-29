"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { createConfetti, staggerElements } from "@/lib/animations";
import { 
  BookOpenIcon, 
  TagIcon, 
  VariableIcon, 
  QuestionMarkCircleIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";

interface SummaryData {
  summary: string;
  keyTerms: Array<{ term: string; definition: string }>;
  formulas?: Array<{ name: string; formula: string; explanation: string }>;
  questions: Array<{
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }>;
}

interface Props {
  data: SummaryData;
  onReset: () => void;
  onGenerateTargetedQuiz: () => void;
  quizState: {
    quizAnswers: Record<number, string>;
    setQuizAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
    quizSubmitted: boolean;
    setQuizSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
  };
}

type TabType = "summary" | "terms" | "formulas" | "quiz";

function preprocessSummary(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .trim();
}

function preprocessMath(text: string): string {
  if (!text) return "";
  const cleanedText = preprocessSummary(text);
  const segments = cleanedText.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g);

  return segments
    .map((segment) => {
      if (segment.startsWith("$")) return segment;
      return segment.replace(
        /\\(?!begin|end|item|n|t)([a-zA-Z]+(?:\{[^}]*\})*(?:\[[^\]]*\])?)/g,
        (match) => `$${match}$`
      );
    })
    .join("");
}

export default function SummaryDisplay({ data, onReset, onGenerateTargetedQuiz, quizState }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const { quizAnswers, setQuizAnswers, quizSubmitted, setQuizSubmitted, score, setScore } = quizState;

  useEffect(() => {
    const tabElements = document.querySelectorAll("[data-tab-content]");
    staggerElements(Array.from(tabElements) as HTMLElement[]);
  }, [activeTab]);

  const getCorrectOptionIndex = (question: SummaryData["questions"][number]) => {
    const normalizedCorrect = question.correct.trim();
    if (/^[A-D]$/i.test(normalizedCorrect)) {
      return normalizedCorrect.toUpperCase().charCodeAt(0) - 65;
    }
    return question.options.findIndex(
      (option) => option.trim().toLowerCase() === normalizedCorrect.toLowerCase()
    );
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (!quizSubmitted) {
      setQuizAnswers((prev) => ({
        ...prev,
        [questionIndex]: String.fromCharCode(65 + optionIndex),
      }));
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    data.questions.forEach((question, index) => {
      const selectedIndex = quizAnswers[index] ? quizAnswers[index].charCodeAt(0) - 65 : -1;
      if (selectedIndex === getCorrectOptionIndex(question)) correctCount++;
    });
    setScore(correctCount);
    setQuizSubmitted(true);
    if (correctCount === data.questions.length) createConfetti();
  };

  const tabs = [
    { id: "summary" as TabType, label: "Summary", icon: BookOpenIcon, color: "text-cyan-400" },
    { id: "terms" as TabType, label: "Key Terms", icon: TagIcon, color: "text-indigo-400" },
    ...(data.formulas && data.formulas.length > 0
      ? [{ id: "formulas" as TabType, label: "Formulas", icon: VariableIcon, color: "text-pink-400" }]
      : []),
    { id: "quiz" as TabType, label: "Quiz", icon: QuestionMarkCircleIcon, color: "text-emerald-400" },
  ];

  return (
    <div className="animate-fadeInUp space-y-12 pb-24">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#0a0e14] p-8 rounded-[40px] border border-white/10 shadow-3xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Intelligence Report</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">{data.questions.length} Diagnostic queries generated</p>
          </div>
        </div>
        <button onClick={onReset} className="px-8 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl border border-white/10 flex items-center gap-3 transition-all active:scale-95 shadow-xl relative z-10 uppercase italic tracking-tighter">
           <ArrowPathIcon className="w-5 h-5" /> New Analysis
        </button>
      </div>

      {/* Modern Navigation */}
      <div className="flex flex-wrap items-center gap-4 bg-[#05070a] p-3 rounded-[32px] border border-white/5 shadow-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-500 border ${
                isActive 
                  ? "bg-slate-900 border-cyan-400/50 text-white shadow-[0_10px_30px_rgba(0,242,255,0.1)]" 
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? tab.color : "text-slate-600"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-[#05070a] rounded-[48px] border-2 border-slate-900 p-12 shadow-[0_60px_100px_rgba(0,0,0,0.9)] relative overflow-hidden">
        
        {/* Deep Summary Tab */}
        {activeTab === "summary" && (
          <div data-tab-content className="animate-fadeIn space-y-12">
            <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:text-lg prose-headings:text-white prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-cyan-400 prose-blockquote:bg-slate-900 prose-blockquote:border-cyan-400/50 prose-pre:bg-[#0a0e14]">
              <ReactMarkdown 
                remarkPlugins={[remarkMath]} 
                rehypePlugins={[rehypeKatex]}
              >
                {preprocessMath(data.summary)}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Key Terms Grid */}
        {activeTab === "terms" && (
          <div data-tab-content className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.keyTerms.map((term, index) => (
              <div key={index} className="bg-slate-900 p-8 rounded-3xl border border-white/5 hover:border-cyan-400/30 transition-all group shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 text-cyan-400 font-black text-xs border border-cyan-400/20">
                      {index + 1}
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-white italic uppercase group-hover:text-cyan-400 transition-colors">
                         <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{preprocessMath(term.term)}</ReactMarkdown>
                      </h4>
                      <div className="text-slate-400 mt-3 text-sm leading-relaxed font-medium">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{preprocessMath(term.definition)}</ReactMarkdown>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulas Specialized View */}
        {activeTab === "formulas" && data.formulas && (
          <div data-tab-content className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.formulas.map((item, index) => (
              <div key={index} className="bg-[#0a0e14] p-10 rounded-[40px] border border-white/10 hover:border-pink-500/30 transition-all group flex flex-col justify-between shadow-2xl">
                 <div className="space-y-6">
                   <div className="flex items-center gap-4 text-pink-400">
                      <VariableIcon className="w-8 h-8" />
                      <h4 className="text-2xl font-black italic uppercase text-white group-hover:text-pink-400 transition-colors border-l-4 border-pink-500 pl-4 leading-none">
                         <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{preprocessMath(item.name)}</ReactMarkdown>
                      </h4>
                   </div>
                   <div className="bg-black/40 p-10 rounded-3xl border border-white/5 shadow-inner text-cyan-400 overflow-x-auto text-center text-xl font-mono">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{preprocessMath(item.formula)}</ReactMarkdown>
                   </div>
                 </div>
                 <div className="mt-8 pt-8 border-t border-white/10 text-slate-400 text-sm leading-relaxed font-medium italic">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{preprocessMath(item.explanation)}</ReactMarkdown>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Quiz Advanced Interface */}
        {activeTab === "quiz" && (
          <div data-tab-content className="animate-fadeIn space-y-12">
            
            {quizSubmitted && (
               <div className="bg-slate-900 border-2 border-cyan-400/30 p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-12 shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-400/5 to-transparent pointer-events-none" />
                  <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                     <svg className="w-full h-full -rotate-90">
                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 * (1 - score / data.questions.length)} className="text-cyan-400 transition-all duration-1000" strokeLinecap="round" />
                     </svg>
                     <div className="absolute text-3xl font-black text-white italic">{Math.round((score / data.questions.length) * 100)}%</div>
                  </div>
                  <div className="text-center md:text-left">
                     <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Diagnostic Result: {score === data.questions.length ? "Elite" : "Calibrating"}</h3>
                     <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">Total Score: {score} / {data.questions.length} Concepts Resolved</p>
                  </div>
               </div>
            )}

            <div className="space-y-10">
               {data.questions.map((question, qIndex) => (
                 <div key={qIndex} className="bg-slate-900/40 p-8 rounded-[32px] border border-white/5 space-y-8">
                    <div className="flex items-start gap-6">
                       <span className="w-10 h-10 rounded-2xl bg-cyan-400 text-slate-900 flex items-center justify-center font-black italic text-lg shadow-xl shrink-0 mt-1">
                          {qIndex + 1}
                       </span>
                       <div className="text-xl font-bold text-white leading-relaxed pt-2">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{preprocessMath(question.question)}</ReactMarkdown>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-16">
                       {question.options.map((option, oIndex) => {
                          const isSelected = quizAnswers[qIndex] === String.fromCharCode(65 + oIndex);
                          const isCorrect = oIndex === getCorrectOptionIndex(question);
                          const showResult = quizSubmitted;

                          return (
                            <button
                              key={oIndex}
                              onClick={() => handleAnswerSelect(qIndex, oIndex)}
                              disabled={quizSubmitted}
                              className={`relative p-6 text-left rounded-3xl border-2 transition-all duration-300 font-bold group/option overflow-hidden ${
                                showResult 
                                  ? isCorrect ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-100" : isSelected ? "bg-rose-500/20 border-rose-500/50 text-rose-100" : "bg-slate-950 border-slate-900 opacity-40"
                                  : isSelected ? "bg-cyan-500/10 border-cyan-400 text-white shadow-3xl" : "bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800 hover:bg-slate-900"
                              }`}
                            >
                              <div className="flex items-center gap-4 relative z-10 font-bold uppercase tracking-tighter italic">
                                 <span className={`w-8 h-8 flex items-center justify-center rounded-xl border-2 ${isSelected ? "border-cyan-400 bg-cyan-400 text-slate-900" : "border-slate-800"} shrink-0`}>
                                    {String.fromCharCode(65 + oIndex)}
                                 </span>
                                 <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{preprocessMath(option)}</ReactMarkdown>
                              </div>
                            </button>
                          );
                       })}
                    </div>

                    {quizSubmitted && (
                       <div className="ml-16 p-8 bg-slate-950 rounded-3xl border border-white/5 shadow-inner">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
                             <CheckBadgeIcon className="w-4 h-4" /> Final Analysis & Explanation
                          </h5>
                          <div className="text-slate-300 italic leading-relaxed">
                             <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{preprocessMath(question.explanation)}</ReactMarkdown>
                          </div>
                       </div>
                    )}
                 </div>
               ))}
            </div>

            <div className="pt-12 flex justify-center">
               {!quizSubmitted ? (
                  <button onClick={handleSubmitQuiz} disabled={Object.keys(quizAnswers).length !== data.questions.length} className="btn-premium w-full max-w-lg text-lg uppercase tracking-widest disabled:opacity-30">
                     Complete Diagnostic session
                  </button>
               ) : (
                  <div className="flex flex-wrap gap-6 w-full max-w-2xl">
                     <button onClick={onGenerateTargetedQuiz} className="flex-1 px-8 py-5 bg-gradient-to-br from-indigo-600 to-purple-800 text-white font-black rounded-3xl shadow-3xl hover:scale-105 transition-all text-sm uppercase italic">Target Weakness Core</button>
                     <button onClick={onReset} className="flex-1 px-8 py-5 bg-slate-900 text-white font-black rounded-3xl border border-white/10 hover:bg-black transition-all text-sm uppercase italic">New Material Input</button>
                  </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
