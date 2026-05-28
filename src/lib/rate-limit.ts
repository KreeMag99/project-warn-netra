/**
 * Simple in-memory rate limiter for API routes.
 * No external dependencies — uses a Map with automatic TTL cleanup.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(name: string): Map<string, RateLimitEntry> {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  return stores.get(name)!;
}

export function rateLimit(options: {
  /** Unique name for this limiter (e.g. 'report', 'subscribe') */
  name: string;
  /** Max requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}) {
  const { name, maxRequests, windowSeconds } = options;
  const store = getStore(name);

  return {
    check(ip: string): { allowed: boolean; remaining: number } {
      const now = Date.now();
      const entry = store.get(ip);

      // Clean up expired entries periodically (every 100 checks)
      if (Math.random() < 0.01) {
        for (const [key, val] of store.entries()) {
          if (now > val.resetAt) store.delete(key);
        }
      }

      if (!entry || now > entry.resetAt) {
        store.set(ip, { count: 1, resetAt: now + windowSeconds * 1000 });
        return { allowed: true, remaining: maxRequests - 1 };
      }

      if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0 };
      }

      entry.count++;
      return { allowed: true, remaining: maxRequests - entry.count };
    },
  };
}

/**
 * Extract client IP from request headers.
 * Works with Vercel, Cloudflare, and standard reverse proxies.
 */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    '127.0.0.1'
  );
}

/**
 * Honeypot check — if the hidden field has any value, a bot filled it in.
 * Returns true if the request is from a bot.
 */
export function isBot(body: Record<string, unknown>): boolean {
  return !!(body.website || body.honeypot);
}
