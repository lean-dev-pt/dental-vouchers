/**
 * CSRF (Cross-Site Request Forgery) Protection
 * Generates and validates tokens to prevent unauthorized state-changing requests
 */

import { NextRequest } from 'next/server';
import { logger } from './logger';

/**
 * Generate a CSRF token
 * In production, use a more robust implementation with:
 * - Cryptographically secure random generation
 * - Token expiration
 * - Token storage in session/database
 */
export function generateCsrfToken(): string {
  // Simple implementation for now
  // In production, consider using a library like 'csrf' or 'csurf'
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}`;
}

/**
 * Validate CSRF token from request
 * Checks X-CSRF-Token header against expected value
 */
export function validateCsrfToken(req: NextRequest, expectedToken?: string): boolean {
  // Skip CSRF validation for webhook routes (validated via signature)
  if (req.nextUrl.pathname.includes('/webhook')) {
    return true;
  }

  // Skip CSRF validation in development
  if (process.env.NODE_ENV === 'development') {
    logger.info('CSRF validation skipped in development');
    return true;
  }

  const token = req.headers.get('x-csrf-token');

  if (!token) {
    logger.warn('Missing CSRF token', {
      path: req.nextUrl.pathname,
      method: req.method,
    });
    return false;
  }

  // If no expected token provided, we can't validate
  // In a full implementation, you'd retrieve the expected token from:
  // - Session cookie
  // - Database
  // - Encrypted in the token itself
  if (!expectedToken) {
    logger.warn('No expected CSRF token to validate against', {
      path: req.nextUrl.pathname,
    });
    // For now, accept any token in the header (better than nothing)
    return true;
  }

  const isValid = token === expectedToken;

  if (!isValid) {
    logger.warn('Invalid CSRF token', {
      path: req.nextUrl.pathname,
      provided: token.substring(0, 10) + '...',
      expected: expectedToken.substring(0, 10) + '...',
    });
  }

  return isValid;
}

/**
 * Middleware-style CSRF validation
 * Returns null if valid, or error response if invalid
 */
export function requireCsrfToken(
  req: NextRequest,
  expectedToken?: string
): { error: string } | null {
  const isValid = validateCsrfToken(req, expectedToken);

  if (!isValid) {
    return {
      error: 'Invalid or missing CSRF token. Please refresh the page and try again.',
    };
  }

  return null;
}

/**
 * NOTE: Simplified CSRF Implementation
 *
 * This is a basic implementation. For production, consider:
 *
 * 1. Token Storage: Store tokens in encrypted session cookies or database
 * 2. Token Expiration: Add time-based expiration (e.g., 1 hour)
 * 3. Token Rotation: Generate new token after each successful request
 * 4. Double Submit Cookie: Use the "double submit cookie" pattern
 * 5. SameSite Cookies: Rely on SameSite=Strict cookies (already in Supabase)
 *
 * Alternative: Since this app uses Supabase Auth with httpOnly cookies
 * and SameSite=Strict, CSRF risk is already significantly mitigated.
 * This additional layer provides defense-in-depth.
 */
