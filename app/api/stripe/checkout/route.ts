import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { planType } = await req.json();

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
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

    // Get user's profile and clinic
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, clinic:clinics(*)')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || !profile.clinic) {
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
      return NextResponse.json(
        { error: 'Price ID not configured' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      locale: 'pt', // Portuguese localization (Stripe uses 'pt' for Portuguese)
      tax_id_collection: {
        enabled: true, // Enable business purchase with VAT/NIF collection
      },
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
