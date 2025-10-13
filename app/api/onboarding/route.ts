import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { userId, email, clinicName, ownerName, dpaConsent } = await req.json();

    // Validate required fields
    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    if (!clinicName || clinicName.trim() === '') {
      return NextResponse.json(
        { error: 'Clinic name is required' },
        { status: 400 }
      );
    }

    if (!dpaConsent) {
      return NextResponse.json(
        { error: 'DPA consent is required' },
        { status: 400 }
      );
    }

    // Check if user already has a profile/clinic
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, clinic_id')
      .eq('user_id', userId)
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
        user_id: userId,
        clinic_id: clinic.id,
        role: 'admin', // First user is always admin
        name: ownerName?.trim() || email?.split('@')[0] || 'Admin',
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
