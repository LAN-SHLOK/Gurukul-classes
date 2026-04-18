import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  first_name:       { type: String, required: true },
  last_name:        { type: String, required: true },
  mobile:           { type: String },
  email:            { type: String, unique: true, required: true },
  gender:           { type: String },
  dob:              { type: String },           // Date of birth YYYY-MM-DD
  parent_name:      { type: String },           // Parent/Guardian name
  parent_mobile:    { type: String },           // Parent mobile
  address:          { type: String },           // Full address
  previous_school:  { type: String },           // Previous school name
  password:         { type: String },
  image:            { type: String },
  provider:         { type: String },
  profileComplete:  { type: Boolean, default: false },
  feeStatus:        { type: String, enum: ["paid", "pending", "partial"], default: "pending" },
  feeAmount:        { type: Number },
  feePaidDate:      { type: Date },
  feeNote:          { type: String },
  standard:         { type: String },
  enrolledSubjects: { type: [String], default: [] },
  courses:          { type: [String], default: [] },
  created_at:       { type: Date, default: Date.now },
});

export const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
