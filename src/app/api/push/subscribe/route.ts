import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { PushSub } from "@/lib/db/models/PushSubscription";

export async function POST(req: NextRequest) {
  try {
    const { subscription, student_id } = await req.json();
    if (!subscription?.endpoint) return NextResponse.json({ message: "Invalid subscription" }, { status: 400 });

    await connectDB();
    await PushSub.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { keys: subscription.keys, student_id: student_id || null },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
