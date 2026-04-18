"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
  submit?: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#2D31FA", "#ffffff", "#a5b4fc"] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.name.trim(),
          lastName: "",
          email: form.email.trim(),
          className: "General",
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.message || "Something went wrong. Please try again." });
        return;
      }

      fireConfetti();
      setIsSubmitted(true);
    } catch {
      setErrors({ submit: "Network error. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <AnimatePresence mode="wait">
      {isSubmitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center justify-center text-center py-20 space-y-8"
        >
          <div className="w-24 h-24 bg-[#2D31FA] rounded-[32px] flex items-center justify-center text-white shadow-[0_0_50px_-10px_rgba(45,49,250,0.5)]">
            <Send className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">TRANSMISSION SENT.</h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Awaiting Counselor Acknowledgement...</p>
          </div>
          <Button onClick={handleReset}>Initiate New</Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-8 relative z-10"
          noValidate
        >
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#2D31FA]">Personal Credentials</h3>
            <div className="space-y-1">
              <Input
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={cn("h-14 bg-black/40 border-white/5 text-white rounded-2xl px-6", errors.name && "ring-2 ring-red-400")}
              />
              {errors.name && <p className="text-xs text-red-400 font-bold ml-2">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <Input
                placeholder="Electronic Mail"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={cn("h-14 bg-black/40 border-white/5 text-white rounded-2xl px-6", errors.email && "ring-2 ring-red-400")}
              />
              {errors.email && <p className="text-xs text-red-400 font-bold ml-2">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <textarea
                placeholder="Detailed Communication..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={cn(
                  "w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-6 text-white placeholder:text-white/30 text-sm outline-none focus:border-[#2D31FA]/50 transition-all font-medium resize-none",
                  errors.message && "ring-2 ring-red-400"
                )}
              />
              {errors.message && <p className="text-xs text-red-400 font-bold ml-2">{errors.message}</p>}
            </div>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-400 font-bold text-center bg-red-500/10 rounded-2xl py-3 px-4">{errors.submit}</p>
          )}

          <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-[24px] group">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                ESTABLISH LINK
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
