type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Returns true if the request is allowed. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function rateLimitResponse() {
  return Response.json(
    { ok: false, success: false, error: "Too many attempts. Please wait and try again." },
    { status: 429 }
  );
}
