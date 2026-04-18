import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { passkey } = await req.json();
  if (passkey === process.env.STAFF_PASSWORD) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ message: "Invalid passkey" }, { status: 401 });
}
