import mongoose, { Schema } from "mongoose";

const pushSubscriptionSchema = new Schema({
  endpoint:   { type: String, required: true, unique: true },
  keys:       { p256dh: String, auth: String },
  student_id: { type: Schema.Types.ObjectId, ref: "Student" },
  created_at: { type: Date, default: Date.now },
});

export const PushSub =
  mongoose.models.PushSub || mongoose.model("PushSub", pushSubscriptionSchema);
