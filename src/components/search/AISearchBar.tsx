"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  Loader2, 
  Bot, 
  User, 
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const SUGGESTED_QUESTIONS = [
  "What courses do you offer for Class 10?",
  "Tell me about JEE preparation at Gurukul.",
  "How can I apply for admission?",
  "Where is the campus located?",
];

export default function AISearchBar() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    setIsExpanded(true);
    setMessages((prev) => [...prev, { role: "user", content: finalQuery }]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: finalQuery }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.answer || "I'm sorry, I couldn't process that request." }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", content: "Apologies, our AI assistant is temporarily offline." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-32 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-[#2D31FA] text-xs font-black uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-4 h-4" />
            Artificial Intelligence
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter">
            ASK ANYTHING<span className="text-[#2D31FA]">.</span>
          </h2>
        </div>

        <div className="relative group">
          <form 
            onSubmit={handleSearch}
            className={cn(
              "relative flex items-center bg-white/5 border border-white/10 rounded-full p-2 transition-all duration-700",
              isExpanded ? "ring-4 ring-[#2D31FA]/20 border-[#2D31FA]/40 bg-white/10" : "hover:border-white/30"
            )}
          >
            <input
              type="text"
              placeholder="How do I enroll for the NEET 2025 batch?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 px-4 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold tracking-tight"
            />
            <div className="flex items-center gap-2 pr-2">
              <Button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="h-14 w-14 rounded-full p-0 flex-shrink-0"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              </Button>
            </div>
          </form>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="mt-6 rounded-[24px] md:rounded-[40px] bg-white text-black p-4 md:p-10 shadow-2xl overflow-hidden min-h-[350px] md:min-h-[400px] flex flex-col"
              >
                <div className="flex justify-between items-center mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2D31FA] rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">Gurukul AI</span>
                  </div>
                  <button onClick={() => { setIsExpanded(false); setMessages([]); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar"
                >
                  {messages.length === 0 ? (
                    <div className="space-y-4">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Suggested</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SUGGESTED_QUESTIONS.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSearch(undefined, q)}
                            className="text-left p-6 rounded-[24px] bg-gray-50 border border-transparent hover:border-[#2D31FA] hover:bg-blue-50 transition-all flex items-center justify-between group"
                          >
                            <span className="font-bold text-gray-700">{q}</span>
                            <Plus className="w-5 h-5 text-gray-300 group-hover:text-[#2D31FA]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                          msg.role === 'user' ? "bg-gray-200" : "bg-[#2D31FA]"
                        )}>
                          {msg.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-white" />}
                        </div>
                        <div className={cn(
                          "max-w-[80%] p-6 rounded-[28px] text-lg font-bold leading-relaxed shadow-sm",
                          msg.role === 'user' ? "bg-gray-100 rounded-tr-none" : "bg-white border border-gray-100 rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex gap-4 animate-pulse">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center"><Bot className="w-4 h-4 text-gray-400" /></div>
                      <div className="h-16 bg-gray-50 rounded-[28px] w-1/2" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
