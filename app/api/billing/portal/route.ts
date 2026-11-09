import { NextResponse } from 'next/server';
import { billingAdmin, stripeClient } from '../../../lib/billingServer';
import { getGoogleSession } from '../../../lib/googleAuth';
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  try {
    const { user } = await getGoogleSession();
    const rows = await billingAdmin<{stripe_customer_id:string}[]>(`billing_accounts?owner_id=eq.${user.id}&select=stripe_customer_id`);
    if (!rows[0]?.stripe_customer_id) return NextResponse.redirect(new URL('/assinatura', origin), 303);
    const configuration = process.env.STRIPE_PORTAL_CONFIGURATION;
    if (!configuration) return NextResponse.redirect(new URL('/assinatura?error=support', origin), 303);
    const session = await stripeClient().billingPortal.sessions.create({ customer: rows[0].stripe_customer_id, configuration, return_url: `${origin}/assinatura` });
    return NextResponse.redirect(session.url, 303);
  } catch { return NextResponse.redirect(new URL('/assinatura?error=support', origin), 303); }
}
