import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Schedule } from "@/lib/db/models/Schedule";

// 2.1 GET — public, sorted by date ASC then standard ASC, cached
export async function GET() {
  try {
    await connectDB();
    const schedules = await Schedule.find({}).sort({ date: 1, standard: 1 });
    return NextResponse.json(schedules, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    return NextResponse.json({ message: "Failed to fetch schedules from database" }, { status: 500 });
  }
}

// 2.2 POST — create with field validation and duplicate detection
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { standard, date, dayOfWeek, slots } = body;

    if (
      !standard || !String(standard).trim() ||
      !date || !String(date).trim() ||
      !dayOfWeek || !String(dayOfWeek).trim() ||
      !slots || !Array.isArray(slots) || slots.length < 1
    ) {
      return NextResponse.json(
        { message: "Missing required fields: standard, date, dayOfWeek, slots (min 1)" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    await connectDB();
    const newSchedule = new Schedule({ standard, date, dayOfWeek, slots });
    await newSchedule.save();
    return NextResponse.json(
      { success: true, data: newSchedule },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    if (
      typeof err === "object" && err !== null &&
      "code" in err && (err as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { message: "Schedule for this standard and date already exists" },
        { status: 409, headers: { "Cache-Control": "no-store" } }
      );
    }
    console.error("Failed to create schedule:", err);
    return NextResponse.json(
      { message: "Failed to create schedule. Please check your input and try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

// 2.3 PUT — update with ObjectId validation, 404 handling, updated_at timestamp
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...fields } = body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid id" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    await connectDB();
    const updated = await Schedule.findByIdAndUpdate(
      id,
      { ...fields, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Schedule not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { success: true, data: updated },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    if (
      typeof err === "object" && err !== null &&
      "code" in err && (err as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { message: "Schedule for this standard and date already exists" },
        { status: 409, headers: { "Cache-Control": "no-store" } }
      );
    }
    console.error("Failed to update schedule:", err);
    return NextResponse.json(
      { message: "Failed to update schedule. Please check your input and try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

// 2.4 DELETE — with ObjectId validation
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid id" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    await connectDB();
    await Schedule.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    return NextResponse.json(
      { message: "Failed to delete schedule. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
