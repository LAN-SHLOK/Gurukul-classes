"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BadgeCheck, Linkedin, Mail, Sparkles, Star } from "lucide-react";
import ParticlesBg from "@/components/ui/ParticlesBg";
import LottieLoader from "@/components/ui/LottieLoader";
import VivusSVG from "@/components/ui/VivusSVG";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/faculty");
      if (res.ok) {
        const json = await res.json();
        setFaculty(Array.isArray(json) ? json : []);
      } else {
        // Fallback to mock data if API fails
        setFaculty(mockFaculty);
      }
    } catch (err) {
      console.error(err);
      // Fallback to mock data on error
      setFaculty(mockFaculty);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const mockFaculty = [
    {
      _id: "1",
      name: "Dr. Rajesh Sharma",
      role: "Senior Faculty",
      expertise: "Mathematics & Physics",
      bio: "IIT Delhi alumnus with 15+ years of teaching experience. Specialized in JEE Advanced preparation.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
      linkedin: "https://linkedin.com",
      email: "rajesh@gurukul.com"
    },
    {
      _id: "2", 
      name: "Prof. Priya Patel",
      role: "Head of Chemistry",
      expertise: "Organic & Inorganic Chemistry",
      bio: "Research scholar from IISc Bangalore. Expert in NEET chemistry preparation with proven track record.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face",
      linkedin: "https://linkedin.com",
      email: "priya@gurukul.com"
    },
    {
      _id: "3",
      name: "Mr. Arjun Singh", 
      role: "Physics Faculty",
      expertise: "Mechanics & Electromagnetism",
      bio: "Gold medalist from NIT Surat. Passionate about making physics concepts crystal clear for students.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
      linkedin: "https://linkedin.com",
      email: "arjun@gurukul.com"
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-28 md:pt-40 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Editorial Header with particles */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 mb-16 md:mb-32 items-end overflow-hidden rounded-[40px] md:rounded-[60px] bg-black p-8 md:p-16">
          <ParticlesBg />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 relative z-10"
          >
            <Badge variant="primary">The Academic Vanguard</Badge>
            <h1
              className="font-black text-white tracking-tighter leading-[0.8] uppercase italic"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
              MENTOR <br />
              <span className="text-[#2D31FA]">ELITE.</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl font-bold text-white/40 leading-tight max-w-md relative z-10"
          >
            A collective of IITians, Research Scholars, and Industry Veterans dedicated to your breakthrough.
          </motion.p>
        </div>

        {/* Vivus SVG divider below hero */}
        <VivusSVG className="mb-16 opacity-20 -mt-16 relative z-10">
          <svg width="100%" height="24" viewBox="0 0 800 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12 Q200 24 400 12 Q600 0 800 12" stroke="#2D31FA" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </VivusSVG>

        {/* Dynamic Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-32">
                <LottieLoader size={80} />
              </div>
            ) : faculty.length === 0 ? (
              <div className="col-span-full py-20 text-center italic text-gray-300 text-3xl">No Mentors Currently Active.</div>
            ) : (
              faculty.map((member, i) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-0 group rounded-[48px] md:rounded-[60px] overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-700 bg-white">
                    <div className="relative h-[500px] overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      
                      <div className="absolute bottom-10 left-10 right-10 space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">{member.name}</h3>
                          <BadgeCheck className="w-8 h-8 text-[#2D31FA]" />
                        </div>
                        <p className="text-[#2D31FA] font-black uppercase tracking-widest text-xs">
                          {member.role} — {member.expertise}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-8 md:p-12 space-y-6 md:space-y-8 flex flex-col justify-between h-[260px] md:h-[300px]">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[#2D31FA]">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Certified Mentor</span>
                        </div>
                        <p className="text-gray-500 font-bold leading-relaxed line-clamp-4 italic">
                          &quot;{member.bio || "Dedicated to unlocking every student's hidden potential through rigorous methodology and conceptual clarity."}&quot;
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-6 border-t border-black/5">
                        <div className="flex gap-4">
                          {member.linkedin ? (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-6 h-6 text-gray-300 hover:text-[#2D31FA] transition-all cursor-pointer" />
                            </a>
                          ) : (
                            <Linkedin className="w-6 h-6 text-gray-200 opacity-30 cursor-not-allowed" />
                          )}
                          {member.email ? (
                            <a href={`mailto:${member.email}`}>
                              <Mail className="w-6 h-6 text-gray-300 hover:text-[#2D31FA] transition-all cursor-pointer" />
                            </a>
                          ) : (
                            <Mail className="w-6 h-6 text-gray-200 opacity-30 cursor-not-allowed" />
                          )}
                        </div>
                        <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase border-gray-100">Profile Verified</Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Join CTA */}
        <div className="mt-16 md:mt-32">
          <Link href="/join-faculty">
            <Card className="bg-black rounded-[48px] md:rounded-[60px] p-10 md:p-20 text-white border-none flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 group cursor-pointer hover:border-[#2D31FA]/30 transition-all">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight uppercase italic leading-[0.8]">WANT TO <br /><span className="text-[#2D31FA]">JOIN US?</span></h2>
                <p className="text-lg md:text-xl text-white/40 font-bold max-w-md">We are always looking for mentors who are obsessed with academic perfection.</p>
              </div>
              <div className="w-32 h-32 bg-[#2D31FA] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </Card>
          </Link>
        </div>

      </div>
    </div>
  );
}
