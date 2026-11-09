import Stripe from 'stripe';
import { authConfig, AuthError, getGoogleSession } from './googleAuth';
import { BILLING_EVENTS, NUTRIDEX_PRICE_ID, NUTRIDEX_PRODUCT_ID, STRIPE_API_VERSION } from './billingConfig';

export function stripeClient() {
  const key = process.env.STRIPE_RESTRICTED_KEY;
  if (!key) throw new AuthError('A contratação está temporariamente indisponível. Fale com o suporte.', 503);
  return new Stripe(key, { apiVersion: STRIPE_API_VERSION, httpClient: Stripe.createFetchHttpClient(), maxNetworkRetries: 2, timeout: 15000 });
}
export async function billingAdmin<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const { url } = authConfig();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new AuthError('A contratação está temporariamente indisponível. Fale com o suporte.', 503);
  const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers: { apikey: key, 'Content-Type': 'application/json', ...init.headers }, cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Falha ao atualizar a assinatura.');
  const body = await response.text();
  return (body ? JSON.parse(body) : null) as T;
}
export async function billingCustomer() {
  const { user } = await getGoogleSession();
  const rows = await billingAdmin<{stripe_customer_id:string}[]>(`billing_accounts?owner_id=eq.${user.id}&select=stripe_customer_id`);
  if (rows[0]?.stripe_customer_id) return rows[0].stripe_customer_id as string;
  const customer = await stripeClient().customers.create({ email: user.email }, { idempotencyKey: `nutridex-customer-${user.id}` });
  await billingAdmin('billing_accounts?on_conflict=owner_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ owner_id: user.id, stripe_customer_id: customer.id }) });
  return customer.id;
}
export function resourceId(value: string | { id: string } | null | undefined) { return typeof value === 'string' ? value : value?.id; }

// Re-read Stripe's current snapshot: webhook delivery order never defines access.
export async function syncSubscription(id: string, stripe = stripeClient()) {
  const observedAt = new Date().toISOString();
  const subscription = await stripe.subscriptions.retrieve(id, { expand: ['latest_invoice'] });
  const item = subscription.items.data.find(item => item.price.id === NUTRIDEX_PRICE_ID && resourceId(item.price.product) === NUTRIDEX_PRODUCT_ID);
  if (!item) {
    const tracked = await billingAdmin<{stripe_subscription_id:string}[]>(`billing_subscriptions?stripe_subscription_id=eq.${encodeURIComponent(id)}&select=stripe_subscription_id`);
    if (!tracked.length) return;
  }
  const customer = resourceId(subscription.customer);
  if (!customer) throw new Error('Assinatura sem cliente.');
  const invoice = typeof subscription.latest_invoice === 'object' ? subscription.latest_invoice : null;
  let paidUntil: number | null = null;
  if (item && invoice && invoice.status === 'paid' && invoice.amount_paid >= 9790 && invoice.currency === 'brl') {
    // The paid invoice must contain the NutriDex price; unrelated payments never unlock it.
    const lines = await stripe.invoices.listLineItems(invoice.id, { limit: 100 });
    const paidLine = lines.data.find(line => line.pricing?.price_details?.price === NUTRIDEX_PRICE_ID && line.amount >= 9790);
    if (paidLine && item.current_period_end) paidUntil = Math.min(paidLine.period.end, item.current_period_end);
  }
  await billingAdmin('rpc/nutridex_sync_subscription', { method: 'POST', body: JSON.stringify({ p_customer: customer, p_subscription: id, p_status: subscription.status, p_paid_until: paidUntil ? new Date(paidUntil * 1000).toISOString() : null, p_cancel_at_period_end: subscription.cancel_at_period_end, p_observed_at: observedAt }) });
}
export async function processBillingEvent(event: Stripe.Event, stripe = stripeClient()) {
  if (!event.livemode || !(BILLING_EVENTS as readonly string[]).includes(event.type)) return;
  // Serialize processing per Stripe customer inside the database and rely on fresh Stripe reads.
  if (event.type.startsWith('customer.subscription.')) {
    await syncSubscription((event.data.object as Stripe.Subscription).id, stripe);
    return;
  }
  if (event.type.startsWith('checkout.session.')) {
    const session = event.data.object as Stripe.Checkout.Session;
    const id = resourceId(session.subscription);
    if (id) await syncSubscription(id, stripe);
    return;
  }
  if (event.type.startsWith('invoice.')) {
    const invoice = event.data.object as Stripe.Invoice;
    const id = resourceId(invoice.parent?.subscription_details?.subscription);
    if (id) await syncSubscription(id, stripe);
    return;
  }
  let chargeId: string | undefined;
  if (event.type === 'charge.refunded') chargeId = (event.data.object as Stripe.Charge).id;
  if (event.type === 'charge.dispute.created') chargeId = resourceId((event.data.object as Stripe.Dispute).charge);
  if (event.type === 'radar.early_fraud_warning.created') chargeId = resourceId((event.data.object as Stripe.Radar.EarlyFraudWarning).charge);
  if (chargeId) {
    const charge = await stripe.charges.retrieve(chargeId);
    const customer = resourceId(charge.customer);
    if (customer) {
      // Only accounts created by NutriDex are affected. Hold is sticky until support reviews it.
      await billingAdmin('rpc/nutridex_hold_billing', { method: 'POST', body: JSON.stringify({ p_customer: customer, p_event: event.id, p_reason: event.type }) });
    }
  }
}
