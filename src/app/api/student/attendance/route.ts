import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import { Attendance } from "@/lib/db/models/Attendance";
import { Student } from "@/lib/db/models/Student";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const student = await Student.findOne({ email: session.user.email }, "_id feeStatus");
    if (!student) {
      return NextResponse.json({ total: 0, present: 0, percentage: 0, bySubject: {}, records: [], feePaid: false });
    }

    // Gate on fee status
    if (student.feeStatus !== "paid") {
      return NextResponse.json({ total: 0, present: 0, percentage: 0, bySubject: {}, records: [], feePaid: false });
    }

    const records = await Attendance.find({ student_id: student._id }).sort({ date: -1 }).limit(200);

    const total   = records.length;
    const present = records.filter(r => r.status === "present").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    const bySubject: Record<string, { present: number; total: number; percentage: number }> = {};
    for (const r of records) {
      if (!bySubject[r.subject]) bySubject[r.subject] = { present: 0, total: 0, percentage: 0 };
      bySubject[r.subject].total++;
      if (r.status === "present") bySubject[r.subject].present++;
    }
    for (const sub of Object.keys(bySubject)) {
      const s = bySubject[sub];
      s.percentage = Math.round((s.present / s.total) * 100);
    }

    return NextResponse.json({ total, present, percentage, bySubject, records: records.slice(0, 30), feePaid: true });
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
