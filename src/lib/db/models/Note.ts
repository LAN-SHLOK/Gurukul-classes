import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
  title:      { type: String, required: true },
  subject:    { type: String, required: true },
  standard:   { type: String, required: true },
  file_url:   { type: String, required: true }, // Cloudinary URL
  file_type:  { type: String, default: "pdf" },
  created_at: { type: Date, default: Date.now },
});

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
