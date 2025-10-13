import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { CheckoutSchema, validateInput } from '@/lib/validations/api-schemas';
import { logger } from '@/lib/logger';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(req, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = validateInput(CheckoutSchema, body);

    if (!validation.success) {
      logger.warn('Checkout validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { planType } = validation.data;

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized checkout attempt', { error: authError?.message });
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's profile and clinic
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, clinic:clinics(*)')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || !profile.clinic) {
      logger.warn('Profile or clinic not found for checkout', {
        userId: user.id,
        error: profileError?.message
      });
      return NextResponse.json(
        { error: 'Profile or clinic not found' },
        { status: 404 }
      );
    }

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('clinic_id', profile.clinic_id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      logger.info('Checkout blocked - active subscription exists', {
        clinicId: profile.clinic_id,
      });
      return NextResponse.json(
        { error: 'Active subscription already exists' },
        { status: 400 }
      );
    }

    // Get price ID from environment
    const priceId = planType === 'monthly'
      ? process.env.STRIPE_PRICE_ID_MONTHLY
      : process.env.STRIPE_PRICE_ID_ANNUAL;

    if (!priceId) {
      logger.error('Price ID not configured', null, { planType });
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/dashboard/account?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${req.nextUrl.origin}/?canceled=true`,
      customer_email: user.email,
      metadata: {
        clinic_id: profile.clinic_id,
        user_id: user.id,
        plan_type: planType,
      },
      subscription_data: {
        metadata: {
          clinic_id: profile.clinic_id,
          plan_type: planType,
        },
      },
    });

    logger.info('Checkout session created', {
      clinicId: profile.clinic_id,
      planType,
      sessionId: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error('Checkout error', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
