import { PublicDocument } from '../components/PublicDocument';
import { commercial } from '../lib/commercial';
import { getBillingAccess } from '../lib/billingAccess';
import { getGoogleSession } from '../lib/googleAuth';
import { billingReady } from '../lib/billingConfig';
export const dynamic='force-dynamic';
export default async function SubscriptionPage({searchParams}:{searchParams:Promise<{retorno?:string;error?:string}>}){
 const params=await searchParams;
 const {user}=await getGoogleSession();
 let access;try{access=await getBillingAccess();}catch{access=null;}
 const ready=billingReady();
 return <PublicDocument title={access?.active?(access.status==='admin'?'Sua conta administradora':access.status==='trial'?'Seu acesso de teste':'Sua assinatura está ativa'):'Seu consultório começa aqui.'}>
  {access?.status==='admin'?<p><a className="nx-button" href="/admin">Gerenciar usuários →</a></p>:null}
  <p>Conta conectada: <strong>{user.email}</strong>.</p><form action="/auth/logout" method="post"><button className="underline">Trocar conta</button></form>
  {access?.active?<><p>{access.status==='admin'?'Acesso administrativo liberado.':access.status==='trial'?`Teste liberado até ${new Date(access.trial_until!).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'})}.`:`Pagamento confirmado. Acesso até ${access.paid_until?new Date(access.paid_until).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'}):'o fim do período pago'}.`}</p><a className="nx-button" href="/painel">Acessar meu consultório →</a>{access.paid_until?<form action="/api/billing/portal" method="post"><button className="nx-button nx-button-secondary">Gerenciar assinatura e cancelamento</button></form>:null}</>:<>
   <p className="text-3xl font-bold">{commercial.monthlyPrice}<span className="text-base font-normal"> / mês</span></p>
   <p>Pagamento recorrente mensal pela Stripe. O acesso ao sistema é liberado somente após a confirmação do pagamento.</p>
   {params.retorno?<p role="status">Estamos aguardando a confirmação segura da Stripe. Se o pagamento já foi aprovado, use “Verificar pagamento”. Não é necessário pagar novamente.</p>:null}
   {!access||params.error==='retry'?<p role="alert">Não foi possível consultar a assinatura agora. Tente verificar novamente em instantes.</p>:null}
   {access?.blocked||params.error==='support'?<p role="alert">Sua assinatura precisa de uma revisão. Entre em contato com o suporte antes de realizar outro pagamento.</p>:null}
   {params.error==='terms'?<p role="alert">Leia e aceite as condições da assinatura para continuar.</p>:null}
   {!ready||params.error==='unavailable'?<p role="status">A contratação está temporariamente indisponível enquanto concluímos a conexão de pagamento. Nenhuma cobrança será iniciada por este site nesse período.</p>:null}
   {ready && access && !access.blocked && !params.retorno?<form action="/api/billing/checkout" method="post"><label className="flex items-start gap-3 my-5"><input type="checkbox" name="terms" required/><span>Li os <a href="/termos" target="_blank" rel="noreferrer">termos de uso</a> e a <a href="/privacidade" target="_blank" rel="noreferrer">política de privacidade</a>, e autorizo a assinatura de {commercial.monthlyPrice}/mês.</span></label><button className="nx-button">Assinar com pagamento seguro →</button></form>:null}
   <p><a className="nx-button nx-button-secondary" href="/assinatura?retorno=1">Verificar pagamento</a></p>
   {ready?<form action="/api/billing/portal" method="post"><button className="underline">Atualizar pagamento ou cancelar assinatura</button></form>:null}
  </>}
  <p>Precisa de ajuda? <a href={commercial.whatsapp}>Falar com o suporte pelo WhatsApp</a>.</p>
 </PublicDocument>;
}
