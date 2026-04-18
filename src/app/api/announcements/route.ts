import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Announcement } from "@/lib/db/models/Announcement";

export async function GET() {
  try {
    await connectDB();
    const ann = await Announcement.findOne({ active: true }).sort({ created_at: -1 });
    return NextResponse.json(ann || null, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ message: "Text required" }, { status: 400 });
    await connectDB();
    // Deactivate all existing
    await Announcement.updateMany({}, { active: false });
    const ann = await Announcement.create({ text: text.trim(), active: true });
    return NextResponse.json({ success: true, data: ann }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id || !mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    await connectDB();
    await Announcement.findByIdAndUpdate(id, { active: false });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
