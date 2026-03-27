"use client";

import { useState, useEffect } from "react";
import NotesInput from "@/components/NotesInput";
import SummaryDisplay from "@/components/SummaryDisplay";
import ChatCloudButton from "@/components/ChatCloudButton";
import { validateText, cleanText } from "@/lib/textProcessing";
import { smoothScrollToElement, createConfetti } from "@/lib/animations";

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
  const [text, setText] = useState("");
  // Live state for dashboard
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  
  // Dashboard quiz state lifted for Chat bot context
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [quizDifficulty, setQuizDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [quizCount, setQuizCount] = useState<number>(5);

  const handleTextInput = (inputText: string) => {
    setText(inputText);
    setError("");
  };

  const handleGenerateSummary = async () => {
    const validation = validateText(text);
    if (!validation.valid) {
      setError(validation.error || "Invalid input");
      return;
    }

    setLoading(true);
    setError("");
    // Reset summary and quiz states to properly load new content
    setSummaryData(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setProgress(0);

    try {
      const cleanedText = cleanText(text);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 300);

      // Call summarize API
      const summaryResponse = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanedText }),
      });

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        throw new Error(errorData.error || "Failed to generate summary");
      }

      const summaryResult = await summaryResponse.json();
      setProgress(40);

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
        const errorData = await mcqResponse.json();
        throw new Error(errorData.error || "Failed to generate MCQs");
      }

      const mcqResult = await mcqResponse.json();
      setProgress(100);

      setSummaryData({
        summary: summaryResult.summary,
        keyTerms: summaryResult.keyTerms,
        formulas: summaryResult.formulas || [],
        questions: mcqResult.questions,
      });

      // Scroll to results with smooth animation
      setTimeout(() => {
        const resultsElement = document.getElementById("results-section");
        if (resultsElement) {
          smoothScrollToElement(resultsElement);
        }
      }, 300);

      clearInterval(progressInterval);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      setError(message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText("");
    setSummaryData(null);
    setError("");
    setProgress(0);
    
    // Smooth scroll back to top
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 200);
  };

  const handleGenerateTargetedQuiz = async () => {
    if (!summaryData) return;
    
    // Find incorrectly answered questions
    const incorrectQuestions = summaryData.questions.filter((q, index) => {
      const selectedLetter = quizAnswers[index];
      if (!selectedLetter) return true; // Unanswered counts as incorrect
      
      const normalizedCorrect = q.correct.trim();
      let correctIndex;
      if (/^[A-D]$/i.test(normalizedCorrect)) {
        correctIndex = normalizedCorrect.toUpperCase().charCodeAt(0) - 65;
      } else {
        correctIndex = q.options.findIndex(opt => opt.trim().toLowerCase() === normalizedCorrect.toLowerCase());
      }
      
      const selectedIndex = selectedLetter.charCodeAt(0) - 65;
      return selectedIndex !== correctIndex;
    }).map(q => q.question).join("\\n- ");

    setLoading(true);
    setError("");

    try {
      const cleanedText = cleanText(text);
      const mcqResponse = await fetch("/api/generate_mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanedText,
          difficulty: quizDifficulty,
          count: quizCount,
          targetedTopics: incorrectQuestions ? `- ${incorrectQuestions}` : undefined
        }),
      });

      if (!mcqResponse.ok) {
        const errorData = await mcqResponse.json();
        throw new Error(errorData.error || "Failed to generate targeted MCQs");
      }

      const mcqResult = await mcqResponse.json();

      setSummaryData({
        ...summaryData,
        questions: mcqResult.questions,
      });

      setQuizAnswers({});
      setQuizSubmitted(false);
      setScore(0);

      setTimeout(() => {
        const resultsElement = document.getElementById("results-section");
        if (resultsElement) {
          smoothScrollToElement(resultsElement);
        }
      }, 300);
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error generating targeted quiz";
      setError(message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Ambient Moving Orbs */}
      {/* Optimized Background Orbs (removed heavy blurs and blend modes) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[80px] animate-float opacity-50 will-change-transform" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[80px] animate-float opacity-40 will-change-transform" style={{ animationDuration: '15s', animationDelay: '2s' }} />
      </div>

      {/* Sidebar (Floating Logo on Desktop, Top on Mobile) */}
      <aside className="relative md:fixed md:left-0 md:top-0 w-full md:w-auto flex flex-col items-center justify-center p-4 md:p-8 z-50">
        <a href="/" className="group cursor-pointer flex-shrink-0 relative">
          {/* Logo soft pulsing aura behind it */}
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full filter blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
          <img 
            src="/logo.png" 
            alt="StudySmart Logo" 
            className="relative h-36 md:h-48 lg:h-56 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_4px_25px_rgba(56,189,248,0.4)] group-active:scale-95 mix-blend-screen opacity-90 animate-float"
          />
        </a>

        {/* Progress bar */}
        {loading && (
          <div className="absolute top-full left-0 right-0 h-1 bg-slate-900/80">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-400 transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full md:ml-64 lg:ml-72 flex justify-center">
        <main className="relative w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-4 md:py-12">
        {!summaryData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 animate-slideInLeft">
              <div className="glass rounded-2xl shadow-2xl p-8 border border-slate-700/30">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-8">
                  Paste Your Notes or Upload a File
                </h2>

                <NotesInput
                  value={text}
                  onChange={handleTextInput}
                  onGenerate={handleGenerateSummary}
                  isLoading={loading}
                  difficulty={quizDifficulty}
                  setDifficulty={setQuizDifficulty}
                  questionCount={quizCount}
                  setQuestionCount={setQuizCount}
                />

                {error && (
                  <div className="mt-6 p-4 bg-red-950/40 border border-red-700/50 rounded-xl animate-fadeInUp shadow-lg shadow-red-500/10">
                    <p className="text-red-200">
                      <span className="font-semibold">⚠️ Error:</span> {error}
                    </p>
                  </div>
                )}

                {/* Character count */}
                {text.length > 0 && (
                  <div className="mt-4 text-sm text-slate-400">
                    <span className="text-cyan-400 font-semibold">{text.length}</span> characters | 
                    <span className="text-purple-400 font-semibold ml-2">{text.split(/\s+/).filter(Boolean).length}</span> words
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="lg:col-span-1 animate-slideInRight">
              <div className="glass rounded-2xl shadow-2xl p-6 sticky top-24 border border-slate-700/30 animate-stagger">
                <h3 className="text-lg font-bold text-slate-100 mb-6 gradient-text">✨ Features</h3>
                
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                    <span className="text-cyan-400 font-bold text-lg flex-shrink-0">✓</span>
                    <span>Structured summaries with key points</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                    <span className="text-purple-400 font-bold text-lg flex-shrink-0">✓</span>
                    <span>Auto-generated MCQs with difficulty levels</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                    <span className="text-pink-400 font-bold text-lg flex-shrink-0">✓</span>
                    <span>Key terms and definitions</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                    <span className="text-green-400 font-bold text-lg flex-shrink-0">✓</span>
                    <span>Download as PDF or JSON</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                    <span className="text-blue-400 font-bold text-lg flex-shrink-0">✓</span>
                    <span>No login required</span>
                  </li>
                </ul>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <h4 className="font-semibold text-slate-100 mb-4 text-sm">📄 Supported Formats</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/30 p-2 rounded-lg">
                      <span>📝</span> Plain text (.txt)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/30 p-2 rounded-lg">
                      <span>📕</span> PDF files
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/30 p-2 rounded-lg">
                      <span>📋</span> Pasted text
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500 text-center">
                    💡 Pro tip: Longer notes generate better summaries!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div id="results-section" className="animate-fadeInUp">
            <SummaryDisplay 
              data={summaryData} 
              onReset={handleReset}
              quizState={{ quizAnswers, setQuizAnswers, quizSubmitted, setQuizSubmitted, score, setScore }} 
              onGenerateTargetedQuiz={handleGenerateTargetedQuiz}
            />
          </div>
        )}
      </main>

      {/* Conditionally provide dynamic screen context to the floating chatbot */}
      <ChatCloudButton 
        contextData={summaryData ? { 
          summaryData, 
          quizAnswers, 
          quizSubmitted 
        } : null} 
      />

      </div>
    </div>
  );
}
