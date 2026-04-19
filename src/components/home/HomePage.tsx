"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight, ArrowRight, Sparkles, Trophy, Star,
  BadgeCheck, Calendar, MapPin, Search, Bot, Loader2,
  GraduationCap, X, Plus, User,
  CheckCircle2, Quote, ChevronLeft,
} from "lucide-react";
import Typed from "typed.js";
import useEmblaCarousel from "embla-carousel-react";
import { useSocket } from "@/hooks/useSocket";
import { annotate } from "rough-notation";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ACCENT = "#2D31FA";

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
function Section({ id, className, children, style }: { id?: string; className?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section
      id={id}
      className={cn("relative overflow-hidden", className)}
      style={style}
    >
      {children}
    </section>
  );
}

// ─── SCROLLY REVEAL ──────────────────────────────────────────────────────────
function Reveal({
  children, delay = 0, y = 40, className, ...props
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string; [key: string]: any;
}) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── EXPRESSIVE HEADING ──────────────────────────────────────────────────────
function BigHeading({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <h2
      className={cn(
        "font-black tracking-tighter leading-[0.85] uppercase",
        className
      )}
      style={{ fontSize: "clamp(2.8rem, 8vw, 8rem)", ...style }}
    >
      {children}
    </h2>
  );
}

// ─── GLASSMORPHIC CARD ────────────────────────────────────────────────────────
function GlassCard({
  children, className, onClick, style
}: {
  children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-3xl border border-white/10 overflow-hidden",
        "backdrop-blur-xl",
        onClick && "cursor-pointer press micro-glow",
        className
      )}
      style={{
        background: "rgba(255,255,255,0.04)",
        ...style
      }}
    >
      {children}
    </div>
  );
}

// ─── NEUMORPHIC STAT ──────────────────────────────────────────────────────────
function NeuStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!ref.current || done.current || value === "...") return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const ann = annotate(ref.current!, { type: "underline", color: ACCENT, strokeWidth: 3, animationDuration: 700 });
        ann.show();
        obs.disconnect();
      }
    }, { threshold: 0.6 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="neuro-card-dark rounded-[24px] p-5 text-center relative overflow-hidden press micro-glow"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(45,49,250,0.1) 0%, transparent 70%)"
        }}
      />
      {/* Live pulse dot */}
      <div className="absolute top-3 right-3 collab-dot" style={{ width: 6, height: 6 }} />
      <p className="text-3xl font-black text-white tracking-tighter">
        <span ref={ref}>{value}</span>
      </p>
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/35 mt-1">{label}</p>
    </motion.div>
  );
}

