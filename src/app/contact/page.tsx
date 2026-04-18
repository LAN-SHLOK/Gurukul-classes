"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import ContactForm from "@/components/forms/ContactForm";
import ParticlesBg from "@/components/ui/ParticlesBg";
import { SITE_CONFIG } from "@/lib/config/constants";

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Main Campus",
    text: `${SITE_CONFIG.address.line1}, ${SITE_CONFIG.address.line2}, ${SITE_CONFIG.address.city}`,
  },
  {
    icon: Mail,
    title: "Electronic Mail",
    text: SITE_CONFIG.email,
  },
  {
    icon: Phone,
    title: "Voice Uplink",
    text: SITE_CONFIG.phone,
  },
  {
    icon: Instagram,
    title: "Instagram",
    text: "@edukulam_",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black pt-24 md:pt-40 pb-24 overflow-x-hidden">
      <div className="px-4 md:px-6 w-full">
      <div className="container mx-auto max-w-7xl">

        {/* Page Hero */}
        <div className="relative rounded-[28px] md:rounded-[60px] bg-white/[0.02] border border-white/5 p-6 md:p-16 mb-10 md:mb-20 overflow-hidden">
          <ParticlesBg />
          <div className="relative z-10 space-y-4 md:space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="primary">Contact Hub</Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-black text-white tracking-tighter leading-[0.85] uppercase italic"
              style={{ fontSize: "clamp(2.5rem, 10vw, 9rem)" }}
            >
              GET IN <br />
              <span className="text-[#2D31FA]">TOUCH.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-xl font-bold text-white/40 leading-tight max-w-md uppercase"
            >
              Direct Channels to our Academic Command Center.
            </motion.p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20">

          {/* Left — contact info */}
          <div className="space-y-8 md:space-y-16">
            <div className="space-y-6">
              {CONTACT_INFO.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex gap-4 group items-start"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[#2D31FA]/20 group-hover:border-[#2D31FA]/40 transition-all duration-500 flex-shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-[#2D31FA]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1.5">{item.title}</h3>
                    <p className="text-base md:text-xl font-black text-white uppercase tracking-tight break-all leading-snug">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Location card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.03] p-6 md:p-8 flex flex-col gap-4 md:gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#2D31FA]/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#2D31FA]" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Find Us</p>
              </div>
              <p className="text-white font-black text-base md:text-lg leading-snug">
                {SITE_CONFIG.address.line1},<br />
                {SITE_CONFIG.address.line2},<br />
                {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`Gurukul Classes, Ghodasar, Ahmedabad, Gujarat`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D31FA]/10 border border-[#2D31FA]/20 text-[#2D31FA] text-[10px] font-black uppercase tracking-widest hover:bg-[#2D31FA] hover:text-white transition-all w-fit press"
              >
                <MapPin className="w-3.5 h-3.5" />
                Open in Google Maps
              </a>
            </motion.div>
          </div>

          {/* Right — ContactForm */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-[28px] md:rounded-[60px] p-6 md:p-12 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2D31FA]/5 blur-[100px] rounded-full pointer-events-none" />
            <ContactForm />
          </motion.div>
        </div>

      </div>
      </div>
    </div>
  );
}
