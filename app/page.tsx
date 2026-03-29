"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import HeroSection from "@/components/HeroSection";
import DashboardGrid from "@/components/DashboardGrid";
import SummaryDisplay from "@/components/SummaryDisplay";
import ChatCloudButton from "@/components/ChatCloudButton";
import ProfileModal from "@/components/ProfileModal";
import { validateText, cleanText } from "@/lib/textProcessing";
import { smoothScrollToElement, createConfetti } from "@/lib/animations";
import { useUser } from "@/lib/UserContext";

export interface SummaryData {
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

export default function Home() {
  const { profile } = useUser();
  
  // Dashboard states
  const [notesText, setNotesText] = useState("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  
  // Quiz states
  const [quizDifficulty, setQuizDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [quizCount, setQuizCount] = useState<number>(5);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // UI state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleGenerateSummary = async () => {
    const validation = validateText(notesText);
    if (!validation.valid) {
      setError(validation.error || "Invalid input");
      return;
    }

    setLoading(true);
    setError("");
    setSummaryData(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setProgress(0);

    try {
      const cleanedText = cleanText(notesText);

      // Call summarize API
      const summaryResponse = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanedText }),
      });

      if (!summaryResponse.ok) {
        throw new Error("Failed to generate summary");
      }

      const summaryResult = await summaryResponse.json();
      setProgress(50);

      // Call MCQ API
      const mcqResponse = await fetch("/api/generate_mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanedText,
          difficulty: quizDifficulty,
          count: quizCount,
        }),
      });

      if (!mcqResponse.ok) {
        throw new Error("Failed to generate MCQs");
      }

      const mcqResult = await mcqResponse.json();
      setProgress(100);

      setSummaryData({
        summary: summaryResult.summary,
        keyTerms: summaryResult.keyTerms,
        formulas: summaryResult.formulas || [],
        questions: mcqResult.questions,
      });

      createConfetti();
      
      setTimeout(() => {
        const resultsElement = document.getElementById("results-section");
        if (resultsElement) {
          smoothScrollToElement(resultsElement);
        }
      }, 300);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNotesText("");
    setSummaryData(null);
    setError("");
    setProgress(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerateTargetedQuiz = async () => {
     if (!summaryData || Object.keys(quizAnswers).length === 0) return;
     
     setLoading(true);
     setError("");
     
     try {
       // Identify topics from incorrect answers
       const incorrectTopics = summaryData.questions
         .filter((q, idx) => {
            const correctIndex = q.options.findIndex(o => o.trim().toLowerCase() === q.correct.trim().toLowerCase());
            const selectedIndex = quizAnswers[idx] ? quizAnswers[idx].charCodeAt(0) - 65 : -1;
            return selectedIndex !== correctIndex;
         })
         .map(q => q.question)
         .join(", ");

       if (!incorrectTopics) {
         alert("Absolute Mastery Detected! No remedial targets identified.");
         setLoading(false);
         return;
       }

       const response = await fetch("/api/generate_mcq", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           text: cleanText(notesText),
           difficulty: quizDifficulty,
           count: quizCount,
           targetedTopics: incorrectTopics
         }),
       });

       if (!response.ok) throw new Error("Remedial calibration failed");
       
       const result = await response.json();
       
       // Update summary data with new questions but keep the summary
       setSummaryData(prev => prev ? {
         ...prev,
         questions: result.questions
       } : null);
       
       // Reset quiz state for the new set
       setQuizAnswers({});
       setQuizSubmitted(false);
       setScore(0);
       createConfetti();

     } catch (err: unknown) {
       setError(err instanceof Error ? err.message : "Failed to generate targeted quiz");
     } finally {
       setLoading(false);
     }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-slate-950 text-slate-200 font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <TopNav onProfileClick={() => setIsProfileModalOpen(true)} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* State 1: Dashboard View */}
        {!summaryData ? (
          <div className="space-y-12">
            <HeroSection />
            <DashboardGrid 
              notesText={notesText}
              setNotesText={setNotesText}
              onGenerate={handleGenerateSummary}
              isLoading={loading}
              difficulty={quizDifficulty}
              setDifficulty={setQuizDifficulty}
              questionCount={quizCount}
              setQuestionCount={setQuizCount}
            />
          </div>
        ) : (
          /* State 2: Results View */
          <div id="results-section" className="animate-fadeInUp pt-8 space-y-8 pb-24">
            <div className="flex items-center justify-between glass-morphism p-6 rounded-3xl border border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Intelligence Report Ready</h2>
                  <p className="text-sm text-slate-400 font-medium">Your AI-generated summaries and quizzes are now live.</p>
                </div>
              </div>
              <button 
                onClick={handleReset}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition-all active:scale-95 border border-slate-700/50 flex items-center gap-2"
              >
                ← Back to Dashboard
              </button>
            </div>

            <SummaryDisplay 
              data={summaryData}
              onReset={handleReset}
              quizState={{
                quizAnswers,
                setQuizAnswers,
                quizSubmitted,
                setQuizSubmitted,
                score,
                setScore,
              }}
              onGenerateTargetedQuiz={handleGenerateTargetedQuiz}
            />
          </div>
        )}
      </main>

      {/* Floating Chat Interface */}
      <ChatCloudButton 
        contextData={{ profile, summaryData, quizAnswers, quizSubmitted }}
      />

      {/* Profile/Login Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Global Loading Bar */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 z-[100]">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-400 transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Sticky Bottom Feedback/Innovation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-slate-950 to-transparent pt-12 pb-6 px-6 pointer-events-none">
         <div className="max-w-7xl mx-auto flex items-center justify-center">
            <div className="glass-morphism px-4 py-2 rounded-full border border-slate-700/50 pointer-events-auto flex items-center gap-3 animate-fadeInUp">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Innovation:</span>
               <div className="h-4 w-px bg-slate-800" />
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Real-time Context Sync Active</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
