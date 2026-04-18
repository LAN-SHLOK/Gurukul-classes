"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ArrowRight, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useSocket } from "@/hooks/useSocket";
import { useTilt } from "@/hooks/useTilt";
import { IFaculty } from "@/types/models";

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);
  return <div ref={ref} className={className}>{children}</div>;
}

export default function FacultyShowcase() {
  const [faculty, setFaculty] = useState<IFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const { on, off } = useSocket();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/faculty");
      const json = await res.json();
      setFaculty(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("[FacultyShowcase] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handler = () => fetchData();
    on("faculty:updated", handler);
    return () => off("faculty:updated", handler);
  }, [on, off, fetchData]);

  if (loading) {
    return (
      <section className="py-32 px-6 flex items-center justify-center min-h-[400px]">
        {/* Isometric loading cube — mobile gets it too */}
        <div className="relative" style={{ width: 64, height: 64, perspective: 600, transformStyle: "preserve-3d" }}>
          <div className="iso-spinner" style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", width: 40, height: 40, background: "#2D31FA", transform: "translateZ(20px)", borderRadius: 6, opacity: 0.9 }} />
            <div style={{ position: "absolute", width: 20, height: 40, background: "#1a1db8", transform: "rotateY(-90deg) translateZ(40px)", borderRadius: "0 6px 6px 0", opacity: 0.7 }} />
            <div style={{ position: "absolute", width: 40, height: 20, background: "#111399", transform: "rotateX(90deg) translateZ(40px)", borderRadius: "0 0 6px 6px", opacity: 0.6 }} />
          </div>
        </div>
      </section>
    );
  }

  if (faculty.length === 0) {
    return (
      <section className="py-32 px-6 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400 font-bold text-xl">Faculty information coming soon.</p>
      </section>
    );
  }

  const [featured, ...rest] = faculty;

  return (
    <section id="faculty" className="py-16 md:py-32 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-24 gap-6 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {/* Mobile: badge with live dot */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-[0.3em] border border-white/10">
                  The Mentors
                </span>
                <span className="md:hidden flex items-center gap-1.5 text-[8px] font-black text-white/25 uppercase tracking-wider">
                  <span className="presence-dot" style={{ width: 6, height: 6 }} />
                  Updated
                </span>
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-8xl font-black text-black tracking-tighter leading-[0.8]"
            >
              LEARN FROM <br />
              <span className="text-[#2D31FA]">THE BEST.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="hidden md:block max-w-md text-xl font-bold text-gray-400 leading-tight"
          >
            Our faculty consists of industry veterans and academic scholars dedicated to your success.
          </motion.p>
        </div>

        {/* ── MOBILE: horizontal scroll glassmorphic cards ── */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto flex gap-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {faculty.slice(0, 6).map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="flex-shrink-0 w-56"
            >
              <div className="glass-card rounded-[24px] overflow-hidden press micro-glow relative">
                {/* Neumorphic accent bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2D31FA] via-[#818cf8] to-transparent" />

                <div className="relative h-48 overflow-hidden">
                  <img src={member.image} alt={member.name}
                    className="w-full h-full object-cover grayscale-[40%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {i === 0 && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[#2D31FA]/90 backdrop-blur-sm text-white text-[7px] font-black uppercase tracking-widest">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-white tracking-tight truncate">{member.name}</h3>
                    <BadgeCheck className="w-3.5 h-3.5 text-[#2D31FA] flex-shrink-0" />
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#2D31FA] truncate">
                    {member.role}
                  </p>
                  <p className="text-[9px] text-white/40 font-medium truncate">{member.expertise}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* CTA card in scroll */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex-shrink-0 w-48"
          >
            <div className="h-full min-h-[220px] rounded-[24px] bg-[#2D31FA] p-5 flex flex-col justify-between press active-blob">
              <h3 className="text-lg font-black text-white tracking-tighter leading-tight">
                JOIN OUR TEAM?
              </h3>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center self-end">
                <ArrowRight className="w-5 h-5 text-[#2D31FA]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile swipe hint */}
        <div className="md:hidden flex items-center justify-center gap-2 mt-4">
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-[9px] font-black uppercase tracking-widest text-black/20 flex items-center gap-1.5"
          >
            <ChevronRight className="w-3 h-3" /> Swipe for more
          </motion.span>
        </div>

        {/* ── DESKTOP: original bento grid ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <TiltCard>
              <Card className="p-0 group h-full rounded-[48px] overflow-hidden border-none">
                <div className="relative min-h-[500px] overflow-hidden">
                  <img src={featured.image} alt={featured.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-3xl font-black text-white tracking-tighter">{featured.name}</h3>
                      <BadgeCheck className="w-6 h-6 text-[#2D31FA]" />
                    </div>
                    <p className="text-[#2D31FA] font-black uppercase tracking-widest text-xs">
                      {featured.role} — {featured.expertise}
                    </p>
                    {featured.bio && <p className="text-gray-400 font-bold">{featured.bio}</p>}
                  </div>
                </div>
              </Card>
            </TiltCard>
          </motion.div>

          {rest.slice(0, 2).map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1, duration: 0.6 }}
            >
              <TiltCard>
                <Card className="p-0 group h-full rounded-[48px] overflow-hidden border-none">
                  <div className="relative min-h-[240px] overflow-hidden">
                    <img src={member.image} alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-white tracking-tighter">{member.name}</h3>
                        <BadgeCheck className="w-5 h-5 text-[#2D31FA]" />
                      </div>
                      <p className="text-[#2D31FA] font-black uppercase tracking-widest text-[10px]">
                        {member.role} — {member.expertise}
                      </p>
                    </div>
                  </div>
                </Card>
              </TiltCard>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="bg-[#2D31FA] border-none flex flex-col justify-between group cursor-pointer hover:bg-black transition-colors duration-500 h-full min-h-[200px]">
              <h3 className="text-4xl font-black text-white tracking-tighter leading-none">
                WANT TO JOIN <br /> OUR TEAM?
              </h3>
              <div className="flex items-center gap-2 self-end mt-8">
                <span className="text-xs font-black uppercase tracking-widest text-white">Apply Now</span>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowRight className="w-6 h-6 text-[#2D31FA]" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
