import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized portal access attempt', { error: authError?.message });
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's profile and clinic
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('clinic_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      logger.warn('Profile not found for portal access', {
        userId: user.id,
        error: profileError?.message
      });
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get subscription for this clinic
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('clinic_id', profile.clinic_id)
      .single();

    if (subscriptionError || !subscription) {
      logger.warn('No subscription found for portal access', {
        clinicId: profile.clinic_id,
        error: subscriptionError?.message
      });
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Create Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${req.nextUrl.origin}/dashboard/account`,
    });

    logger.info('Portal session created', {
      clinicId: profile.clinic_id,
      customerId: subscription.stripe_customer_id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error('Portal error', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
