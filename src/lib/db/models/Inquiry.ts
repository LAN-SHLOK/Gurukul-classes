import mongoose, { Schema } from "mongoose";

const inquirySchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    class_name: { type: String, required: true },
    message: { type: String },
    created_at: { type: Date, default: Date.now }
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
