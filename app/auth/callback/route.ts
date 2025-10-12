import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle error from Supabase (e.g., expired link)
  if (error) {
    console.error('Email confirmation error:', error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/sign-up?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // Code is required for email confirmation
  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/sign-up?error=missing_code`
    );
  }

  const supabase = await createClient();

  // Exchange code for session
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data.user) {
    console.error('Error exchanging code for session:', exchangeError);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/sign-up?error=confirmation_failed`
    );
  }

  // Get plan from user metadata (stored during signup)
  const plan = data.user.user_metadata?.plan || 'annual';

  // Redirect to onboarding page with plan
  return NextResponse.redirect(
    `${requestUrl.origin}/onboarding?plan=${plan}`
  );
}
