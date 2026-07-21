import { NextRequest, NextResponse } from "next/server";

// ⚠️ LIMITATION: In-memory rate limiter. Counters reset on container restart.
// For production scaling with multiple containers, migrate to @upstash/ratelimit + Redis.
// Current setup is sufficient for single-container Docker deployment.
//
// Rate limiting coverage gaps (TODO):
//   - PATCH /api/hosts/[id] — no rate limit
//   - DELETE /api/upload — has its own in-memory limiter
//   - GET /api/hosts/[id] — no rate limit (but returns only public fields)

// Simple in-memory rate limiter
const requests = new Map<string, { count: number; resetAt: number }>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  "POST:/api/auth/forgot-password": { max: 3, windowMs: 300_000 }, // 3 per 5 min
  "POST:/api/auth/reset-password": { max: 5, windowMs: 300_000 },  // 5 per 5 min
  "POST:/api/partners": { max: 3, windowMs: 300_000 },        // 3 per 5 min
  "POST:/api/partners/payout": { max: 5, windowMs: 300_000 },   // 5 per 5 min
  "POST:/api/auth/login": { max: 5, windowMs: 60_000 },     // 5 per minute
  "POST:/api/auth/register": { max: 3, windowMs: 60_000 },   // 3 per minute
  "POST:/api/reviews": { max: 5, windowMs: 60_000 },         // 5 per minute
  "POST:/api/bookings": { max: 5, windowMs: 60_000 },        // 5 per minute
  "POST:/api/hosts": { max: 2, windowMs: 60_000 },           // 2 per minute
  "POST:/api/ai/improve-text": { max: 10, windowMs: 60_000 },// 10 per minute
  "POST:/api/services": { max: 5, windowMs: 60_000 },       // 5 per minute
  "POST:/api/service-bookings": { max: 5, windowMs: 60_000 }, // 5 per minute
  "GET:/api/ratings": { max: 30, windowMs: 60_000 },            // 30 per minute
  "POST:/api/promocodes/validate": { max: 10, windowMs: 300_000 }, // 10 per 5 min (anti-bruteforce)
  "POST:/api/chat": { max: 30, windowMs: 60_000 },              // 30 per minute
  "POST:/api/favorites": { max: 20, windowMs: 60_000 },          // 20 per minute
  "DELETE:/api/favorites": { max: 20, windowMs: 60_000 },        // 20 per minute
};

export function rateLimit(req: NextRequest): NextResponse | null {
  // В development rate limit отключён — тесты и локальная разработка не блокируются
  if (process.env.NODE_ENV !== "production") return null;

  const method = req.method;
  const path = req.nextUrl.pathname;
  const key = `${method}:${path}`;

  const limit = LIMITS[key];
  if (!limit) return null;

  // IP-based identifier
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";

  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const entry = requests.get(bucketKey);

  if (!entry || now > entry.resetAt) {
    requests.set(bucketKey, { count: 1, resetAt: now + limit.windowMs });
    return null;
  }

  entry.count++;
  if (entry.count > limit.max) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  return null;
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requests) {
    if (now > entry.resetAt) requests.delete(key);
  }
}, 300_000);
