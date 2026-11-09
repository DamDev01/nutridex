import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function middleware(request:NextRequest){
  const path=request.nextUrl.pathname;
  // Stripe authenticates this single endpoint with a signed raw request body.
  if(path==="/api/billing/webhook" && request.method==="POST")return NextResponse.next();
  if (["POST","PUT","PATCH","DELETE"].includes(request.method) && request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ok:false,error:"Origem de solicitação inválida."},{status:403});
  if(["/","/login","/privacidade","/termos","/suporte","/planos"].includes(path)||path.startsWith("/auth/")||(path==="/api/health" && request.method==="GET"))return NextResponse.next();
  let response=NextResponse.next({request});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return path.startsWith("/api/")?NextResponse.json({ok:false,error:"Login indisponível."},{status:503}):NextResponse.redirect(new URL("/login",request.url));
  const client=createServerClient(url,key,{cookieOptions:{httpOnly:true,path:"/",sameSite:"lax",secure:process.env.NODE_ENV==="production"},cookies:{getAll(){return request.cookies.getAll();},setAll(values){for(const {name,value}of values)request.cookies.set(name,value);response=NextResponse.next({request});for(const {name,value,options}of values)response.cookies.set(name,value,options);}}});
  const {data:{user}}=await client.auth.getUser();
  if(!user||!user.identities?.some(identity=>identity.provider==="google")){
    const denied=path.startsWith("/api/")?NextResponse.json({ok:false,error:"Entre com o Google para continuar."},{status:401}):NextResponse.redirect(new URL("/login?next="+encodeURIComponent(path+request.nextUrl.search),request.url));
    for(const c of response.cookies.getAll())denied.cookies.set(c);
    denied.headers.set("Cache-Control","private, no-store");return denied;
  }
  if(path!=="/admin" && !path.startsWith("/api/admin/") && path!=="/assinatura" && !path.startsWith("/api/billing/")){
    const {data,error}=await client.rpc('nutridex_billing_status');
    if(error||!data?.active){
      const denied=path.startsWith('/api/')?NextResponse.json({ok:false,error:error?'Não foi possível verificar a assinatura.':'Confirme o pagamento da assinatura para acessar.',code:error?'BILLING_UNAVAILABLE':'PAYMENT_REQUIRED'},{status:error?503:402}):NextResponse.redirect(new URL('/assinatura'+(error?'?error=retry':''),request.url));
      for(const c of response.cookies.getAll())denied.cookies.set(c);
      denied.headers.set('Cache-Control','private, no-store');return denied;
    }
  }
  response.headers.set("Cache-Control","private, no-store");return response;
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)"]};

