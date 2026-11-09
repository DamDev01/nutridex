import { getGoogleSession } from './googleAuth';
export type BillingAccess = { active: boolean; status: string; paid_until: string | null; blocked: boolean; trial_until?:string|null };
export async function getBillingAccess(): Promise<BillingAccess> {
  const { client } = await getGoogleSession();
  const { data, error } = await client.rpc('nutridex_billing_status');
  if (error) throw new Error('Não foi possível verificar sua assinatura. Tente novamente em instantes.');
  return data as BillingAccess;
}
