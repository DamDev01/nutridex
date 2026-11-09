const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const Stripe = require('stripe');
const price = 'price_1UVtl8JOwJCuf4fYUtOtq2gG';
const product = 'prod_VWxgITWL5oV1CQ';
function subject({emptyWrite=false}={}) {
  const calls = [];
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('app/lib/billingServer.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const config = { NUTRIDEX_PRICE_ID:price,NUTRIDEX_PRODUCT_ID:product,STRIPE_API_VERSION:'2026-09-30.endive',BILLING_EVENTS:['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed','charge.refunded','charge.dispute.created','radar.early_fraud_warning.created'] };
  vm.runInNewContext(code,{exports:module.exports,module,require:id=>id==='stripe'?Stripe:id==='./billingConfig'?config:{authConfig:()=>({url:'https://database.invalid'}),AuthError:Error},process:{env:{SUPABASE_SECRET_KEY:'local-fixture-only'}},AbortSignal,Date,fetch:async(url,options)=>{calls.push({url,body:options?.body?JSON.parse(options.body):undefined});return {ok:true,status:emptyWrite?201:200,text:async()=>emptyWrite?'':'[]'};} });
  return {api:module.exports,calls};
}
function fixture({status='active',paid=true,amount=9790,invoicePrice=price,itemPrice=price,end=2000000000}={}) {
 return {subscriptions:{retrieve:async()=>({id:'sub_fixture',status,customer:'cus_fixture',cancel_at_period_end:false,items:{data:[{price:{id:itemPrice,product},current_period_end:end}]},latest_invoice:{id:'in_fixture',status:paid?'paid':'open',amount_paid:amount,currency:'brl'}})},invoices:{listLineItems:async()=>({data:[{pricing:{price_details:{price:invoicePrice}},amount:9790,period:{end}}]})},charges:{retrieve:async()=>({customer:'cus_fixture'})}};
}
test('only a paid invoice for the NutriDex price grants a bounded paid period',async()=>{
 const {api,calls}=subject();await api.syncSubscription('sub_fixture',fixture());assert.equal(calls[0].body.p_status,'active');assert.equal(calls[0].body.p_paid_until,new Date(2000000000000).toISOString());
});
test('successful database writes with an empty 201 body do not fail checkout',async()=>{const {api}=subject({emptyWrite:true});assert.equal(await api.billingAdmin('billing_accounts',{method:'POST'}),null);});
for(const [title,options] of [['unpaid',{paid:false}],['insufficient payment',{amount:0}],['invoice for another product',{invoicePrice:'price_other'}]])test(title+' never grants access',async()=>{
 const {api,calls}=subject();await api.syncSubscription('sub_fixture',fixture(options));assert.equal(calls[0].body.p_paid_until,null);
});
test('unrelated subscription cannot grant NutriDex access',async()=>{const {api,calls}=subject();await api.syncSubscription('sub_fixture',fixture({itemPrice:'price_other'}));assert.equal(calls.filter(c=>c.body).length,0);});
test('cancellation is persisted with its current Stripe status',async()=>{const {api,calls}=subject();await api.syncSubscription('sub_fixture',fixture({status:'canceled'}));assert.equal(calls[0].body.p_status,'canceled');});
test('duplicate and delayed invoice events always re-read current Stripe state',async()=>{
 const {api,calls}=subject();const event={id:'evt_fixture',livemode:true,type:'invoice.paid',data:{object:{parent:{subscription_details:{subscription:'sub_fixture'}}}}};
 await api.processBillingEvent(event,fixture({status:'canceled'}));await api.processBillingEvent(event,fixture({status:'canceled'}));assert.equal(calls.length,2);assert.ok(calls.every(c=>c.body.p_status==='canceled'));assert.equal(calls[0].body.p_paid_until,calls[1].body.p_paid_until);
});
test('test-mode events cannot unlock production',async()=>{const {api,calls}=subject();await api.processBillingEvent({livemode:false,type:'invoice.paid',data:{object:{}}},fixture());assert.equal(calls.length,0);});
test('refund, dispute and fraud warning hold the mapped billing customer',async()=>{
 for(const type of ['charge.refunded','charge.dispute.created','radar.early_fraud_warning.created']){const {api,calls}=subject();await api.processBillingEvent({id:'evt_risk',livemode:true,type,data:{object:{id:'ch_fixture',charge:'ch_fixture'}}},fixture());assert.ok(calls[0].url.endsWith('/rpc/nutridex_hold_billing'));assert.equal(calls[0].body.p_customer,'cus_fixture');}
});
test('webhook signatures reject forged, modified and replayed requests',async()=>{
 const stripe=new Stripe('local-fixture-only');const secret='whsec_local_fixture_only';const raw=JSON.stringify({id:'evt_fixture',object:'event'});const header=stripe.webhooks.generateTestHeaderString({payload:raw,secret});
 const provider=Stripe.createSubtleCryptoProvider();assert.equal((await stripe.webhooks.constructEventAsync(raw,header,secret,300,provider)).id,'evt_fixture');
 await assert.rejects(stripe.webhooks.constructEventAsync(raw+' ',header,secret,300,provider));await assert.rejects(stripe.webhooks.constructEventAsync(raw,header,'whsec_wrong',300,provider));
 const old=stripe.webhooks.generateTestHeaderString({payload:raw,secret,timestamp:1});await assert.rejects(stripe.webhooks.constructEventAsync(raw,old,secret,300,provider));
});
function middleware({signedIn=true,active=false,error=null}={}) {
 const module={exports:{}};
 const response=(status=200,body=null,location=null)=>({status,body,location,cookies:{getAll:()=>[],set(){}},headers:new Headers()});
 const NextResponse={next:()=>response(),json:(body,{status})=>response(status,body),redirect:url=>response(307,null,String(url))};
 const client={auth:{getUser:async()=>({data:{user:signedIn?{identities:[{provider:'google'}]}:null}})},rpc:async()=>({data:{active},error})};
 const code=ts.transpileModule(fs.readFileSync('middleware.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:id=>id==='next/server'?{NextResponse}:{createServerClient:()=>client},process:{env:{NEXT_PUBLIC_SUPABASE_URL:'https://database.invalid',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'fixture'}},URL});
 return async(path,method='GET',origin='https://nutridex.invalid')=>{const url=new URL(path,'https://nutridex.invalid');return module.exports.middleware({nextUrl:url,url:String(url),method,headers:new Headers(origin?{origin}:{}),cookies:{getAll:()=>[],set(){}}});};
}
test('Google sign-in without payment cannot open protected pages or APIs',async()=>{
 const gate=middleware();assert.equal((await gate('/api/patients')).status,402);assert.equal((await gate('/painel?retorno=1')).location,'https://nutridex.invalid/assinatura');
});
test('public sales page stays public, while missing login and billing errors fail closed',async()=>{
 assert.equal((await middleware({signedIn:false})('/')).status,200);
 assert.equal((await middleware({signedIn:false})('/api/patients')).status,401);
 assert.equal((await middleware({error:{message:'offline'}})('/api/patients')).status,503);
 assert.equal((await middleware({active:true})('/painel')).status,200);
});
test('only the exact signed-webhook endpoint is exempt from the browser origin check',async()=>{
 const gate=middleware();assert.equal((await gate('/api/billing/webhook','POST',null)).status,200);
 assert.equal((await gate('/api/billing/webhook/other','POST',null)).status,403);
 assert.equal((await gate('/api/billing/checkout','POST','https://attacker.invalid')).status,403);
});
