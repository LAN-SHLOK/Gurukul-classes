"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, ChevronRight, X, Plus, Trash2, Pencil,
  Calendar, Clock, Users, CheckCircle2, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSocket } from "@/hooks/useSocket";
import { LenisContext as LenisCtx } from "@/components/layout/SmoothScrollProvider";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LectureSlot { subject: string; startTime: string; endTime: string; }
interface Schedule { _id: string; standard: string; date: string; dayOfWeek: string; slots: LectureSlot[]; }
interface AttendanceStudent { _id: string; name: string; email: string; status: string | null; }

// ─── Standards ────────────────────────────────────────────────────────────────
const STANDARDS = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11 Science", "Class 11 Commerce", "Class 11 Arts",
  "Class 12 Science", "Class 12 Commerce", "Class 12 Arts",
  "JEE Mains", "JEE Advanced", "NEET",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputCls = "w-full h-11 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-[#2D31FA]/60 outline-none px-4 text-sm font-medium transition-all";

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}
function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D31FA] block px-1">{label}</label>
      {children}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#2D31FA] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Schedule Modal ───────────────────────────────────────────────────────────
function ScheduleModal({ open, onClose, onSuccess, editData }: {
  open: boolean; onClose: () => void; onSuccess: () => void; editData?: Schedule | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [standard, setStandard] = useState("");
  const [date, setDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [slots, setSlots] = useState<LectureSlot[]>([{ subject: "", startTime: "", endTime: "" }]);
  const lenisCtx = useContext(LenisCtx);

  useEffect(() => {
    lenisCtx.destroy(); document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; lenisCtx.reinit(); };
  }, [lenisCtx]);

  useEffect(() => {
    if (editData) {
      setStandard(editData.standard); setDate(editData.date); setDayOfWeek(editData.dayOfWeek);
      setSlots(editData.slots.length ? editData.slots : [{ subject: "", startTime: "", endTime: "" }]);
    } else {
      setStandard(""); setDate(""); setDayOfWeek("");
      setSlots([{ subject: "", startTime: "", endTime: "" }]);
    }
    setError("");
  }, [editData, open]);

  const handleDateChange = (val: string) => {
    setDate(val);
    setDayOfWeek(val ? new Date(val + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" }) : "");
  };
  const updateSlot = (i: number, field: keyof LectureSlot, val: string) =>
    setSlots(p => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!standard.trim()) { setError("Standard is required"); return; }
    if (!date) { setError("Date is required"); return; }
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (!s.subject.trim()) { setError(`Subject required for slot ${i + 1}`); return; }
      if (!s.startTime || !s.endTime) { setError(`Times required for slot ${i + 1}`); return; }
      if (s.startTime >= s.endTime) { setError(`Start must be before end for slot ${i + 1}`); return; }
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = { standard, date, dayOfWeek, slots };
      if (editData) body.id = editData._id;
      const res = await fetch("/api/admin/schedules", {
        method: editData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) { onSuccess(); onClose(); }
      else { const d = await res.json(); setError(d.message || "Failed to save"); }
    } catch { setError("An error occurred."); }
    finally { setLoading(false); }
  };

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg bg-[#0A0A0F] border border-white/10 rounded-3xl shadow-2xl flex flex-col"
          style={{ height: "min(92dvh, 760px)" }} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2D31FA]/10 border border-[#2D31FA]/20 rounded-2xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#2D31FA]" />
              </div>
              <div>
                <p className="text-base font-black text-white tracking-tight leading-none">{editData ? "Edit Schedule" : "Add Schedule"}</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Fill in all required fields</p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white active:scale-95 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5 min-h-0 [&::-webkit-scrollbar]:hidden" onTouchMove={e => e.stopPropagation()}>
            <form id="staff-sch-form" onSubmit={handleSubmit} className="space-y-4 pb-4">
              <Field label="Standard *">
                <select value={standard} onChange={e => setStandard(e.target.value)}
                  className={inputCls + " cursor-pointer [color-scheme:dark]"}>
                  <option value="">Select standard</option>
                  {STANDARDS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date *">
                  <input type="date" value={date} onChange={e => handleDateChange(e.target.value)}
                    className={inputCls + " [color-scheme:dark]"} />
                </Field>
                <Field label="Day">
                  <input type="text" value={dayOfWeek} readOnly placeholder="Auto"
                    className={inputCls + " opacity-50 cursor-not-allowed"} />
                </Field>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D31FA] px-1">Lecture Slots *</label>
                  <button type="button" onClick={() => setSlots(p => [...p, { subject: "", startTime: "", endTime: "" }])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D31FA]/10 border border-[#2D31FA]/20 text-[#2D31FA] text-[10px] font-black uppercase tracking-widest hover:bg-[#2D31FA]/20 transition-all">
                    <Plus className="w-3 h-3" /> Add Slot
                  </button>
                </div>
                {slots.map((slot, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Slot {i + 1}</span>
                      <button type="button" onClick={() => slots.length > 1 && setSlots(p => p.filter((_, idx) => idx !== i))}
                        disabled={slots.length <= 1}
                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:bg-red-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <Field label="Subject *">
                      <input type="text" placeholder="e.g. Physics" value={slot.subject}
                        onChange={e => updateSlot(i, "subject", e.target.value)} className={inputCls} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Start *">
                        <input type="time" value={slot.startTime} onChange={e => updateSlot(i, "startTime", e.target.value)}
                          className={inputCls + " [color-scheme:dark]"} />
                      </Field>
                      <Field label="End *">
                        <input type="time" value={slot.endTime} onChange={e => updateSlot(i, "endTime", e.target.value)}
                          className={inputCls + " [color-scheme:dark]"} />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              {error && <p className="text-[10px] font-black tracking-widest text-red-400 uppercase px-1">{error}</p>}
            </form>
          </div>
          <div className="flex items-center gap-3 px-5 pb-6 pt-4 border-t border-white/[0.06] flex-shrink-0 bg-[#0A0A0F] rounded-b-3xl">
            <Button type="submit" form="staff-sch-form" isLoading={loading}
              className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-sm bg-[#2D31FA] hover:bg-blue-500 active:scale-[0.98] transition-all">
              {loading ? "Saving..." : editData ? "Update" : "Add Schedule"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}
              className="h-12 rounded-xl bg-white/5 border-white/10 hover:bg-red-500/10 hover:text-red-400 active:scale-[0.98] text-white/60 font-black uppercase tracking-widest text-sm px-5 transition-all">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Attendance Marker ────────────────────────────────────────────────────────
function AttendanceMarker() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [standard, setStandard] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/schedules").then(r => r.json()).then(d => { if (Array.isArray(d)) setSchedules(d); }).catch((error) => {
      console.error("Failed to fetch schedules:", error);
    });
  }, []);

  const todaySchedule = schedules.find(s => s.standard === standard && s.date === date);
  const subjects = todaySchedule?.slots.map(sl => sl.subject) || [];

  useEffect(() => {
    const activeSubject = subject || customSubject.trim();
    if (!date || !standard || !activeSubject) { setStudents([]); return; }
    setLoading(true);
    fetch(`/api/admin/attendance?date=${date}&standard=${encodeURIComponent(standard)}&subject=${encodeURIComponent(activeSubject)}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.students)) setStudents(d.students); })
      .catch((error) => {
        console.error("Failed to fetch students for attendance:", error);
      })
      .finally(() => setLoading(false));
  }, [date, standard, subject, customSubject]);

  const toggle = (id: string) => {
    setStudents(p => p.map(s => s._id === id
      ? { ...s, status: s.status === "present" ? "absent" : s.status === "absent" ? null : "present" }
      : s
    ));
    setSaved(false);
  };

  const markAll = (status: "present" | "absent") => {
    setStudents(p => p.map(s => ({ ...s, status })));
    setSaved(false);
  };

  const activeSubject = subject || customSubject.trim();

  const save = async () => {
    if (!date || !standard || !activeSubject || !students.length) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date, standard, subject: activeSubject,
          records: students.map(s => ({ student_id: s._id, status: s.status || "absent" })),
        }),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        const errorData = await res.json();
        console.error("Failed to save attendance:", errorData);
        alert(errorData.message || "Failed to save attendance. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Network error. Please check your connection and try again.");
    }
    finally { setSaving(false); }
  };

  const selectCls = inputCls + " cursor-pointer [color-scheme:dark]";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Users className="w-4 h-4 text-[#2D31FA]" />
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#2D31FA]">Mark Attendance</p>
      </div>

      {/* Step 1: Date */}
      <div>
        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block mb-1.5 px-1">Step 1 — Date</label>
        <input type="date" value={date}
          onChange={e => { setDate(e.target.value); setSubject(""); setSaved(false); }}
          className={selectCls} />
      </div>

      {/* Step 2: Standard */}
      <div>
        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block mb-1.5 px-1">Step 2 — Standard</label>
        <select value={standard} onChange={e => { setStandard(e.target.value); setSubject(""); setSaved(false); }}
          className={selectCls}>
          <option value="">Select standard</option>
          {/* Standards from existing schedules first */}
          {[...new Set(schedules.map(s => s.standard))].sort().map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
          {/* Then show all predefined standards not already in schedules */}
          {STANDARDS.filter(s => !schedules.some(sc => sc.standard === s)).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Step 3: Subject */}
      {standard && (
        <div>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block mb-1.5 px-1">Step 3 — Subject / Lecture</label>
          {subjects.length > 0 ? (
            <select value={subject} onChange={e => { setSubject(e.target.value); setCustomSubject(""); setSaved(false); }}
              className={selectCls}>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <div className="space-y-2">
              <div className="px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-yellow-400 text-xs font-bold">No schedule for {standard} on {date}. Enter subject manually:</p>
              </div>
              <input
                type="text"
                placeholder="e.g. Physics, Chemistry..."
                value={customSubject}
                onChange={e => { setCustomSubject(e.target.value); setSubject(""); setSaved(false); }}
                className={selectCls}
              />
            </div>
          )}
        </div>
      )}

      {/* Step 4: Student list */}
      {activeSubject && (
        <div className="space-y-3">
          {loading ? <Loader /> : students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm font-medium">No fee-paid students in {standard}.</p>
              <p className="text-white/20 text-xs mt-1">Assign students and mark fees as paid from the Admin panel.</p>
            </div>
          ) : (
            <>
              {/* Bulk actions */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{students.length} students</span>
                <div className="flex gap-2">
                  <button onClick={() => markAll("present")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest hover:bg-green-500/20 transition-all">
                    <CheckCircle2 className="w-3 h-3" /> All Present
                  </button>
                  <button onClick={() => markAll("absent")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                    <XCircle className="w-3 h-3" /> All Absent
                  </button>
                </div>
              </div>

              {/* Student rows */}
              <div className="space-y-2">
                {students.map(s => {
                  const isPresent = s.status === "present";
                  const isAbsent  = s.status === "absent";
                  return (
                    <motion.button key={s._id} onClick={() => toggle(s._id)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all active:scale-[0.99] ${
                        isPresent ? "bg-green-500/10 border-green-500/30" :
                        isAbsent  ? "bg-red-500/10 border-red-500/30" :
                        "bg-white/[0.03] border-white/10 hover:border-white/20"
                      }`}>
                      <div className="text-left min-w-0">
                        <p className={`font-black text-sm truncate ${isPresent ? "text-green-400" : isAbsent ? "text-red-400" : "text-white"}`}>
                          {s.name}
                        </p>
                        <p className="text-white/30 text-xs font-medium truncate">{s.email}</p>
                      </div>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isPresent ? "bg-green-500/20" : isAbsent ? "bg-red-500/20" : "bg-white/5"
                      }`}>
                        {isPresent ? <CheckCircle2 className="w-4 h-4 text-green-400" /> :
                         isAbsent  ? <XCircle className="w-4 h-4 text-red-400" /> :
                         <div className="w-3 h-3 rounded-full border-2 border-white/20" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Save */}
              <button onClick={save} disabled={saving || saved}
                className={`w-full h-12 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
                  saved ? "bg-green-500/20 border border-green-500/30 text-green-400" :
                  "bg-[#2D31FA] text-white hover:bg-blue-500 active:scale-[0.98] shadow-[0_0_30px_-8px_rgba(45,49,250,0.6)]"
                } disabled:opacity-60`}>
                {saving ? "Saving..." : saved ? "✓ Saved" : "Save Attendance"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Schedules Tab ────────────────────────────────────────────────────────────
function SchedulesTab() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Schedule | null>(null);
  const [search, setSearch] = useState("");
  const { on, off } = useSocket();

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/schedules");
      const data = await res.json();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);
  useEffect(() => {
    const h = () => fetchSchedules();
    on("schedules:updated", h);
    return () => off("schedules:updated", h);
  }, [on, off, fetchSchedules]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this schedule?")) return;
    await fetch("/api/admin/schedules", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    });
    setSchedules(p => p.filter(s => s._id !== id));
  };

  const filtered = schedules.filter(s =>
    s.standard.toLowerCase().includes(search.toLowerCase()) ||
    s.date.includes(search) ||
    s.dayOfWeek.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, s) => {
    if (!acc[s.standard]) acc[s.standard] = [];
    acc[s.standard].push(s);
    return acc;
  }, {} as Record<string, Schedule[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input type="text" placeholder="Search by standard, date, day..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/5 rounded-2xl pl-4 pr-4 text-white text-sm focus:border-[#2D31FA]/50 transition-all font-medium outline-none placeholder:text-white/20" />
        </div>
        <button onClick={() => { setEditData(null); setModalOpen(true); }}
          className="press flex items-center gap-2 h-12 px-5 rounded-2xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 active:scale-95 transition-all flex-shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Schedule</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-[#2D31FA]">{schedules.length}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">Total Schedules</p>
        </div>
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-[#2D31FA]">{Object.keys(grouped).length}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">Standards</p>
        </div>
      </div>

      {loading ? <Loader /> : schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Calendar className="w-12 h-12 text-white/10" />
          <p className="text-white/30 font-bold text-lg text-center">No schedules yet.</p>
          <button onClick={() => { setEditData(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all">
            <Plus className="w-4 h-4" /> Add Schedule
          </button>
        </div>
      ) : (
        Object.entries(grouped).map(([std, entries]) => (
          <div key={std} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#2D31FA]">{std}</span>
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[9px] font-black text-white/20">{entries.length} day{entries.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {entries.map((s, i) => (
                  <motion.div key={s._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}
                    className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#2D31FA]" />
                          <span className="text-white font-black text-sm">{formatDate(s.date)}</span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#2D31FA] mt-0.5 block">{s.dayOfWeek}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => { setEditData(s); setModalOpen(true); }}
                          className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#2D31FA]/20 hover:text-[#2D31FA] transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(s._id)}
                          className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-red-600 hover:text-white transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="h-px bg-white/[0.06] mb-3" />
                    <div className="space-y-2">
                      {s.slots.map((slot, j) => (
                        <div key={j} className="flex items-center justify-between gap-3">
                          <span className="text-white/80 font-bold text-sm">{slot.subject}</span>
                          <div className="flex items-center gap-1.5 text-white/40 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}

      <ScheduleModal open={modalOpen} onClose={() => { setModalOpen(false); setEditData(null); }}
        onSuccess={fetchSchedules} editData={editData} />
    </div>
  );
}

// ─── Auth Gate ────────────────────────────────────────────────────────────────
function StaffAuthGate({ onAuth }: { onAuth: () => void }) {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("/api/staff/auth", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passkey }),
      });
      if (res.ok) { onAuth(); }
      else { setError("INVALID PASSKEY"); setPasskey(""); setTimeout(() => setError(""), 2000); }
    } catch { setError("CONNECTION FAILED"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="mb-12 text-center space-y-4">
          <div className="w-20 h-20 bg-[#2D31FA]/10 border border-[#2D31FA]/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_-12px_rgba(45,49,250,0.3)]">
            <Lock className="w-8 h-8 text-[#2D31FA]" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Staff <span className="text-[#2D31FA]">Portal.</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-white/20">Schedule & Attendance Access</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <Input type="password" placeholder="Staff Passkey" value={passkey}
            onChange={e => setPasskey(e.target.value)}
            className="h-16 bg-white/5 border-white/10 text-white rounded-2xl pl-6" />
          {error && <p className="text-[10px] font-black tracking-widest text-[#2D31FA] text-center uppercase">{error}</p>}
          <Button type="submit" isLoading={loading} className="w-full h-16 rounded-2xl group">
            ACCESS PORTAL
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Staff Dashboard ──────────────────────────────────────────────────────────
function StaffDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"schedules" | "attendance">("schedules");

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 overflow-x-hidden">
      <div className="px-4 md:px-8 w-full">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-tight">
                Schedule <span className="text-[#2D31FA]">Manager.</span>
              </h1>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mt-1">
                Staff Portal · Lecture Timetable
              </p>
            </div>
            <button onClick={onLogout}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all">
              Exit
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["schedules", "attendance"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? "bg-[#2D31FA] text-white shadow-lg shadow-blue-500/20" : "bg-white/5 text-white/40 hover:text-white"
                }`}>
                {tab === "schedules" ? "Schedules" : "Attendance"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {activeTab === "schedules" ? <SchedulesTab /> : <AttendanceMarker />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StaffPage() {
  const [authed, setAuthed] = useState(false);
  if (!authed) return <StaffAuthGate onAuth={() => setAuthed(true)} />;
  return <StaffDashboard onLogout={() => setAuthed(false)} />;
}
