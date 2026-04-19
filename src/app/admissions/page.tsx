"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, Users, Trophy, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import InquiryForm from "@/components/forms/InquiryForm";
import { annotate } from "rough-notation";
import gsap from "gsap";

const WHY_ITEMS = [
  { icon: GraduationCap, title: "Expert Faculty",    desc: "IITians and PhD scholars dedicated to your success." },
  { icon: Trophy,        title: "Proven Results",    desc: "98% board success rate, 250+ top rankers." },
  { icon: Users,         title: "Small Batches",     desc: "Focused attention — maximum 25 students per batch." },
  { icon: Clock,         title: "Personal Attention", desc: "Regular doubt sessions and one-on-one mentoring." },
];

const STATS = [
  { value: "1200+", label: "Students Enrolled" },
  { value: "98%",   label: "Result Rate" },
  { value: "12+",   label: "Years of Legacy" },
];

function RoughStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const annotated = useRef(false);

  useEffect(() => {
    if (!ref.current || annotated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !annotated.current) {
          annotated.current = true;
          const annotation = annotate(ref.current!, {
            type: "underline",
            color: "#2D31FA",
            strokeWidth: 3,
            animationDuration: 700,
          });
          annotation.show();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center min-w-0"
    >
      <p className="text-xl sm:text-3xl md:text-4xl font-black text-black tracking-tighter leading-none truncate">
        <span ref={ref}>{value}</span>
      </p>
      <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1 leading-tight">{label}</p>
    </motion.div>
  );
}

export default function AdmissionsPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.from(headingRef.current, {
      opacity: 0,
      y: prefersReduced ? 0 : 60,
      duration: prefersReduced ? 0 : 1,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="min-h-screen pt-28 md:pt-40 pb-20 bg-[#F2F2F2] px-4 md:px-6 overflow-x-hidden">
      <div className="container mx-auto max-w-6xl">

        {/* Page Hero */}
        <div className="mb-16 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="primary">Admissions Open</Badge>
          </motion.div>
          <h1
            ref={headingRef}
            className="font-black text-black tracking-tighter leading-[0.8] uppercase"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
          >
            JOIN THE <br />
            <span className="text-[#2D31FA]">ELITE.</span>
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

          {/* Left — Why Gurukul + stats with Rough Notation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <p className="text-xl font-bold text-gray-400 leading-tight max-w-sm">
              Join our premium community of scholars and dreamers.
            </p>

            {/* Why Gurukul checklist */}
            <div className="space-y-4">
              {WHY_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 md:gap-5 group p-4 md:p-6 rounded-[24px] md:rounded-[32px] bg-white hover:bg-black transition-all duration-500 cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2D31FA]/20 transition-colors">
                    <item.icon className="w-6 h-6 text-[#2D31FA]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D31FA]" />
                      <h3 className="text-base font-black text-black group-hover:text-white transition-colors">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 font-bold group-hover:text-white/50 transition-colors mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats with Rough Notation highlights */}
            <div className="bg-white rounded-[28px] md:rounded-[40px] p-5 md:p-10 grid grid-cols-3 gap-3 md:gap-6 shadow-sm">
              {STATS.map((s, i) => (
                <RoughStat key={s.label} value={s.value} label={s.label} delay={i * 0.12} />
              ))}
            </div>
          </motion.div>

          {/* Right — InquiryForm + canvas-confetti */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 md:p-12 rounded-[48px] md:rounded-[60px] border-none shadow-2xl bg-white min-h-[500px] md:min-h-[600px] flex flex-col justify-between">
              <InquiryForm />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
