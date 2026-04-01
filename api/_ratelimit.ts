import { kv } from './_kv'

/**
 * IP-based rate limiting using Vercel KV.
 * Returns true if request is allowed, false if rate limited.
 */
export async function checkRateLimit(
  ip: string,
  limit = 10,
  windowSecs = 3600
): Promise<boolean> {
  const key = `ratelimit:${ip}`
  const current = await kv.incr(key)
  if (current === 1) {
    await kv.expire(key, windowSecs)
  }
  return current <= limit
}
