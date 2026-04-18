import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import { Student } from "@/lib/db/models/Student";

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { mobile, gender, dob, parent_name, parent_mobile, address, previous_school } = body;

    await connectDB();
    const updated = await Student.findOneAndUpdate(
      { email: session.user.email },
      {
        mobile, gender, dob, parent_name, parent_mobile, address, previous_school,
        profileComplete: true,
      },
      { new: true, select: "-password" }
    );

    if (!updated) return NextResponse.json({ message: "Student not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
