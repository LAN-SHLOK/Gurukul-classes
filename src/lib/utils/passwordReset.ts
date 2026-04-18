import { IPasswordReset } from '@/types/models';

// In-memory storage for password reset codes
// In production, consider using Redis or database
const resetCodes = new Map<string, IPasswordReset>();

export function storeResetCode(email: string, code: string): void {
  resetCodes.set(email, {
    email,
    code,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
}

export function getResetCode(email: string): IPasswordReset | undefined {
  return resetCodes.get(email);
}

export function deleteResetCode(email: string): void {
  resetCodes.delete(email);
}

export function isCodeValid(email: string, code: string): boolean {
  const stored = resetCodes.get(email);
  
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    resetCodes.delete(email);
    return false;
  }
  
  return stored.code === code;
}

export function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
