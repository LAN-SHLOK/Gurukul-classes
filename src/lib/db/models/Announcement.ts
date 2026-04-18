import mongoose, { Schema } from "mongoose";

const announcementSchema = new Schema({
  text:       { type: String, required: true },
  active:     { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export const Announcement =
  mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
