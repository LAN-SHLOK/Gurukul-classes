import mongoose, { Schema } from "mongoose";

const lectureSlotSchema = new Schema(
  {
    subject:   { type: String, required: true },
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true },
  },
  { _id: false }
);

const scheduleSchema = new Schema({
  standard:  { type: String, required: true },
  date:      { type: String, required: true },
  dayOfWeek: { type: String, required: true },
  slots: {
    type: [lectureSlotSchema],
    required: true,
    validate: [(v: unknown[]) => v.length > 0, "At least one slot required"],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

scheduleSchema.index({ standard: 1, date: 1 }, { unique: true });

export const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
