import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Inquiry } from "@/lib/db/models/Inquiry";
import { sendInquiryNotification, sendInquiryConfirmation } from "@/lib/services/email";
import { rateLimit, getIP } from "@/lib/rate-limiter";
import { emailQueue } from "@/lib/queue/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  // Rate Limiting: 3 inquiries per 10 minutes
  const ip = getIP(req);
  const { success } = await rateLimit(`inquiry:${ip}`, 3, 600000);
  
  if (!success) {
    return NextResponse.json(
      { message: "Too many inquiries. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, className, message } = body;

    // Validate required fields
    if (
      !firstName || !String(firstName).trim() ||
      !lastName  || !String(lastName).trim()  ||
      !className || !String(className).trim()
    ) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    // Validate email format
    if (!email || !EMAIL_REGEX.test(String(email).trim())) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    await connectDB();

    const newInquiry = new Inquiry({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      class_name: className.trim(),
      message: message?.trim() || "",
      created_at: new Date(),
    });
    await newInquiry.save();

    // 4. Offload Emails to Queue (Async Processing)
    await emailQueue.add(`inquiry-${newInquiry._id}`, {
      first_name: newInquiry.first_name,
      last_name: newInquiry.last_name,
      email: newInquiry.email,
      class_name: newInquiry.class_name,
      message: newInquiry.message,
    });

    return NextResponse.json({ success: true, message: "Inquiry submitted successfully" });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
