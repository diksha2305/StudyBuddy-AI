"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { streamTextInChunks } from "@/lib/animations";
import { useUser } from "@/lib/UserContext";
import { 
  SparklesIcon, 
  PaperAirplaneIcon, 
  XMarkIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/solid";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

function preprocessSummary(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .trim();
}

export default function ChatCloudButton({ contextData }: { contextData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Ready for the next intelligence cycle? I am your StudySmart AI core, calibrated for real-time concept synthesis.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { profile, updateProfile } = useUser();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
    if (profile.isLoggedIn && messages.length > 1) {
      setTimeout(() => {
        updateProfile({
          chatHistorySnapshot: messages.map(m => ({ role: m.role, content: m.content })).slice(-15)
        });
      }, 0);
    }
  }, [messages, profile.isLoggedIn]);

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || loading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: "user", content: message };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: nextMessages.map(m => ({ role: m.role, content: m.content })), contextData }),
      });

      if (!response.ok) throw new Error("Connection Failure");
      const data = await response.json();
      
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMessageId, role: "assistant", content: "", isStreaming: true }]);

      let streamedContent = "";
      for await (const chunk of streamTextInChunks(data.reply, 10, 30)) {
        streamedContent += chunk;
        setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: streamedContent } : msg));
      }
      setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg));
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "❌ ERROR: Neural link offline. Please re-calibrate." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      <div className={`fixed bottom-28 right-4 sm:right-10 z-50 w-[calc(100vw-2rem)] max-w-md transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1) ${isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"}`}>
        <div className="bg-[#05070a] rounded-[40px] border-2 border-slate-900 shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-[600px] max-h-[80vh]">
          
          <div className="bg-[#0a0e14] border-b border-white/5 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center border border-cyan-400/30">
                 <SparklesIcon className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Neural Hub</h3>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Active Synthesis Mode</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-slate-600 hover:text-white transition-colors"><XMarkIcon className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-900">
             {messages.map(item => (
                <div key={item.id} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
                   <div className={`max-w-[85%] px-6 py-4 rounded-3xl ${item.role === 'user' ? 'bg-cyan-400 text-slate-900 font-bold shadow-3xl rounded-br-none' : 'bg-slate-900 border border-white/5 text-slate-300 rounded-bl-none shadow-xl'}`}>
                      {item.role === 'user' ? <p className="text-sm leading-relaxed">{item.content}</p> : (
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:text-slate-300">
                           <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {preprocessSummary(item.content) + (item.isStreaming ? " █" : "")}
                           </ReactMarkdown>
                        </div>
                      )}
                   </div>
                </div>
             ))}
             {loading && (
               <div className="flex justify-start">
                  <div className="bg-slate-900 px-6 py-4 rounded-3xl rounded-bl-none border border-white/5 flex gap-1.5 items-center">
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:200ms]" />
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:400ms]" />
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          <div className="bg-[#0a0e14] border-t border-white/5 p-6 pb-8">
             <div className="bg-[#05070a] rounded-2xl border-2 border-slate-900 focus-within:border-cyan-400/30 transition-all flex items-center pr-2 group">
                <input 
                  ref={inputRef}
                  value={input} 
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Initialize command..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white font-bold p-5 placeholder:text-slate-700 placeholder:italic"
                />
                <button onClick={sendMessage} className="p-3 bg-cyan-400 text-slate-900 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                   <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                </button>
             </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-20 h-20 bg-gradient-to-tr from-cyan-400 to-indigo-600 rounded-[30px] flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-all duration-500 active:scale-95 ${isOpen ? "rotate-[360deg] scale-90" : "hover:scale-110 hover:shadow-[0_0_60px_rgba(34,211,238,0.7)]"}`}
      >
        <div className="absolute inset-0 bg-white/20 rounded-[30px] animate-pulse scale-90" />
        {isOpen ? <XMarkIcon className="w-10 h-10 text-white" /> : <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />}
      </button>
    </>
  );
}
