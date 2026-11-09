import { NextResponse } from "next/server";
import { authClient, safeReturn } from "../../lib/googleAuth";
import { claimExistingClinic } from "../../lib/claimExistingClinic";
export async function GET(request:Request){
  const url=new URL(request.url);const origin=process.env.NUTRIDEX_SITE_ORIGIN??url.origin;const code=url.searchParams.get("code");
  if(code){const client=await authClient();const {error}=await client.auth.exchangeCodeForSession(code);if(!error){const {data:{user}}=await client.auth.getUser();if(user?.identities?.some(identity=>identity.provider==="google")){try{await claimExistingClinic(user);}catch{return NextResponse.redirect(new URL("/login?error=migration",origin));}const response=NextResponse.redirect(new URL(safeReturn(url.searchParams.get("next")),origin));response.headers.set("Cache-Control","private, no-store");return response;}}}
  return NextResponse.redirect(new URL("/login?error=session",origin));
}
