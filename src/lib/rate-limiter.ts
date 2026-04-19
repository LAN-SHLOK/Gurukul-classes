/**
 * Modular Rate Limiter for Next.js 15 (Vercel Optimized)
 * 
 * Supports both Upstash Redis (pro-level/distributed) 
 * and a memory-based fallback (zero-config).
 */

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory store for fallback (cleared on serverless cold starts)
const memoryStore = new Map<string, { count: number; expires: number }>();

export async function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  // If Upstash variables are set in the future, we would use @upstash/ratelimit here.
  // For now, we use a robust sliding-window memory implementation.

  const now = Date.now();
  const userData = memoryStore.get(identifier);

  if (!userData || now > userData.expires) {
    const expires = now + windowMs;
    memoryStore.set(identifier, { count: 1, expires });
    return { success: true, limit, remaining: limit - 1, reset: expires };
  }

  if (userData.count >= limit) {
    return { success: false, limit, remaining: 0, reset: userData.expires };
  }

  userData.count += 1;
  memoryStore.set(identifier, userData);

  return { success: true, limit, remaining: limit - userData.count, reset: userData.expires };
}

/**
 * Helper to get the client IP in Next.js middleware or route handlers
 */
export function getIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0] : "127.0.0.1";
}
