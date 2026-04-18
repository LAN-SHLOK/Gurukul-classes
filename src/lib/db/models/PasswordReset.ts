import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordReset extends Document {
  email: string;
  code: string;
  expiresAt: Date;
}

const PasswordResetSchema: Schema = new Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { 
    type: Date, 
    required: true, 
    index: { expires: '10m' } // MongoDB will automatically delete records 10 minutes after this date
  }
}, { timestamps: true });

// Ensure the model is only compiled once
export const PasswordReset = mongoose.models.PasswordReset || mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);
