"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useSocket } from "@/hooks/useSocket";
import { IEvent } from "@/types/models";

export default function EventsCarousel() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });
  const { on, off } = useSocket();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/events");
      const json = await res.json();
      setEvents(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("[EventsCarousel] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handler = () => fetchData();
    on("events:updated", handler);
    return () => off("events:updated", handler);
  }, [on, off, fetchData]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (loading) {
    return (
      <section className="py-32 px-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#2D31FA]" />
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-32 px-6 flex items-center justify-center min-h-[400px]">
        <p className="text-white/40 font-bold text-xl">Events will be announced soon.</p>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 md:py-32 overflow-hidden px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-20 gap-6 md:gap-8">
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#2D31FA]/10 text-[#2D31FA] text-[9px] font-black uppercase tracking-[0.3em] border border-[#2D31FA]/15">
                  Timeline
                </span>
                {/* Real-time update dot */}
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
              className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.8]"
            >
              WHAT&apos;S <br />
              <span className="text-[#2D31FA]">NEXT.</span>
            </motion.h2>
          </div>

          <div className="hidden md:flex gap-4">
            <button
              onClick={scrollPrev}
              className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-6">
            {events.map((event, i) => (
              <div key={event._id} className="flex-[0_0_88%] md:flex-[0_0_50%] lg:flex-[0_0_40%] pl-4 md:pl-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                >
                  {/* Mobile: glassmorphic dark card */}
                  <div className="md:hidden glass-card rounded-[28px] overflow-hidden press">
                    <div className="relative h-48 overflow-hidden">
                      <img src={event.image} alt={event.title}
                        className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-lg text-[#2D31FA] text-[8px] font-black uppercase tracking-widest">
                          {event.category}
                        </span>
                      </div>
                      {/* Neumorphic date chip */}
                      <div className="absolute bottom-3 right-3 neuro-dark px-2.5 py-1.5 rounded-xl flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-[#2D31FA]" />
                        <span className="text-[8px] font-black text-white/70 uppercase tracking-wider">{event.date}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-black text-white tracking-tight leading-tight flex-1">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-[8px] font-black text-white/30 uppercase tracking-widest">
                        <MapPin className="w-3 h-3 text-[#2D31FA]" />
                        {event.location || "Main Campus"}
                      </div>
                      {event.description && (
                        <p className="text-[10px] text-white/40 font-medium line-clamp-2">{event.description}</p>
                      )}
                      <button className="press w-full py-3 rounded-xl bg-[#2D31FA]/10 border border-[#2D31FA]/20 text-[#2D31FA] text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:bg-[#2D31FA]/20 transition-colors">
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop: original white card */}
                  <div className="hidden md:block">
                    <Card className="p-0 border-none bg-white group h-full flex flex-col rounded-[48px] overflow-hidden">
                      <div className="relative h-72 overflow-hidden">
                        <img src={event.image} alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute top-8 left-8">
                          <Badge className="bg-black/90 backdrop-blur-xl text-[#2D31FA] border-none py-2 px-4 shadow-xl">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-10 space-y-8 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#2D31FA]" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#2D31FA]" />
                              {event.location || "Main Campus"}
                            </span>
                          </div>
                          <h3 className="text-3xl font-black text-black tracking-tighter leading-tight">
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-gray-500 font-medium text-sm line-clamp-2">{event.description}</p>
                          )}
                        </div>
                        <Button variant="dark" className="w-full group/btn rounded-[24px]">
                          View Event Details
                          <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile swipe hint */}
        <div className="md:hidden flex items-center justify-center gap-2 mt-5">
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center gap-1.5"
          >
            <ChevronRight className="w-3 h-3" /> Swipe for more
          </motion.span>
        </div>
      </div>
    </section>
  );
}
