"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, ArrowLeft, Sparkles, Users, GraduationCap,
  TrendingUp, Heart, Upload, Loader2, CheckCircle2, Mail,
  Phone, MapPin, FileText, Award, Clock
} from "lucide-react";
import Link from "next/link";

export default function JoinFacultyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    qualification: "",
    subjects: "",
    message: "",
    resume: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("/api/join-faculty", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        qualification: "",
        subjects: "",
        message: "",
        resume: null,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(45,49,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,49,250,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,49,250,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-8 py-16 md:py-24">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/">
            <button className="press flex items-center gap-2 px-4 py-2 rounded-xl glass-pill text-white/50 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D31FA]">Join Our Team</span>
            <div className="flex items-center gap-1.5">
              <span className="collab-dot" style={{ width: 6, height: 6 }} />
              <span className="text-[8px] font-black uppercase tracking-wider text-white/20">We're Hiring</span>
            </div>
          </div>
          <h1
            className="font-black tracking-tighter leading-[0.85] uppercase text-white mb-4"
            style={{ fontSize: "clamp(2.8rem, 8vw, 8rem)" }}
          >
            WANT TO<br />
            <span style={{ color: "#2D31FA" }}>JOIN US?</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base font-medium max-w-2xl">
            We are always looking for mentors who are obsessed with academic perfection.
          </p>
        </motion.div>

        {/* Why Join Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            {
              icon: Users,
              title: "Collaborative Culture",
              desc: "Work with passionate educators and IITians dedicated to student success."
            },
            {
              icon: TrendingUp,
              title: "Growth Opportunities",
              desc: "Continuous professional development and career advancement paths."
            },
            {
              icon: Heart,
              title: "Make an Impact",
              desc: "Shape the future of students preparing for JEE, NEET, and board exams."
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="glass-card rounded-2xl p-6 border border-white/10"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2D31FA] flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-[11px] text-white/40 font-medium leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card rounded-3xl p-6 md:p-10 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#2D31FA] flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Application Form
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Fill in your details below
              </p>
            </div>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Application Submitted!</h3>
              <p className="text-white/40 text-sm mb-6">
                Thank you for your interest. We'll review your application and get back to you soon.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="press px-6 py-3 rounded-xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-widest"
              >
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-[#2D31FA] focus:outline-none transition-colors text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-[#2D31FA] focus:outline-none transition-colors text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-[#2D31FA] focus:outline-none transition-colors text-sm"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Position Applied For *
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#2D31FA] focus:outline-none transition-colors text-sm"
                  >
                    <option value="" className="bg-black">Select position</option>
                    <option value="JEE Faculty" className="bg-black">JEE Faculty</option>
                    <option value="NEET Faculty" className="bg-black">NEET Faculty</option>
                    <option value="Board Exam Teacher" className="bg-black">Board Exam Teacher (1-10)</option>
                    <option value="Academic Coordinator" className="bg-black">Academic Coordinator</option>
                    <option value="Counselor" className="bg-black">Counselor</option>
                    <option value="Administrative Staff" className="bg-black">Administrative Staff</option>
                    <option value="Other" className="bg-black">Other</option>
                  </select>
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Years of Experience *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-[#2D31FA] focus:outline-none transition-colors text-sm"
                      placeholder="e.g., 5 years"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                    Highest Qualification *
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-[#2D31FA] focus:outline-none transition-colors text-sm"
                      placeholder="e.g., M.Sc. Physics, B.Tech IIT"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                  Subjects/Expertise *
                </label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-[#2D31FA] focus:outline-none transition-colors text-sm"
                  placeholder="e.g., Physics, Chemistry, Mathematics"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                  Why do you want to join us?
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-[#2D31FA] focus:outline-none transition-colors text-sm resize-none"
                  placeholder="Tell us about your passion for teaching and why you'd be a great fit..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                  Upload Resume (PDF, DOC, DOCX)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 border-dashed text-white/40 hover:border-[#2D31FA] hover:text-white transition-colors cursor-pointer"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {formData.resume ? formData.resume.name : "Click to upload your resume"}
                    </span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="press w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_50px_-10px_rgba(45,49,250,0.8)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">
            Have questions?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/40">
            <a href="mailto:faculty@gurukul.com" className="hover:text-[#2D31FA] transition-colors">
              faculty@gurukul.com
            </a>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <a href="tel:+919876543210" className="hover:text-[#2D31FA] transition-colors">
              +91 98765 43210
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
