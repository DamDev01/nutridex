export const NUTRIDEX_PRICE_ID = 'price_1UVtl8JOwJCuf4fYUtOtq2gG';
export const NUTRIDEX_PRODUCT_ID = 'prod_VWxgITWL5oV1CQ';
export const STRIPE_API_VERSION = '2026-09-30.endive' as const;
export const BILLING_EVENTS = ['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted', 'invoice.paid', 'invoice.payment_failed', 'charge.refunded', 'charge.dispute.created', 'radar.early_fraud_warning.created'] as const;
export function billingReady() {
  return Boolean(process.env.STRIPE_RESTRICTED_KEY && process.env.STRIPE_WEBHOOK_SECRET && process.env.SUPABASE_SECRET_KEY);
}
