import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  let customerId: string | null = null;
  const existingSub = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (existingSub?.stripeCustomerId) {
    customerId = existingSub.stripeCustomerId;
  } else {
    const customer = await stripe.customers.create({ email: user.email ?? undefined, name: user.name ?? undefined });
    customerId = customer.id;
    if (!existingSub) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          status: 'incomplete',
          stripeCustomerId: customerId,
          stripeSubscriptionId: 'pending'
        }
      });
    } else {
      await prisma.subscription.update({
        where: { userId: user.id },
        data: { stripeCustomerId: customerId }
      });
    }
  }

  const priceId = process.env.STRIPE_PRICE_ID!;
  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId!,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=1`,
    metadata: { userId: user.id }
  });

  return NextResponse.json({ url: checkout.url });
}