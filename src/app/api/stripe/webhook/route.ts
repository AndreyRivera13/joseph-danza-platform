import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new NextResponse('Missing signature', { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const status = sub.status;
    const priceId = (sub.items.data[0]?.price?.id) ?? null;
    const currentPeriodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

    const existing = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } });
    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          stripeSubscriptionId: sub.id,
          status,
          priceId: priceId ?? undefined,
          currentPeriodEnd: currentPeriodEnd ?? undefined
        }
      });
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const existing = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } });
    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: { status: 'canceled' }
      });
    }
  }

  return NextResponse.json({ received: true });
}