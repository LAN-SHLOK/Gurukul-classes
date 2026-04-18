import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import { Student } from "@/lib/db/models/Student";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const student = await Student.findOne(
      { email: session.user.email },
      "first_name last_name email image feeStatus feeAmount feePaidDate feeNote standard enrolledSubjects courses created_at mobile gender dob parent_name parent_mobile address previous_school profileComplete"
    );

    if (!student) {
      return NextResponse.json({ courses: [], enrolledSubjects: [], feeStatus: "pending", feePaid: false, standard: null, profileComplete: false });
    }

    return NextResponse.json({
      _id: student._id,
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      image: student.image,
      courses: student.courses || [],
      enrolledSubjects: student.enrolledSubjects || [],
      feeStatus: student.feeStatus || "pending",
      feePaid: student.feeStatus === "paid",
      feeAmount: student.feeAmount,
      feePaidDate: student.feePaidDate,
      feeNote: student.feeNote,
      standard: student.standard || null,
      created_at: student.created_at,
      mobile: student.mobile || null,
      gender: student.gender || null,
      dob: student.dob || null,
      parent_name: student.parent_name || null,
      parent_mobile: student.parent_mobile || null,
      address: student.address || null,
      previous_school: student.previous_school || null,
      profileComplete: student.profileComplete || false,
    });
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
