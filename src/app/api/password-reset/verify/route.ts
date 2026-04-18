import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Student } from "@/lib/db/models/Student";
import { isCodeValid, deleteResetCode } from "@/lib/utils/passwordReset";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: "Email, code, and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (!(await isCodeValid(email.trim(), String(code).trim()))) {
      return NextResponse.json({ message: "Invalid or expired verification code" }, { status: 400 });
    }

    await connectDB();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await Student.findOneAndUpdate(
      { email: email.trim() },
      { password: hashedPassword }
    );

    if (!updated) {
      return NextResponse.json({ message: "Account not found" }, { status: 404 });
    }

    await deleteResetCode(email.trim());

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Password reset verify error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
