import mongoose, { Schema } from "mongoose";

/**
 * Attendance is tracked per student, per lecture slot.
 * One record = one student attended (or missed) one specific lecture.
 *
 * staff marks: for a given date + standard + subject → list of present student IDs
 */
const attendanceSchema = new Schema({
  student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  standard:   { type: String, required: true },   // e.g. "11th Sci Eng Med"
  date:       { type: String, required: true },   // YYYY-MM-DD
  subject:    { type: String, required: true },   // e.g. "Physics"
  status:     { type: String, enum: ["present", "absent"], required: true },
  marked_by:  { type: String },                   // staff identifier
  marked_at:  { type: Date, default: Date.now },  // when attendance was marked
  created_at: { type: Date, default: Date.now },
});

// One record per student per subject per date
attendanceSchema.index({ student_id: 1, date: 1, subject: 1 }, { unique: true });
// Fast lookup by standard + date for staff marking
attendanceSchema.index({ standard: 1, date: 1, subject: 1 });

export const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
