// Best-effort, in-memory rate limiting per key (resets per server instance,
// and on every hot reload of this module in development).
const buckets = new Map<string, { count: number; resetAt: number }>();

/** Returns true when the action is allowed, false when `key` exceeded `limit` within `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count++;
  return bucket.count <= limit;
}
