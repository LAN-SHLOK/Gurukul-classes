import mongoose, { Schema } from "mongoose";

const topperSchema = new Schema({
  name: { type: String, required: true },
  score: { type: String, required: true },
  year: { type: String, required: true },
  exam: { type: String, required: true },
  image: { type: String, required: true },
  achievement: { type: String },
  created_at: { type: Date, default: Date.now }
});

export const Topper = mongoose.models.Topper || mongoose.model("Topper", topperSchema);
