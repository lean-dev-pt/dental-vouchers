import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { OnboardingSchema, validateInput } from '@/lib/validations/api-schemas';
import { logger } from '@/lib/logger';

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
    // Parse and validate request body
    const body = await req.json();
    const validation = validateInput(OnboardingSchema, body);

    if (!validation.success) {
      logger.warn('Onboarding validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { userId, email, clinicName, ownerName, dpaConsent } = validation.data;

    // Check if user already has a profile/clinic
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, clinic_id')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      logger.info('Profile already exists for onboarding', { userId });
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      );
    }

    // Create clinic with DPA consent
    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .insert({
        name: clinicName,
        data_processing_consent: dpaConsent,
        data_processing_consent_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (clinicError || !clinic) {
      logger.error('Failed to create clinic', clinicError, {
        userId,
        clinicName
      });
      return NextResponse.json(
        { error: 'Failed to create clinic' },
        { status: 500 }
      );
    }

    // Create profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userId,
        clinic_id: clinic.id,
        role: 'admin', // First user is always admin
        name: ownerName || email?.split('@')[0] || 'Admin',
      })
      .select()
      .single();

    if (profileError || !profile) {
      logger.error('Failed to create profile', profileError, {
        userId,
        clinicId: clinic.id
      });
      // Rollback: delete clinic if profile creation fails
      await supabaseAdmin.from('clinics').delete().eq('id', clinic.id);
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }

    logger.info('Onboarding completed successfully', {
      userId,
      clinicId: clinic.id,
      profileId: profile.id
    });

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
  } catch (error) {
    logger.error('Onboarding error', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
