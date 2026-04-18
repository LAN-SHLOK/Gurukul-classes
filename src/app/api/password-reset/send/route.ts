import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Student } from "@/lib/db/models/Student";
import { sendPasswordResetEmail } from "@/lib/services/email";
import { storeResetCode, generateResetCode } from "@/lib/utils/passwordReset";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !EMAIL_REGEX.test(String(email).trim())) {
      return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
    }

    await connectDB();
    const student = await Student.findOne({ email: email.trim() });

    // Always respond OK — don't reveal if email exists
    if (student) {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("CRITICAL: Email environment variables are MISSING.");
        // We still return 500 to the client, but the server log will show the cause
        throw new Error("Email configuration missing");
      }

      const code = generateResetCode();
      await storeResetCode(email.trim(), code);
      await sendPasswordResetEmail(email.trim(), code, student.first_name);
    }

    return NextResponse.json({
      success: true,
      message: "If that email is registered, you will receive a reset code shortly.",
    });
  } catch (err: any) {
    console.error("Password reset send error:", err);
    const errorMessage = err?.message || "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
