import { PasswordReset } from '@/lib/db/models/PasswordReset';

export async function storeResetCode(email: string, code: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  // Upsert the reset code for this email
  await PasswordReset.findOneAndUpdate(
    { email },
    { code, expiresAt },
    { upsert: true, new: true }
  );
}

export async function deleteResetCode(email: string): Promise<void> {
  await PasswordReset.deleteOne({ email });
}

export async function isCodeValid(email: string, code: string): Promise<boolean> {
  const stored = await PasswordReset.findOne({ email });
  
  if (!stored) return false;
  if (new Date() > stored.expiresAt) {
    await PasswordReset.deleteOne({ email });
    return false;
  }
  
  return stored.code === code;
}

export function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
