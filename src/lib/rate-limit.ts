import "server-only";

// Simple in-memory fixed-window limiter. Fine for a single server instance;
// swap for Redis/Upstash if you run several instances.
const buckets = new Map<string, { count: number; resetAt: number }>();

// Buckets are keyed by client identity, so most keys are never seen again.
// Sweep them periodically instead of letting the Map grow forever.
const MAX_BUCKETS = 5000;
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 60_000 && buckets.size < MAX_BUCKETS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
  // Still oversized after dropping expired entries: drop the oldest windows.
  if (buckets.size >= MAX_BUCKETS) {
    const excess = buckets.size - Math.floor(MAX_BUCKETS / 2);
    let n = 0;
    for (const key of buckets.keys()) {
      if (n++ >= excess) break;
      buckets.delete(key);
    }
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

// NOTE: this trusts `x-forwarded-for`, which is only correct when a reverse
// proxy (Vercel, nginx, Cloudflare…) sets or overwrites the header. Without a
// proxy every caller reports "unknown" and shares a single bucket; with a
// proxy that merely appends, the header is client-controlled. Keep the
// default limits conservative.
export function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const hop = forwarded.split(",").pop()?.trim();
    if (hop) return hop;
  }
  return req.headers.get("x-real-ip") || "unknown";
}
