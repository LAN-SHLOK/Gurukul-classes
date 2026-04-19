import mongoose, { Schema } from "mongoose";

const facultySchema = new Schema({
  name:      { type: String, required: true },
  role:      { type: String, required: true },
  expertise: { type: String, required: true },
  image:     { type: String, required: true },
  bio:       { type: String },
  linkedin:  { type: String, default: "" },
  email:     { type: String, default: "" },
  created_at: { type: Date, default: Date.now }
});

export const Faculty = (mongoose.models.Faculty as any) || mongoose.model("Faculty", facultySchema);
