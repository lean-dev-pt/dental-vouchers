// Production-grade rate limiter with Vercel KV support
// Falls back to in-memory storage for development

import { kv } from '@vercel/kv';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// In-memory fallback for development/testing
const rateLimitStore = new Map<string, RateLimitEntry>();

// Only run cleanup in development (Vercel KV handles expiration automatically)
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

// Check if Vercel KV is available
const isKvAvailable = !!process.env.KV_REST_API_URL;

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests in the time window
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Use Vercel KV in production, in-memory in development
  if (isKvAvailable) {
    return rateLimitKv(identifier, config);
  } else {
    return rateLimitMemory(identifier, config);
  }
}

// Vercel KV implementation (production)
async function rateLimitKv(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = `rate-limit:${identifier}`;

  try {
    // Get current count and reset time
    const data = await kv.get<RateLimitEntry>(key);

    // If entry doesn't exist or has expired, create new one
    if (!data || data.resetAt < now) {
      const entry: RateLimitEntry = {
        count: 1,
        resetAt: now + config.interval,
      };

      // Store in KV with TTL (auto-expires)
      const ttlSeconds = Math.ceil(config.interval / 1000);
      await kv.set(key, entry, { ex: ttlSeconds });

      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: entry.resetAt,
      };
    }

    // Entry exists and is still valid
    const newCount = data.count + 1;

    if (newCount > config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: data.resetAt,
      };
    }

    // Update count in KV
    const updatedEntry: RateLimitEntry = {
      count: newCount,
      resetAt: data.resetAt,
    };

    const ttlSeconds = Math.ceil((data.resetAt - now) / 1000);
    await kv.set(key, updatedEntry, { ex: Math.max(ttlSeconds, 1) });

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - newCount,
      reset: data.resetAt,
    };
  } catch (error) {
    console.error('Vercel KV rate limit error, falling back to in-memory:', error);
    // Fallback to in-memory if KV fails
    return rateLimitMemory(identifier, config);
  }
}

// In-memory implementation (development/fallback)
function rateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}`;

  let entry = rateLimitStore.get(key);

  // If entry doesn't exist or has expired, create new one
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + config.interval,
    };
    rateLimitStore.set(key, entry);

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: entry.resetAt,
    };
  }

  // Entry exists and is still valid
  entry.count++;

  if (entry.count > config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetAt,
  };
}

// Helper to get client IP address
export function getClientIp(request: Request): string {
  // Check common headers for client IP (in order of priority)
  const headers = new Headers(request.headers);

  return (
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('cf-connecting-ip') || // Cloudflare
    'unknown'
  );
}
