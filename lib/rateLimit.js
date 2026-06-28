// Simple in-memory rate limiter. Works correctly for single-instance
// deployments (local dev, single Vercel function instance). For
// multi-instance/serverless at scale, swap the Map for Redis + @upstash/ratelimit.
const store = new Map();

// Cleans up expired entries so the Map doesn't grow forever on long-running
// servers. Called on every check — cheap because Map iteration is O(n) but
// n is bounded by unique IPs within the current window.
function purgeExpired() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

/**
 * @param {string} key  - Usually the requester's IP address
 * @param {object} opts
 * @param {number} opts.max       - Max requests allowed per window (default 10)
 * @param {number} opts.windowMs  - Window length in ms (default 60 000 = 1 min)
 * @returns {{ allowed: boolean, retryAfter?: number }}
 */
export function checkRateLimit(key, { max = 10, windowMs = 60_000 } = {}) {
  purgeExpired();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= max) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true };
}
