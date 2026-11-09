import Stripe from 'stripe';
import { processBillingEvent, stripeClient } from '../../../lib/billingServer';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: 'Serviço indisponível.' }, { status: 503 });
  if (Number(request.headers.get('content-length') ?? 0) > 1048576) return new Response(null, { status: 413 });
  const raw = await request.text();
  if (raw.length > 1048576) return new Response(null, { status: 413 });
  let event: Stripe.Event;
  const stripe = stripeClient();
  try { event = await stripe.webhooks.constructEventAsync(raw, request.headers.get('stripe-signature') ?? '', secret, 300, Stripe.createSubtleCryptoProvider()); }
  catch { return Response.json({ error: 'Assinatura inválida.' }, { status: 400 }); }
  try {
    await processBillingEvent(event, stripe);
    return Response.json({ received: true });
  } catch {
    console.error(JSON.stringify({ scope: 'billing_webhook', event_id: event.id, type: event.type, result: 'retry_required' }));
    return Response.json({ error: 'Não foi possível processar. Tente novamente.' }, { status: 500 });
  }
}
