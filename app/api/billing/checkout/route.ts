import { NextResponse } from 'next/server';
import { billingCustomer, stripeClient } from '../../../lib/billingServer';
import { billingReady, NUTRIDEX_PRICE_ID } from '../../../lib/billingConfig';
import { getGoogleSession } from '../../../lib/googleAuth';
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  try {
    const { client, user } = await getGoogleSession();
    const form = await request.formData();
    if (form.get('terms') !== 'on') return NextResponse.redirect(new URL('/assinatura?error=terms', origin), 303);
    if (!billingReady()) return NextResponse.redirect(new URL('/assinatura?error=unavailable', origin), 303);
    const { data, error } = await client.rpc('nutridex_begin_checkout');
    if (error) return NextResponse.redirect(new URL('/assinatura?error=retry', origin), 303);
    if (data.active) return NextResponse.redirect(new URL('/painel', origin), 303);
    if (data.blocked) return NextResponse.redirect(new URL('/assinatura?error=support', origin), 303);
    const customer = await billingCustomer();
    const stripe = stripeClient();
    // Resume a single checkout for this account, including concurrent clicks and retries.
    const session = await stripe.checkout.sessions.create({ customer, mode: 'subscription', line_items: [{ price: NUTRIDEX_PRICE_ID, quantity: 1 }], client_reference_id: user.id, success_url: `${origin}/assinatura?retorno=1`, cancel_url: `${origin}/assinatura`, integration_identifier: 'nutridex_web_mensal_hqzmxvla', locale: 'pt-BR' }, { idempotencyKey: `nutridex-checkout-${data.attempt}` });
    if (!session.url) throw new Error('Checkout indisponível');
    return NextResponse.redirect(session.url, 303);
  } catch { return NextResponse.redirect(new URL('/assinatura?error=unavailable', origin), 303); }
}
