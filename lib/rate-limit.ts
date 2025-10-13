/**
 * Rate limiting middleware using Upstash Redis
 * Prevents brute force attacks and API abuse
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

// Initialize Redis client (only if env vars are set)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * Rate limiter configurations
 */
export const rateLimiters = {
  // Aggressive rate limit for authentication endpoints
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
        analytics: true,
        prefix: 'ratelimit:auth',
      })
    : null,

  // Moderate rate limit for email operations
  email: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 requests per hour
        analytics: true,
        prefix: 'ratelimit:email',
      })
    : null,

  // Standard rate limit for general API operations
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
        analytics: true,
        prefix: 'ratelimit:api',
      })
    : null,
};

/**
 * Apply rate limiting to a request
 * Uses IP address or user ID as identifier
 */
export async function rateLimit(
  req: NextRequest,
  type: 'auth' | 'email' | 'api',
  identifier?: string
): Promise<{ success: true } | { success: false; response: NextResponse }> {
  // Skip rate limiting in development or if Redis is not configured
  if (process.env.NODE_ENV === 'development' || !rateLimiters[type]) {
    logger.warn('Rate limiting skipped', {
      reason: redis ? 'development mode' : 'Redis not configured',
      type,
    });
    return { success: true };
  }

  // Determine identifier (IP or custom identifier like email/userId)
  const id =
    identifier ||
    
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'anonymous';

  try {
    const { success, limit, reset, remaining } = await rateLimiters[type]!.limit(
      id
    );

    // Log rate limit status
    logger.info('Rate limit check', {
      type,
      identifier: id,
      success,
      limit,
      remaining,
      resetAt: new Date(reset).toISOString(),
    });

    if (!success) {
      logger.warn('Rate limit exceeded', {
        type,
        identifier: id,
        limit,
        resetAt: new Date(reset).toISOString(),
      });

      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Too many requests. Please try again later.',
            retryAfter: new Date(reset).toISOString(),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          }
        ),
      };
    }

    return { success: true };
  } catch (error) {
    // If rate limiting fails, allow the request but log the error
    logger.error('Rate limiting error', error, { type, identifier: id });
    return { success: true };
  }
}

/**
 * Helper to extract user identifier from request
 * Tries: authenticated user ID → email → IP address
 */
export async function getUserIdentifier(req: NextRequest): Promise<string> {
  try {
    // Try to get user ID from Supabase session
    // This would require importing createClient from supabase/server
    // For now, we'll use IP as fallback
    return (
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'anonymous'
    );
  } catch {
    return 'anonymous';
  }
}
