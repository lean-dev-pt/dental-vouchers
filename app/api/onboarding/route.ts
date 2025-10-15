import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

// Zod validation schema for onboarding data
const OnboardingSchema = z.object({
  clinicName: z.string()
    .min(3, 'Clinic name must be at least 3 characters')
    .max(100, 'Clinic name cannot exceed 100 characters')
    .trim(),
  ownerName: z.string()
    .min(2, 'Owner name must be at least 2 characters')
    .max(100, 'Owner name cannot exceed 100 characters')
    .trim()
    .optional()
    .nullable(),
  phone: z.string()
    .regex(/^[0-9\s\+\-\(\)]+$/, 'Invalid phone number format')
    .max(20, 'Phone number cannot exceed 20 characters')
    .trim()
    .optional()
    .nullable(),
  dpaConsent: z.boolean()
    .refine(val => val === true, {
      message: 'DPA consent is required'
    })
});

// Create admin Supabase client with service role key (bypasses RLS and auth checks)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(req: NextRequest) {
  try {
    // SECURITY: Get authenticated user from session (cannot be faked by client)
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Rate limit: 3 onboarding attempts per user per hour (prevents spam/abuse)
    const userRateLimit = rateLimit(`onboarding-user:${user.id}`, {
      interval: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
    });

    if (!userRateLimit.success) {
      return NextResponse.json(
        { error: 'Demasiadas tentativas. Por favor tente novamente mais tarde.' },
        { status: 429 }
      );
    }

    // Rate limit by IP: 5 attempts per hour
    const ip = getClientIp(req);
    const ipRateLimit = rateLimit(`onboarding-ip:${ip}`, {
      interval: 60 * 60 * 1000, // 1 hour
      maxRequests: 5,
    });

    if (!ipRateLimit.success) {
      return NextResponse.json(
        { error: 'Demasiadas tentativas deste dispositivo.' },
        { status: 429 }
      );
    }

    // Get request body
    const body = await req.json();

    // Validate input data with Zod
    const validationResult = OnboardingSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { clinicName, ownerName, dpaConsent } = validationResult.data;

    // Check if user already has a profile/clinic
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, clinic_id')
      .eq('user_id', user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      );
    }

    // Create clinic with DPA consent
    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .insert({
        name: clinicName.trim(),
        data_processing_consent: dpaConsent,
        data_processing_consent_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (clinicError || !clinic) {
      return NextResponse.json(
        { error: 'Failed to create clinic' },
        { status: 500 }
      );
    }

    // Create profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: user.id,
        clinic_id: clinic.id,
        role: 'admin', // First user is always admin
        name: ownerName?.trim() || user.email?.split('@')[0] || 'Admin',
      })
      .select()
      .single();

    if (profileError || !profile) {
      // Rollback: delete clinic if profile creation fails
      await supabaseAdmin.from('clinics').delete().eq('id', clinic.id);
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      clinic: {
        id: clinic.id,
        name: clinic.name,
      },
      profile: {
        id: profile.id,
        name: profile.name,
        role: profile.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
