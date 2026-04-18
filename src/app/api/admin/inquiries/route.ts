import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Inquiry } from "@/lib/db/models/Inquiry";

export async function GET() {
  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ created_at: -1 });
    return NextResponse.json(inquiries, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch inquiries" }, { status: 500 });
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
    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to delete inquiry" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
