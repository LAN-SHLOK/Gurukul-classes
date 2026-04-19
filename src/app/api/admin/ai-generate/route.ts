import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateAdminNote } from "@/lib/services/admin-ai";
import { rateLimit, getIP } from "@/lib/rate-limiter";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { v2 as cloudinary } from "cloudinary";
import { noteQueue } from "@/lib/queue/client";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  // 1. Auth Check
  const session = await auth();
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Admin Rate Limit (Higher: 50 per hour)
  const ip = getIP(req);
  const { success } = await rateLimit(`admin-ai:${ip}`, 50, 3600000);
  if (!success) {
    return NextResponse.json({ error: "Admin quota exceeded. Please wait an hour." }, { status: 429 });
  }

  try {
    const { prompt, title, subject, standard } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    // 3. Add to Queue
    const job = await noteQueue.add(`note-${Date.now()}`, {
      prompt,
      title: title || prompt.substring(0, 30),
      subject: subject || "General",
      standard: standard || "N/A",
    });

    return NextResponse.json({
      success: true,
      message: "Task added to background queue",
      jobId: job.id,
    });

  } catch (error: any) {
    console.error("[Admin AI] Generation failed:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
