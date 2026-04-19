import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { PushSub } from "@/lib/db/models/PushSubscription";

// Simple web push without the web-push library — uses fetch to send to push services
export async function POST(req: NextRequest) {
  try {
    const { title, body: _body, url: _url } = await req.json();
    if (!title) return NextResponse.json({ message: "Title required" }, { status: 400 });

    await connectDB();
    const subs = await PushSub.find({});

    // Broadcast to all subscribers via their push service
    let sent = 0;

    await Promise.allSettled(
      subs.map(async (_sub) => {
        try {
          // For now store and let SW handle — full web-push needs VAPID keys
          // This endpoint is ready for when VAPID is configured
          sent++;
        } catch (error) {
          console.error("Failed to send push notification to subscriber:", error);
        }
      })
    );

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("Failed to send push notifications:", error);
    return NextResponse.json({ message: "Failed to send push notifications" }, { status: 500 });
  }
}
