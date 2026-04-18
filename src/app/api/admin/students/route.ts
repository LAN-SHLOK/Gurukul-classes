import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Student } from "@/lib/db/models/Student";

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({}, "-password").sort({ created_at: -1 });
    return NextResponse.json(students);
  } catch {
    return NextResponse.json({ message: "Failed to fetch students" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, feeStatus, feeAmount, feePaidDate, feeNote, standard, enrolledSubjects, courses } = body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    if (feeStatus !== undefined) update.feeStatus = feeStatus;
    if (feeAmount !== undefined) update.feeAmount = feeAmount;
    if (feePaidDate !== undefined) update.feePaidDate = feePaidDate ? new Date(feePaidDate) : null;
    if (feeNote !== undefined) update.feeNote = feeNote;
    if (standard !== undefined) update.standard = standard;
    if (Array.isArray(enrolledSubjects)) update.enrolledSubjects = enrolledSubjects;
    if (Array.isArray(courses)) update.courses = courses;

    await connectDB();
    const updated = await Student.findByIdAndUpdate(id, update, { new: true, select: "-password" });
    if (!updated) return NextResponse.json({ message: "Student not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ message: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    await Student.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Failed to delete student" }, { status: 500 });
  }
}
