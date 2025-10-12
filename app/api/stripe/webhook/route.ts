import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Create admin Supabase client for webhook operations (bypasses RLS)
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

async function logSubscriptionHistory(
  subscriptionId: string,
  clinicId: string,
  previousStatus: string | null,
  newStatus: string,
  previousPlanType: string | null,
  newPlanType: string | null,
  reason: string,
  stripeEventId: string
) {
  await supabaseAdmin.from('subscription_history').insert({
    subscription_id: subscriptionId,
    clinic_id: clinicId,
    previous_status: previousStatus,
    new_status: newStatus,
    previous_plan_type: previousPlanType,
    new_plan_type: newPlanType,
    changed_reason: reason,
    stripe_event_id: stripeEventId,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing checkout.session.completed:', session.id);

        if (session.mode === 'subscription' && session.subscription) {
          console.log('Retrieving subscription:', session.subscription);

          const stripeSubscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as Stripe.Subscription;

          const clinicId = session.metadata?.clinic_id;
          const planType = session.metadata?.plan_type;

          console.log('Metadata:', { clinicId, planType });

          if (!clinicId || !planType) {
            const error = 'Missing metadata in checkout session';
            console.error(error);
            throw new Error(error);
          }

          // Extract subscription data safely (using explicit any for Stripe API access)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sub = stripeSubscription as any;

          // Debug: Log all subscription properties
          console.log('Full subscription object keys:', Object.keys(sub));
          console.log('Subscription properties:', {
            current_period_start: sub.current_period_start,
            current_period_end: sub.current_period_end,
            currentPeriodStart: sub.currentPeriodStart,
            currentPeriodEnd: sub.currentPeriodEnd,
            billing_cycle_anchor: sub.billing_cycle_anchor,
            start_date: sub.start_date,
          });

          const customerId = typeof sub.customer === 'string'
            ? sub.customer
            : sub.customer?.id;
          const subscriptionId = sub.id;
          const subscriptionStatus = sub.status;
          const cancelAtPeriodEnd = sub.cancel_at_period_end || sub.cancelAtPeriodEnd;

          // Try different possible property names for period dates
          const currentPeriodStart = sub.current_period_start || sub.currentPeriodStart || sub.start_date || sub.billing_cycle_anchor;
          const currentPeriodEnd = sub.current_period_end || sub.currentPeriodEnd;
          const priceId = sub.items?.data?.[0]?.price?.id;

          console.log('Extracted subscription data:', {
            clinicId,
            subscriptionId,
            customerId,
            currentPeriodStart,
            currentPeriodEnd,
            priceId
          });

          // Validate required fields
          if (!currentPeriodStart || !currentPeriodEnd) {
            throw new Error(`Missing period dates: start=${currentPeriodStart}, end=${currentPeriodEnd}`);
          }

          // Check if subscription already exists
          const { data: existingSub } = await supabaseAdmin
            .from('subscriptions')
            .select('id')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          if (existingSub) {
            console.log('Subscription already exists, skipping creation:', subscriptionId);
            break;
          }

          // Create subscription record
          const { data: newSubscription, error } = await supabaseAdmin
            .from('subscriptions')
            .insert({
              clinic_id: clinicId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan_type: planType,
              stripe_price_id: priceId || null,
              status: subscriptionStatus,
              current_period_start: new Date(currentPeriodStart * 1000).toISOString(),
              current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
              cancel_at_period_end: cancelAtPeriodEnd,
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating subscription:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            throw new Error(`Failed to create subscription: ${error.message}`);
          }

          console.log('Subscription created successfully:', newSubscription.id);

          // Log to history
          try {
            await logSubscriptionHistory(
              newSubscription.id,
              clinicId,
              null,
              stripeSubscription.status,
              null,
              planType,
              'checkout_completed',
              event.id
            );
            console.log('Subscription history logged');
          } catch (historyError) {
            console.error('Failed to log subscription history:', historyError);
            // Don't throw - subscription was created successfully
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = stripeSubscription as any;
        const clinicId = sub.metadata?.clinic_id;

        if (!clinicId) {
          console.error('Missing clinic_id in subscription metadata');
          break;
        }

        // Get existing subscription
        const { data: existingSubscription } = await supabaseAdmin
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', sub.id)
          .single();

        // Update subscription
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: sub.status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            canceled_at: sub.canceled_at
              ? new Date(sub.canceled_at * 1000).toISOString()
              : null,
          })
          .eq('stripe_subscription_id', sub.id);

        if (error) {
          console.error('Error updating subscription:', error);
          break;
        }

        // Log to history if status changed
        if (existingSubscription && existingSubscription.status !== sub.status) {
          await logSubscriptionHistory(
            existingSubscription.id,
            clinicId,
            existingSubscription.status,
            sub.status,
            existingSubscription.plan_type,
            existingSubscription.plan_type,
            'subscription_updated',
            event.id
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = stripeSubscription as any;
        const clinicId = sub.metadata?.clinic_id;

        if (!clinicId) {
          console.error('Missing clinic_id in subscription metadata');
          break;
        }

        // Get existing subscription
        const { data: existingSubscription } = await supabaseAdmin
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', sub.id)
          .single();

        // Update subscription to canceled
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', sub.id);

        if (error) {
          console.error('Error canceling subscription:', error);
          break;
        }

        // Log to history
        if (existingSubscription) {
          await logSubscriptionHistory(
            existingSubscription.id,
            clinicId,
            existingSubscription.status,
            'canceled',
            existingSubscription.plan_type,
            existingSubscription.plan_type,
            'subscription_deleted',
            event.id
          );
        }
        break;
      }

      case 'invoice.payment_failed': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;

        if (invoice.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          ) as Stripe.Subscription;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sub = stripeSubscription as any;

          const clinicId = sub.metadata?.clinic_id;

          if (!clinicId) {
            console.error('Missing clinic_id in subscription metadata');
            break;
          }

          // Get existing subscription
          const { data: existingSubscription } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', sub.id)
            .single();

          // Update to past_due
          const { error } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'past_due',
            })
            .eq('stripe_subscription_id', sub.id);

          if (error) {
            console.error('Error updating subscription to past_due:', error);
            break;
          }

          // Log to history
          if (existingSubscription) {
            await logSubscriptionHistory(
              existingSubscription.id,
              clinicId,
              existingSubscription.status,
              'past_due',
              existingSubscription.plan_type,
              existingSubscription.plan_type,
              'payment_failed',
              event.id
            );
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
