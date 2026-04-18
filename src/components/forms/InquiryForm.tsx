"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const CLASSES = [
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th",
  "9th", "10th", "11th Sci", "12th Sci", "JEE", "NEET",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  className?: string;
  submit?: string;
}

export default function InquiryForm() {
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", email: "", message: "" });
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) newErrors.email = "Valid email is required";
    if (!selectedClass) newErrors.className = "Please select a class";
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
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          className: selectedClass,
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
    setForm({ firstName: "", lastName: "", email: "", message: "" });
    setSelectedClass(null);
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
          <div>
            <h2 className="text-4xl font-black text-black tracking-tight">INQUIRY RECEIVED.</h2>
            <p className="text-gray-400 font-bold mt-2">Our representative will contact you soon.</p>
          </div>
          <Button onClick={handleReset}>Submit Another</Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-10"
          noValidate
        >
          {/* Personal details */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#2D31FA]">Personal Credentials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className={cn("bg-gray-50 border-none rounded-2xl py-6", errors.firstName && "ring-2 ring-red-400")}
                />
                {errors.firstName && <p className="text-xs text-red-500 font-bold ml-2">{errors.firstName}</p>}
              </div>
              <div className="space-y-1">
                <Input
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className={cn("bg-gray-50 border-none rounded-2xl py-6", errors.lastName && "ring-2 ring-red-400")}
                />
                {errors.lastName && <p className="text-xs text-red-500 font-bold ml-2">{errors.lastName}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Input
                placeholder="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={cn("bg-gray-50 border-none rounded-2xl py-6", errors.email && "ring-2 ring-red-400")}
              />
              {errors.email && <p className="text-xs text-red-500 font-bold ml-2">{errors.email}</p>}
            </div>
          </div>

          {/* Class selector */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#2D31FA]">Target Class</h3>
            <div className="flex flex-wrap gap-2">
              {CLASSES.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => { setSelectedClass(cls); setErrors((e) => ({ ...e, className: undefined })); }}
                  className={cn(
                    "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all min-h-[44px]",
                    selectedClass === cls
                      ? "bg-[#2D31FA] text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  )}
                >
                  {cls}
                </button>
              ))}
            </div>
            {errors.className && <p className="text-xs text-red-500 font-bold ml-1">{errors.className}</p>}
          </div>

          {/* Optional message */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#2D31FA]">Message (Optional)</h3>
            <textarea
              placeholder="Any specific questions or requirements..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full h-32 bg-gray-50 border-none rounded-[24px] p-6 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2D31FA]/30 transition-all resize-none"
            />
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 font-bold text-center bg-red-50 rounded-2xl py-3 px-4">{errors.submit}</p>
          )}

          <div className="space-y-4 pt-2">
            <Button type="submit" disabled={isLoading} className="w-full rounded-[24px] group h-16">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  SUBMIT INQUIRY
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
              Handcrafted for Excellence since 2011
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
