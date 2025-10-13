/**
 * Zod validation schemas for API routes
 * Provides type-safe input validation
 */

import { z } from 'zod';

/**
 * Stripe Checkout API validation
 */
export const CheckoutSchema = z.object({
  planType: z.enum(['monthly', 'annual'], {
    message: 'Plan type must be either monthly or annual',
  }),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

/**
 * Onboarding API validation
 */
export const OnboardingSchema = z.object({
  userId: z.string().uuid({
    message: 'Invalid user ID format',
  }),
  email: z.string().email({
    message: 'Invalid email address',
  }),
  clinicName: z
    .string()
    .min(2, { message: 'Clinic name must be at least 2 characters' })
    .max(100, { message: 'Clinic name must be less than 100 characters' })
    .trim(),
  ownerName: z
    .string()
    .min(2, { message: 'Owner name must be at least 2 characters' })
    .max(100, { message: 'Owner name must be less than 100 characters' })
    .trim()
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, {
      message: 'Invalid phone number format',
    })
    .optional()
    .nullable(),
  dpaConsent: z.boolean().refine((val) => val === true, {
    message: 'DPA consent is required',
  }),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;

/**
 * Resend Confirmation Email API validation
 */
export const ResendEmailSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address',
  }),
});

export type ResendEmailInput = z.infer<typeof ResendEmailSchema>;

/**
 * Generic validation helper
 * Returns { success: true, data } or { success: false, error }
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Combine all validation errors into a single message
      const errorMessages = error.issues.map((err) => err.message).join(', ');
      return { success: false, error: errorMessages };
    }
    return { success: false, error: 'Invalid input' };
  }
}
