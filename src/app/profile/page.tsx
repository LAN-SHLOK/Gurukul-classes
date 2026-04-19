"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const inputCls = "w-full h-12 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-[#2D31FA]/60 outline-none px-4 text-sm font-medium transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D31FA] block px-1">{label}</label>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { data: _session, status } = useSession({
    required: true,
    onUnauthenticated() { redirect("/login"); },
  });

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    mobile: "", gender: "", dob: "",
    parent_name: "", parent_mobile: "",
    address: "", previous_school: "",
  });

  // Pre-fill if already has data
  useEffect(() => {
    fetch("/api/student/me").then(r => r.json()).then(d => {
      setForm({
        mobile: d.mobile || "",
        gender: d.gender || "",
        dob: d.dob || "",
        parent_name: d.parent_name || "",
        parent_mobile: d.parent_mobile || "",
        address: d.address || "",
        previous_school: d.previous_school || "",
      });
    }).catch((error) => {
      console.error("Failed to fetch profile data:", error);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update profile. Please try again.");
        console.error("Profile update failed:", data);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Network error. Please check your connection and try again.");
    }
    finally { setSaving(false); }
  };

  if (status === "loading") return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex gap-2">{[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#2D31FA] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 overflow-x-hidden">
      <div className="container mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D31FA] mb-2">Student Portal</p>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
              Complete Your<br /><span className="text-[#2D31FA]">Profile.</span>
            </h1>
            <p className="text-white/40 text-sm font-medium mt-2">Help us know you better. This info is only visible to admin.</p>
          </div>

          {saved ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-3xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-black text-xl">Profile Saved!</p>
              <p className="text-white/40 text-sm">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm font-bold">{error}</p>
                </div>
              )}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Personal Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Mobile *">
                    <input type="tel" placeholder="+91 98765 43210" value={form.mobile}
                      onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))}
                      className={inputCls} required />
                  </Field>
                  <Field label="Gender">
                    <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                      className={inputCls + " cursor-pointer [color-scheme:dark]"}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>
                </div>
                <Field label="Date of Birth">
                  <input type="date" value={form.dob}
                    onChange={e => setForm(p => ({ ...p, dob: e.target.value }))}
                    className={inputCls + " [color-scheme:dark]"} />
                </Field>
                <Field label="Address">
                  <input type="text" placeholder="Your full address" value={form.address}
                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    className={inputCls} />
                </Field>
                <Field label="Previous School">
                  <input type="text" placeholder="e.g. ABC High School" value={form.previous_school}
                    onChange={e => setForm(p => ({ ...p, previous_school: e.target.value }))}
                    className={inputCls} />
                </Field>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Parent / Guardian</p>
                <Field label="Parent Name *">
                  <input type="text" placeholder="Parent or Guardian name" value={form.parent_name}
                    onChange={e => setForm(p => ({ ...p, parent_name: e.target.value }))}
                    className={inputCls} required />
                </Field>
                <Field label="Parent Mobile *">
                  <input type="tel" placeholder="+91 98765 43210" value={form.parent_mobile}
                    onChange={e => setForm(p => ({ ...p, parent_mobile: e.target.value }))}
                    className={inputCls} required />
                </Field>
              </div>

              <button type="submit" disabled={saving}
                className="w-full h-12 rounded-2xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-60 shadow-[0_0_30px_-8px_rgba(45,49,250,0.6)]">
                {saving ? "Saving..." : "Save Profile"}
              </button>

              <Link href="/dashboard" className="block text-center text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors">
                Skip for now
              </Link>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
