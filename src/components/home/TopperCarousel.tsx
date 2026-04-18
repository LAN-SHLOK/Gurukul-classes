"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useSocket } from "@/hooks/useSocket";
import { useTilt } from "@/hooks/useTilt";


function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);
  return <div ref={ref}>{children}</div>;
}

export default function TopperCarousel() {  const [toppers, setToppers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });
  const { on, off } = useSocket();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/toppers");
      const json = await res.json();
      setToppers(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handler = () => fetchData();
    on("toppers:updated", handler);
    return () => off("toppers:updated", handler);
  }, [on, off, fetchData]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (loading) return null;
  if (toppers.length === 0) return null;

  return (
    <section className="py-16 md:py-32 overflow-hidden px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-20 gap-6 md:gap-8">
          <div className="space-y-4 md:space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {/* Mobile: inline badge + real-time dot */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#2D31FA]/10 text-[#2D31FA] text-[9px] font-black uppercase tracking-[0.3em] border border-[#2D31FA]/15">
                  Wall of Fame
                </span>
                {/* Real-time collaborative indicator */}
                <span className="md:hidden flex items-center gap-1.5 text-[8px] font-black text-white/25 uppercase tracking-wider">
                  <span className="collab-dot" style={{ width: 6, height: 6 }} />
                  Live
                </span>
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.8]"
            >
              OUR HALL OF <br />
              <span className="text-[#2D31FA]">ACHIEVERS.</span>
            </motion.h2>
          </div>

          <div className="hidden md:flex gap-4">
            <button onClick={scrollPrev} className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={scrollNext} className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-6">
            {toppers.map((topper, i) => (
              <div key={topper._id} className="flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_30%] pl-4 md:pl-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  {/* Mobile: glassmorphic card, Desktop: tilt card */}
                  <div className="md:hidden">
                    <div className="glass-card rounded-[32px] overflow-hidden relative press">
                      {/* Trophy badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="w-9 h-9 bg-[#2D31FA] rounded-[14px] flex items-center justify-center shadow-lg shadow-blue-500/30">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="relative h-64 overflow-hidden">
                        <img src={topper.image} alt={topper.name}
                          className="w-full h-full object-cover grayscale-[50%]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-[#2D31FA] text-white text-[8px] font-black uppercase tracking-widest mb-2">
                            Class of {topper.year}
                          </span>
                          <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">
                            {topper.score}
                          </h3>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2D31FA] mt-0.5">
                            {topper.exam}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="text-base font-black text-white uppercase tracking-tighter">{topper.name}</h4>
                          <p className="text-xs font-bold text-white/30 italic mt-1 line-clamp-2">
                            &quot;{topper.achievement || "Excellence is the only standard."}&quot;
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#2D31FA]">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Platinum Achiever</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop: original tilt card */}
                  <div className="hidden md:block">
                    <TiltCard>
                      <Card className="p-0 border-none bg-white/[0.02] group h-full flex flex-col rounded-[60px] overflow-hidden border border-white/5 backdrop-blur-xl relative">
                        <div className="absolute top-6 right-6 z-20">
                          <div className="w-12 h-12 bg-[#2D31FA] rounded-[20px] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Trophy className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="relative h-96 overflow-hidden">
                          <img src={topper.image} alt={topper.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                          <div className="absolute bottom-8 left-8 right-8">
                            <span className="inline-block px-4 py-1 rounded-full bg-[#2D31FA] text-white text-[9px] font-black uppercase tracking-widest mb-4">
                              Class of {topper.year}
                            </span>
                            <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">{topper.score}</h3>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2D31FA] mt-1">{topper.exam}</p>
                          </div>
                        </div>
                        <div className="p-10 space-y-6">
                          <div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{topper.name}</h4>
                            <p className="text-sm font-bold text-white/40 italic mt-2 line-clamp-2">
                              &quot;{topper.achievement || "Guiding the path for future generations."}&quot;
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-[#2D31FA]">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Platinum Achiever</span>
                          </div>
                        </div>
                      </Card>
                    </TiltCard>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: swipe hint */}
        <div className="md:hidden flex items-center justify-center gap-2 mt-6">
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center gap-1.5"
          >
            <ChevronRight className="w-3 h-3" /> Swipe to explore
          </motion.div>
        </div>
      </div>
    </section>
  );
}
