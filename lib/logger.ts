/**
 * Production-safe logging utility
 * Logs detailed errors server-side, prevents sensitive data leakage
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log info messages (development only, or critical production events)
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, context ? context : '');
    }
    // In production, you can integrate with logging services like:
    // - Vercel Analytics
    // - Sentry
    // - LogRocket
    // - Datadog
  }

  /**
   * Log warnings (always logged)
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context ? context : '');
    // Send to monitoring service in production
  }

  /**
   * Log errors (always logged with full details server-side)
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    const errorDetails = error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;

    console.error(`[ERROR] ${message}`, {
      error: errorDetails,
      ...context,
      timestamp: new Date().toISOString(),
    });

    // In production, send to error tracking service
    // Example: Sentry.captureException(error)
  }

  /**
   * Safely log without exposing sensitive data
   * Filters out: passwords, tokens, keys, secrets
   */
  safelog(level: LogLevel, message: string, data?: unknown): void {
    if (!data) {
      this[level](message);
      return;
    }

    const safeData = this.sanitizeData(data);
    this[level](message, safeData as LogContext);
  }

  /**
   * Remove sensitive fields from log data
   */
  private sanitizeData(data: unknown): unknown {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'auth',
      'apiKey',
      'api_key',
      'stripe_key',
      'supabase_key',
    ];

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some((sensitive) =>
        lowerKey.includes(sensitive)
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

export const logger = new Logger();
