"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import VivusSVG from "@/components/ui/VivusSVG";
import LottieLoader from "@/components/ui/LottieLoader";
import { IEvent } from "@/types/models";
import gsap from "gsap";

export default function EventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then((json) => setEvents(Array.isArray(json) ? json : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
    <div className="min-h-screen bg-black pt-28 md:pt-40 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">

        {/* Page hero */}
        <div className="mb-24 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="primary" className="bg-[#2D31FA]/10 text-[#2D31FA] border-none">Timeline</Badge>
          </motion.div>
          <h1
            ref={headingRef}
            className="font-black text-white tracking-tighter leading-[0.85] uppercase italic"
            style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
          >
            EVENTS &amp; <br />
            <span className="text-[#2D31FA]">SEMINARS.</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold text-white/40 max-w-xl"
          >
            Stay up to date with everything happening at Gurukul Classes — seminars, tests, bootcamps and more.
          </motion.p>

          {/* Vivus SVG divider */}
          <VivusSVG className="mt-8 opacity-30">
            <svg width="100%" height="24" viewBox="0 0 800 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12 Q200 0 400 12 Q600 24 800 12" stroke="#2D31FA" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </VivusSVG>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <LottieLoader size={100} />
          </div>
        ) : events.length === 0 ? (
          <div className="flex items-center justify-center py-40">
            <p className="text-white/30 font-bold text-2xl tracking-tight">Events will be announced soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="p-0 border-none bg-white group h-full flex flex-col rounded-[48px] overflow-hidden">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-black/90 backdrop-blur-xl text-[#2D31FA] border-none py-2 px-4 shadow-xl">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 md:p-10 space-y-4 md:space-y-6 flex-1 flex flex-col">
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

                    <h2 className="text-2xl md:text-3xl font-black text-black tracking-tighter leading-tight">
                      {event.title}
                    </h2>

                    {event.description && (
                      <p className="text-gray-500 font-medium leading-relaxed flex-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
