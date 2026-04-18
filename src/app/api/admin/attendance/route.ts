import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Attendance } from "@/lib/db/models/Attendance";
import { Student } from "@/lib/db/models/Student";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date      = searchParams.get("date");
    const standard  = searchParams.get("standard");
    const subject   = searchParams.get("subject");
    const studentId = searchParams.get("student_id");

    if (studentId) {
      const records = await Attendance.find({ student_id: studentId }).sort({ date: -1 });
      const bySubject: Record<string, { present: number; total: number }> = {};
      for (const r of records) {
        if (!bySubject[r.subject]) bySubject[r.subject] = { present: 0, total: 0 };
        bySubject[r.subject].total++;
        if (r.status === "present") bySubject[r.subject].present++;
      }
      const total   = records.length;
      const present = records.filter(r => r.status === "present").length;
      return NextResponse.json({ total, present, bySubject, records });
    }

    if (date && standard && subject) {
      const students = await Student.find(
        { standard, feeStatus: "paid" },
        "first_name last_name email _id"
      );
      const existing = await Attendance.find({ date, standard, subject });
      const statusMap: Record<string, string> = {};
      for (const r of existing) statusMap[r.student_id.toString()] = r.status;

      return NextResponse.json({
        students: students.map(s => ({
          _id: s._id,
          name: `${s.first_name} ${s.last_name}`,
          email: s.email,
          status: statusMap[s._id.toString()] || null,
        })),
      });
    }

    return NextResponse.json({ message: "Provide date+standard+subject or student_id" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { date, standard, subject, records } = await req.json();
    if (!date || !standard || !subject || !Array.isArray(records)) {
      return NextResponse.json({ message: "date, standard, subject, records required" }, { status: 400 });
    }
    await connectDB();
    const ops = records.map(({ student_id, status }: { student_id: string; status: string }) => ({
      updateOne: {
        filter: { student_id, date, subject },
        update: { $set: { student_id, date, standard, subject, status } },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(ops);
    return NextResponse.json({ success: true, count: records.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
