import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, default: "Main Campus" },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now }
});

export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
