import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';

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
    logger.error('Webhook signature verification failed', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription' && session.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as Stripe.Subscription;

          const clinicId = session.metadata?.clinic_id;
          const planType = session.metadata?.plan_type;

          if (!clinicId || !planType) {
            logger.error('Missing metadata in checkout session', null, { sessionId: session.id, metadata: session.metadata });
            throw new Error('Missing metadata in checkout session');
          }

          // Extract subscription data (using explicit any for Stripe API access)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sub = stripeSubscription as any;

          const customerId = typeof sub.customer === 'string'
            ? sub.customer
            : sub.customer?.id;
          const subscriptionId = sub.id;
          const subscriptionStatus = sub.status;
          const cancelAtPeriodEnd = sub.cancel_at_period_end;

          // In API v2025-07-30, period dates moved to subscription item level
          const currentPeriodStart = sub.items?.data?.[0]?.current_period_start;
          const currentPeriodEnd = sub.items?.data?.[0]?.current_period_end;
          const priceId = sub.items?.data?.[0]?.price?.id;

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
            logger.info('Subscription already exists, skipping creation', { subscriptionId });
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
            logger.error('Failed to create subscription', error, { clinicId, subscriptionId });
            
            throw new Error(`Failed to create subscription: ${error.message}`);
          }

          logger.info('Subscription created successfully', { subscriptionId: newSubscription.id, clinicId, planType });

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
            logger.info('Subscription history logged', { subscriptionId: newSubscription.id });
          } catch (historyError) {
            logger.error('Failed to log subscription history', historyError);
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
          logger.warn('Missing clinic_id in subscription metadata', { subscriptionId: sub.id });
          break;
        }

        // Get existing subscription
        const { data: existingSubscription } = await supabaseAdmin
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', sub.id)
          .single();

        // Update subscription (using item-level period dates for API v2025-07-30)
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: sub.status,
            current_period_start: new Date(sub.items?.data?.[0]?.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.items?.data?.[0]?.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            canceled_at: sub.canceled_at
              ? new Date(sub.canceled_at * 1000).toISOString()
              : null,
          })
          .eq('stripe_subscription_id', sub.id);

        if (error) {
          logger.error('Failed to update subscription', error, { subscriptionId: sub.id, clinicId });
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
          logger.warn('Missing clinic_id in subscription metadata', { subscriptionId: sub.id });
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
          logger.error('Failed to cancel subscription', error, { subscriptionId: sub.id, clinicId });
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
            logger.warn('Missing clinic_id in subscription metadata', { subscriptionId: sub.id });
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
            logger.error('Failed to update subscription to past_due', error, { subscriptionId: sub.id, clinicId });
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
        logger.info('Unhandled webhook event type', { eventType: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error', error, { eventType: event.type, eventId: event.id });
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
