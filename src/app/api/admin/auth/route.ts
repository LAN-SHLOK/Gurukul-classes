import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { passkey } = await req.json();
    const correctPassword = process.env.ADMIN_PASSWORD || "GurukulAdmin123";

    if (passkey === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid Passkey" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication Failed" }, { status: 500 });
  }
}