// ─── REAL-TIME VIEWER BADGE ───────────────────────────────────────────────────
function ViewerBadge({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.5 }}
      className="glass-pill flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white/60"
    >
      <span className="presence-dot" style={{ width: 6, height: 6 }} />
      {count} viewer{count !== 1 ? "s" : ""} now
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — HERO
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const typedInstance = useRef<Typed | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity   = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    if (!typedRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    typedInstance.current = new Typed(typedRef.current, {
      strings: [
        "JEE &amp; NEET Elite Coaching.",
        "Grade 1–12 Gujarat &amp; NCERT.",
        "Offline. Personal. Proven.",
      ],
      typeSpeed: prefersReduced ? 0 : 45,
      backSpeed: prefersReduced ? 0 : 28,
      loop: true,
      backDelay: 2200,
      showCursor: true,
      cursorChar: "|",
    });
    return () => typedInstance.current?.destroy();
  }, []);

  return (
    <Section id="hero" className="min-h-screen bg-black flex flex-col justify-center pt-20 px-4 md:px-8">
      {/* Ambient grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(45,49,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,49,250,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,49,250,0.08) 0%, transparent 70%)" }}
      />

      <motion.div
        ref={sectionRef as any}
        style={{ y: yParallax, opacity }}
        className="container mx-auto max-w-7xl relative z-10"
      >
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8 md:mb-12 flex-wrap"
        >
          <div className="glass-pill flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#2D31FA]">
            <Sparkles className="w-3.5 h-3.5" />
            Since 2011 · Ahmedabad
          </div>
          <div className="glass-pill flex items-center gap-2 px-3 py-2 rounded-full">
            <span className="presence-dot" style={{ width: 6, height: 6 }} />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Live</span>
          </div>
        </motion.div>

        {/* Giant headline — expressive typography */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="font-black tracking-tighter leading-[0.82] mb-6 md:mb-10 text-white"
          style={{ fontSize: "clamp(3.5rem, 14vw, 13rem)" }}
        >
          BEYOND
          <br />
          <span
            className="gradient-text"
            style={{ fontSize: "clamp(3.5rem, 14vw, 13rem)" }}
          >
            LIMITS
          </span>
          <span style={{ color: ACCENT }}>.</span>
        </motion.h1>

        {/* Typed subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-base md:text-2xl text-white/40 font-bold mb-10 md:mb-14 min-h-[2rem] md:min-h-[2.5rem] tracking-tight"
        >
          <span ref={typedRef} />
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          <Link href="/admissions" className="w-full sm:w-auto">
            <button className="press w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_50px_-10px_rgba(45,49,250,0.8)] active:scale-95 transition-all micro-glow">
              Join The Elite
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/courses" className="w-full sm:w-auto">
            <button className="press w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass-pill text-white/70 text-xs font-black uppercase tracking-[0.2em] active:scale-95 transition-all">
              View Courses
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>

        {/* Mobile scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="mt-16 md:mt-20 flex items-center gap-4 md:hidden"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-[#2D31FA]/60" />
          </motion.div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Scroll</span>
        </motion.div>
      </motion.div>

      {/* Bottom metadata — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-7xl px-8 hidden md:flex justify-between items-center text-white/15 pointer-events-none"
      >
        <span className="text-[10px] font-black tracking-[0.4em] uppercase">Est. 2011</span>
        <span className="text-[10px] font-black tracking-[0.4em] uppercase">Ahmedabad / Gujarat</span>
        <span className="text-[10px] font-black tracking-[0.4em] uppercase">Premium Offline</span>
      </motion.div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — STATS (Neumorphic + Real-time)
// ═══════════════════════════════════════════════════════════════════════════════
function StatsSection() {
  const [stats, setStats] = useState([
    { value: "1200+", label: "Students Enrolled" },
    { value: "15+",   label: "Expert Faculty"    },
    { value: "98%",   label: "Result Rate"       },
    { value: "12+",   label: "Years of Legacy"   },
  ]);
  const { on, off } = useSocket();

  const fetchStats = useCallback(() => {
    fetch("/api/admin/faculty").then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setStats(s => s.map(st =>
          st.label === "Expert Faculty" ? { ...st, value: `${data.length}+` } : st
        ));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchStats();
    const h = () => fetchStats();
    on("faculty:updated", h);
    return () => off("faculty:updated", h);
  }, [fetchStats, on, off]);

  return (
    <Section className="py-16 md:py-28 bg-black px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <Reveal className="mb-10 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D31FA]">By the numbers</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <BigHeading className="text-white">
            THE<br />
            <span style={{ color: ACCENT }}>NUMBERS.</span>
          </BigHeading>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {stats.map((s, i) => (
            <NeuStat key={s.label} value={s.value} label={s.label} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — COURSES (Scrollytelling bento)
// ═══════════════════════════════════════════════════════════════════════════════
const COURSE_ITEMS = [
  {
    tag: "Foundation",
    title: "CLASS 1–10",
    sub: "Gujarat Board / NCERT",
    desc: "Concept-first foundation for Gujarat Board and NCERT — building mental fortitude for future competitive battles.",
    color: ACCENT,
    bg: "#0a0a1a",
  },
  {
    tag: "Engineering",
    title: "JEE COACHING",
    sub: "Mains + Advanced",
    desc: "Intensive Physics-Maths-Chemistry ecosystem designed to secure ranks in India's premier engineering institutes.",
    color: "#818cf8",
    bg: "#06060f",
  },
  {
    tag: "Medical",
    title: "NEET COACHING",
    sub: "AIIMS & Top Medical",
    desc: "Deep-dive biological sciences and clinical logic for aspirants targeting AIIMS and top medical colleges.",
    color: "#34d399",
    bg: "#030d08",
  },
];

function CoursesSection() {
  return (
    <Section className="py-16 md:py-28 bg-black px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <Reveal className="mb-10 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D31FA]">Curriculum</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <BigHeading className="text-white">
            WHAT WE<br />
            <span style={{ color: ACCENT }}>TEACH.</span>
          </BigHeading>
        </Reveal>

        {/* Mobile: vertical stack. Desktop: 3-col bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {COURSE_ITEMS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <GlassCard className="p-6 md:p-8 h-full flex flex-col gap-4 group"
                style={{ background: c.bg, borderColor: `${c.color}18` } as any}
              >
                {/* Accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(90deg, ${c.color}, transparent)` }} />

                <div className="flex items-start justify-between">
                  <span
                    className="text-[8px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full border"
                    style={{ color: c.color, borderColor: `${c.color}30`, background: `${c.color}10` }}
                  >
                    {c.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-tight mb-1">
                    {c.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: c.color }}>
                    {c.sub}
                  </p>
                </div>

                <p className="text-sm text-white/40 font-medium leading-relaxed flex-1">{c.desc}</p>

                <Link href="/courses">
                  <div className="flex items-center gap-2 press group-hover:gap-3 transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: c.color }}>
                      Explore
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: c.color }} />
                  </div>
                </Link>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        {/* CTA strip */}
        <Reveal delay={0.3} className="mt-6">
          <Link href="/admissions">
            <div className="press flex items-center justify-between px-6 py-5 rounded-2xl border border-[#2D31FA]/20 bg-[#2D31FA]/05 hover:bg-[#2D31FA]/10 transition-colors group">
              <span className="text-sm font-black text-white uppercase tracking-tight">
                Ready to join? Apply for admission →
              </span>
              <div className="w-9 h-9 rounded-full bg-[#2D31FA] flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — TOPPERS (Embla carousel with glassmorphic cards)
// ═══════════════════════════════════════════════════════════════════════════════
function ToppersSection() {
  const [toppers, setToppers] = useState<any[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });
  const { on, off } = useSocket();

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/toppers");
      const d = await r.json();
      if (Array.isArray(d)) setToppers(d);
    } catch {}
  }, []);

  useEffect(() => {
    fetch_();
    on("toppers:updated", fetch_);
    return () => off("toppers:updated", fetch_);
  }, [fetch_, on, off]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (toppers.length === 0) return null;

  return (
    <Section className="py-16 md:py-28 bg-black overflow-hidden px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 md:mb-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D31FA]">Wall of Fame</span>
              <div className="flex items-center gap-1.5">
                <span className="collab-dot" style={{ width: 6, height: 6 }} />
                <span className="text-[8px] font-black uppercase tracking-wider text-white/20">Live</span>
              </div>
            </div>
            <BigHeading className="text-white">
              HALL OF<br />
              <span style={{ color: ACCENT }}>ACHIEVERS.</span>
            </BigHeading>

            {/* Count + nav arrows on same row, always fits */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                {toppers.length} achiever{toppers.length !== 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                <button onClick={prev} className="press w-10 h-10 rounded-full glass-pill flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="press w-10 h-10 rounded-full glass-pill flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
          <div className="flex gap-4 md:gap-5">
            {toppers.map((t, i) => (
              <div key={t._id} className="flex-[0_0_76%] sm:flex-[0_0_55%] md:flex-[0_0_36%] lg:flex-[0_0_28%]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.93 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <GlassCard className="overflow-hidden press">
                    <div className="absolute top-3 right-3 z-10">
                      <div className="w-8 h-8 rounded-xl bg-[#2D31FA] flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Trophy className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="relative h-52 md:h-64 overflow-hidden">
                      <img src={t.image} alt={t.name}
                        className="w-full h-full object-cover grayscale-[40%]"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#2D31FA] text-white text-[7px] font-black uppercase tracking-widest mb-1.5">
                          Class of {t.year}
                        </span>
                        <p className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic">{t.score}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#2D31FA]">{t.exam}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">{t.name}</h4>
                      <p className="text-[10px] text-white/30 italic line-clamp-2">
                        &quot;{t.achievement || "Excellence is the only standard."}&quot;
                      </p>
                      <div className="flex items-center gap-1 text-[#2D31FA]">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Platinum Achiever</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Swipe hint + view all */}
        <div className="flex items-center justify-between mt-6">
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="md:hidden flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/20"
          >
            <ChevronRight className="w-3 h-3" /> Swipe to explore
          </motion.div>
          <Link href="/toppers" className="ml-auto">
            <button className="press flex items-center gap-2 px-5 py-2.5 rounded-xl glass-pill text-white/50 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              View All {toppers.length} Achievers
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — AI SEARCH (Glassmorphic chat)
// ═══════════════════════════════════════════════════════════════════════════════
const SUGGESTIONS = [
  "JEE preparation tips?",
  "How to enroll for NEET batch?",
  "What's the fee structure?",
  "Campus location?",
];

function AISection() {
  const [query, setQuery] = useState("");
  const [msgs, setMsgs] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setOpen(true);
    setMsgs(p => [...p, { role: "user", text: q }]);
    setQuery("");
    setLoading(true);
    try {
      const r = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const d = await r.json();
      setMsgs(p => [...p, { role: "bot", text: d.answer || "I couldn't process that." }]);
    } catch {
      setMsgs(p => [...p, { role: "bot", text: "AI assistant is temporarily offline." }]);
    }
    setLoading(false);
  };

  return (
    <Section className="py-16 md:py-28 bg-black px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <Reveal className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-[#2D31FA] text-[10px] font-black uppercase tracking-[0.3em] mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Assistant
          </div>
          <BigHeading className="text-white">
            ASK<br />
            <span style={{ color: ACCENT }}>ANYTHING.</span>
          </BigHeading>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Search bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); ask(query); }}
            className={cn(
              "relative flex items-center rounded-2xl border transition-all duration-500 p-1.5",
              open ? "border-[#2D31FA]/40 shadow-[0_0_40px_-10px_rgba(45,49,250,0.4)]" : "border-white/10",
              "glass-card"
            )}
          >
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              placeholder="How do I enroll for NEET 2025 batch?"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/20 px-4 py-3 text-sm font-medium"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="press flex-shrink-0 w-10 h-10 rounded-xl bg-[#2D31FA] flex items-center justify-center text-white disabled:opacity-40 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </form>

          {/* Chat panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="mt-3 glass-card rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#2D31FA] flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Gurukul AI</span>
                    <span className="collab-dot" style={{ width: 5, height: 5 }} />
                  </div>
                  <button
                    onClick={() => { setOpen(false); setMsgs([]); }}
                    className="press w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="max-h-72 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden">
                  {msgs.length === 0 ? (
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/25">Try asking</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SUGGESTIONS.map(q => (
                          <button
                            key={q}
                            onClick={() => ask(q)}
                            className="press text-left px-3 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/50 text-xs font-medium hover:border-[#2D31FA]/30 hover:text-white transition-all flex items-center justify-between gap-2"
                          >
                            <span>{q}</span>
                            <Plus className="w-3 h-3 flex-shrink-0 text-white/20" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    msgs.map((m, i) => (
                      <div key={i} className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                          m.role === "user" ? "bg-white/10" : "bg-[#2D31FA]"
                        )}>
                          {m.role === "user"
                            ? <User className="w-3.5 h-3.5 text-white/60" />
                            : <Bot className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className={cn(
                          "max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm font-medium leading-relaxed",
                          m.role === "user"
                            ? "bg-white/[0.06] text-white rounded-tr-none"
                            : "bg-[#2D31FA]/15 border border-[#2D31FA]/20 text-white/80 rounded-tl-none"
                        )}>
                          {m.role === "bot" ? (
                            <div className="markdown-content">
                              <ReactMarkdown>{m.text}</ReactMarkdown>
                            </div>
                          ) : (
                            m.text
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#2D31FA] flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl rounded-tl-none bg-[#2D31FA]/15 border border-[#2D31FA]/20">
                        {[0,1,2].map(j => (
                          <div key={j} className="typing-dot w-1.5 h-1.5 rounded-full bg-[#2D31FA]/60"
                            style={{ animationDelay: `${j * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — FACULTY (horizontal scroll glassmorphic + desktop bento)
// ═══════════════════════════════════════════════════════════════════════════════
function FacultySection() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const { on, off } = useSocket();

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/faculty");
      const d = await r.json();
      if (Array.isArray(d)) setFaculty(d);
    } catch {}
  }, []);

  useEffect(() => {
    fetch_();
    on("faculty:updated", fetch_);
    return () => off("faculty:updated", fetch_);
  }, [fetch_, on, off]);

  if (faculty.length === 0) return null;
  const [featured, ...rest] = faculty;

  return (
    <Section className="py-16 md:py-28 bg-[#F2F2F2] px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <Reveal className="mb-10 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D31FA]">The Mentors</span>
            <div className="flex items-center gap-1.5">
              <span className="presence-dot" style={{ width: 6, height: 6 }} />
              <span className="text-[8px] font-black uppercase tracking-wider text-black/25">Updated</span>
            </div>
          </div>
          <BigHeading className="text-black">
            LEARN FROM<br />
            <span style={{ color: ACCENT }}>THE BEST.</span>
          </BigHeading>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/30">
              {faculty.length} mentor{faculty.length !== 1 ? "s" : ""}
            </span>
          </div>
        </Reveal>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto flex gap-4 pb-4 [&::-webkit-scrollbar]:hidden">
          {faculty.map((m, i) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-52"
            >
              <div className="neuro-light rounded-[20px] overflow-hidden press">
                <div className="relative h-44 overflow-hidden">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover grayscale-[30%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {i === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#2D31FA] text-white text-[7px] font-black uppercase tracking-widest">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-3.5 space-y-0.5 bg-[#f0eee8]">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-black tracking-tight truncate">{m.name}</span>
                    <BadgeCheck className="w-3.5 h-3.5 text-[#2D31FA] flex-shrink-0" />
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#2D31FA] truncate">{m.role}</p>
                  <p className="text-[9px] text-black/40 font-medium truncate">{m.expertise}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {/* View All CTA — inline in scroll, no overflow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 w-36"
          >
            <Link href="/faculty">
              <div className="h-full min-h-[200px] rounded-[20px] border border-[#2D31FA]/30 bg-[#2D31FA]/10 p-4 flex flex-col justify-between press">
                <p className="text-sm font-black text-[#2D31FA] tracking-tight leading-tight">
                  VIEW ALL<br />{faculty.length > 1 ? `${faculty.length} MENTORS` : "MENTORS"}
                </p>
                <div className="w-8 h-8 rounded-full bg-[#2D31FA] flex items-center justify-center self-end">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom row — centered, clean */}
        <div className="flex flex-col items-center gap-3 mt-6">
          <Link href="/faculty">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#2D31FA] hover:text-white transition-colors">
              View all {faculty.length} mentor{faculty.length !== 1 ? "s" : ""} →
            </span>
          </Link>
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[9px] font-black uppercase tracking-widest text-black/20 flex items-center gap-1.5 md:hidden"
          >
            <ChevronRight className="w-3 h-3" /> Swipe for more
          </motion.span>
        </div>

        {/* Desktop: bento grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          <Reveal className="md:col-span-2" delay={0}>
            <div className="group rounded-[40px] overflow-hidden relative h-[480px]">
              <img src={featured.image} alt={featured.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10 space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-black text-white tracking-tighter">{featured.name}</h3>
                  <BadgeCheck className="w-6 h-6 text-[#2D31FA]" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-[#2D31FA]">
                  {featured.role} — {featured.expertise}
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5">
            {rest.slice(0, 2).map((m, i) => (
              <Reveal key={m._id} delay={(i + 1) * 0.1} className="flex-1">
                <div className="group rounded-[32px] overflow-hidden relative h-[220px]">
                  <img src={m.image} alt={m.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white tracking-tighter">{m.name}</h3>
                      <BadgeCheck className="w-4 h-4 text-[#2D31FA]" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#2D31FA]">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <Link href="/faculty">
                <div className="rounded-[32px] bg-[#2D31FA] p-8 flex flex-col justify-between group cursor-pointer hover:bg-black transition-colors duration-500 min-h-[140px]">
                  <p className="text-2xl font-black text-white tracking-tighter leading-tight">
                    {faculty.length > 3 ? `+${faculty.length - 3} MORE MENTORS` : "WANT TO JOIN OUR TEAM?"}
                  </p>
                  <div className="flex items-center gap-2 self-end mt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {faculty.length > 3 ? "View All" : "Apply"}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                      <ArrowRight className="w-5 h-5 text-[#2D31FA]" />
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — EVENTS (Embla carousel)
// ═══════════════════════════════════════════════════════════════════════════════
function EventsSection() {
  const [events, setEvents] = useState<any[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });
  const { on, off } = useSocket();

  const fetch_ = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/events");
      const d = await r.json();
      if (Array.isArray(d)) setEvents(d);
    } catch {}
  }, []);

  useEffect(() => {
    fetch_();
    on("events:updated", fetch_);
    return () => off("events:updated", fetch_);
  }, [fetch_, on, off]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (events.length === 0) return null;

  return (
    <Section className="py-16 md:py-28 bg-black overflow-hidden px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10 md:mb-16 gap-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D31FA]">Timeline</span>
              <div className="flex items-center gap-1.5">
                <span className="collab-dot" style={{ width: 6, height: 6 }} />
                <span className="text-[8px] font-black uppercase tracking-wider text-white/20">Live</span>
              </div>
            </div>
            <BigHeading className="text-white">
              WHAT&apos;S<br />
              <span style={{ color: ACCENT }}>NEXT.</span>
            </BigHeading>
          </Reveal>
          <div className="hidden md:flex gap-3 flex-shrink-0">
            <button onClick={prev} className="press w-12 h-12 rounded-full glass-pill flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="press w-12 h-12 rounded-full glass-pill flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
          <div className="flex gap-4 md:gap-5">
            {events.map((ev, i) => (
              <div key={ev._id} className="flex-[0_0_82%] sm:flex-[0_0_60%] md:flex-[0_0_42%] lg:flex-[0_0_35%]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <GlassCard className="overflow-hidden press h-full flex flex-col">
                    <div className="relative h-44 md:h-56 overflow-hidden flex-shrink-0">
                      <img src={ev.image} alt={ev.title}
                        className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-lg text-[#2D31FA] text-[8px] font-black uppercase tracking-widest">
                          {ev.category}
                        </span>
                      </div>
                      {/* Neumorphic date chip */}
                      <div className="absolute bottom-3 right-3 neuro-dark px-2.5 py-1.5 rounded-xl flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-[#2D31FA]" />
                        <span className="text-[8px] font-black text-white/60 uppercase tracking-wider">{ev.date}</span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <h3 className="text-base md:text-lg font-black text-white tracking-tight leading-tight">
                        {ev.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[8px] font-black text-white/30 uppercase tracking-widest">
                        <MapPin className="w-3 h-3 text-[#2D31FA]" />
                        {ev.location || "Main Campus"}
                      </div>
                      {ev.description && (
                        <p className="text-[10px] text-white/35 font-medium line-clamp-2">{ev.description}</p>
                      )}
                      <button className="press mt-auto w-full py-2.5 rounded-xl bg-[#2D31FA]/10 border border-[#2D31FA]/20 text-[#2D31FA] text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:bg-[#2D31FA]/20 transition-colors">
                        View Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="md:hidden flex items-center justify-center gap-1.5 mt-5 text-[9px] font-black uppercase tracking-widest text-white/20">
          <ChevronRight className="w-3 h-3" /> Swipe for more
        </motion.div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — REVIEWS (Glass cards + real-time collab indicator)
// ═══════════════════════════════════════════════════════════════════════════════
interface Review { author_name: string; rating: number; text: string; relative_time_description: string; profile_photo_url: string; }

function ReviewAvatar({ name, url }: { name: string; url: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  if (url && !url.includes("lh3.googleusercontent.com/a-/ALV-EM")) {
    return <img src={url} alt={name} className="w-full h-full rounded-full object-cover"
      onError={e => (e.currentTarget.style.display = "none")} />;
  }
  return (
    <div className="w-full h-full rounded-full bg-[#2D31FA] flex items-center justify-center">
      <span className="text-white font-black text-xs">{initials}</span>
    </div>
  );
}

function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then(r => r.json())
      .then(d => { if (d.reviews?.length) setReviews(d.reviews); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews.length]);

  if (loading || reviews.length === 0) return null;
  const r = reviews[idx];

  return (
    <Section className="py-16 md:py-28 bg-[#F2F2F2] px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Left */}
          <Reveal>
            <div className="space-y-6 md:space-y-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D31FA]">Testimonials</span>
                </div>
                <BigHeading className="text-black">
                  WHAT THEY<br />
                  <span style={{ color: ACCENT }}>SAY.</span>
                </BigHeading>
              </div>
              <p className="text-base md:text-xl font-bold text-gray-400 leading-relaxed">
                Hear from parents and students who&apos;ve lived the Gurukul experience.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setIdx(i => (i - 1 + reviews.length) % reviews.length)}
                  className="press w-12 h-12 rounded-full neuro-light flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setIdx(i => (i + 1) % reviews.length)}
                  className="press w-12 h-12 rounded-full neuro-light flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              {/* Avatars strip */}
              <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                <div className="flex -space-x-3">
                  {reviews.slice(0, 4).map((rv, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#F2F2F2] overflow-hidden bg-gray-200">
                      <ReviewAvatar name={rv.author_name} url={rv.profile_photo_url} />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-black text-black text-sm">Google Reviews</p>
                  <div className="flex text-yellow-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — animated review card */}
          <Reveal delay={0.15}>
            <div className="relative">
              {/* Background quote mark */}
              <div className="absolute -top-8 -left-4 text-black/[0.04] pointer-events-none">
                <Quote style={{ width: 80, height: 80, fill: "currentColor" }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 40, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-[28px] md:rounded-[40px] p-7 md:p-12 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] border border-black/5"
                >
                  <p className="text-lg md:text-2xl font-black text-black tracking-tight leading-snug mb-8">
                    &quot;{r.text}&quot;
                  </p>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <ReviewAvatar name={r.author_name} url={r.profile_photo_url} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-black text-sm">{r.author_name}</span>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
                          {r.relative_time_description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-[#2D31FA] text-white px-3 py-1.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-black text-xs">{r.rating}.0</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination dots */}
              <div className="flex justify-center gap-1.5 mt-5">
                {reviews.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)}
                    className={cn("rounded-full transition-all", i === idx ? "bg-[#2D31FA] w-5 h-1.5" : "bg-black/15 w-1.5 h-1.5")} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — FINAL CTA
// ═══════════════════════════════════════════════════════════════════════════════
function CTASection() {
  return (
    <Section className="py-16 md:py-28 bg-black px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <Reveal>
          <div className="relative rounded-[28px] md:rounded-[48px] overflow-hidden p-8 md:p-16 text-center"
            style={{
              background: "linear-gradient(135deg, #0a0a1f 0%, #0d0d2e 50%, #050510 100%)",
              border: "1px solid rgba(45,49,250,0.2)",
              boxShadow: "0 0 80px -20px rgba(45,49,250,0.3)",
            }}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(45,49,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,49,250,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,49,250,0.12) 0%, transparent 70%)" }} />

            <div className="relative z-10 space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-[#2D31FA] text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Admissions Open
              </motion.div>

              <BigHeading className="text-white" style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" } as any}>
                START YOUR<br />
                <span className="gradient-text">JOURNEY.</span>
              </BigHeading>

              <p className="text-white/40 font-bold text-base md:text-xl max-w-lg mx-auto leading-relaxed">
                Join 1200+ students who chose excellence. Limited seats — apply now.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/admissions">
                  <button className="press w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_50px_-10px_rgba(45,49,250,0.8)] active:scale-95 transition-all micro-glow">
                    Apply Now
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="press w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass-pill text-white/70 text-xs font-black uppercase tracking-[0.2em] active:scale-95 transition-all">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — HomePage
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const { } = useSocket();
  const [viewers, setViewers] = useState(1);

  // Simulate viewer count with small variance for real-time feel
  useEffect(() => {
    const t = setInterval(() => {
      setViewers(v => Math.max(1, v + (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.7 ? 1 : 0)));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Real-time viewer badge — fixed bottom left */}
      <div className="fixed bottom-20 md:bottom-6 left-4 z-50 md:left-6">
        <ViewerBadge count={viewers} />
      </div>

      <HeroSection />
      <StatsSection />
      <CoursesSection />
      <ToppersSection />
      <AISection />
      <FacultySection />
      <EventsSection />
      <ReviewsSection />
      <CTASection />
    </div>
  );
}
