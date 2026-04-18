import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Topper } from "@/lib/db/models/Topper";

export async function GET() {
  try {
    await connectDB();
    const toppers = await Topper.find({}).sort({ created_at: -1 });
    return NextResponse.json(toppers, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch toppers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ["name", "score", "year", "exam", "image"];
    const missing = required.filter((f) => !body[f] || !String(body[f]).trim());

    if (missing.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missing.join(", ")}` },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    await connectDB();
    const newTopper = new Topper(body);
    await newTopper.save();
    return NextResponse.json(
      { success: true, data: newTopper },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to create topper entry" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

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
    await Topper.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to delete topper record" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
