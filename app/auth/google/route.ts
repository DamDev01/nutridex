import { NextResponse } from "next/server";
import { authClient, safeReturn } from "../../lib/googleAuth";
export async function GET(request:Request){
  const requestUrl=new URL(request.url);const origin=process.env.NUTRIDEX_SITE_ORIGIN??requestUrl.origin;
  const client=await authClient();const target=new URL("/auth/google-callback",origin);target.searchParams.set("next",safeReturn(requestUrl.searchParams.get("next")));
  const {data,error}=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo:target.toString(),skipBrowserRedirect:true,queryParams:{prompt:"select_account"}}});
  if(error||!data.url)return NextResponse.redirect(new URL("/login?error=google",origin));
  const response=NextResponse.redirect(data.url);response.headers.set("Cache-Control","private, no-store");return response;
}
