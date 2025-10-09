import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { clinicName, ownerName } = await req.json();

    // Validate required fields
    if (!clinicName || clinicName.trim() === '') {
      return NextResponse.json(
        { error: 'Clinic name is required' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user already has a profile/clinic
    const { data: existingProfile } = await supabase
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

    // Create clinic
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .insert({
        name: clinicName.trim(),
      })
      .select()
      .single();

    if (clinicError || !clinic) {
      console.error('Error creating clinic:', clinicError);
      return NextResponse.json(
        { error: 'Failed to create clinic' },
        { status: 500 }
      );
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
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
      console.error('Error creating profile:', profileError);
      // Rollback: delete clinic if profile creation fails
      await supabase.from('clinics').delete().eq('id', clinic.id);
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
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
