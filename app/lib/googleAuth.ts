import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
export class AuthError extends Error { status: number; constructor(message="Entre com o Google para continuar.",status=401){super(message);this.status=status;} }
export function authConfig(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!url||!key)throw new Error("Login indisponível. A configuração de acesso está incompleta.");return {url,key};}
export function safeReturn(value:string|null){return value&&value.startsWith("/")&&!value.startsWith("//")&&!value.includes("\\")?value:"/painel";}
export async function authClient(){const jar=await cookies();const {url,key}=authConfig();return createServerClient(url,key,{cookieOptions:{httpOnly:true,path:"/",sameSite:"lax",secure:process.env.NODE_ENV==="production"},cookies:{getAll(){return jar.getAll();},setAll(values){try{for(const {name,value,options} of values)jar.set(name,value,options);}catch{ /* A atualização de cookies em páginas é feita pelo middleware. */ }}}});}
export const getGoogleSession=cache(async()=>{const client=await authClient();const {data:{user},error}=await client.auth.getUser();if(error||!user||!user.identities?.some(identity=>identity.provider==="google"))throw new AuthError();const {data:{session}}=await client.auth.getSession();if(!session||session.user.id!==user.id)throw new AuthError();return {user,token:session.access_token,client};});
export async function dataHeaders(extra?:HeadersInit){const {token}=await getGoogleSession();const {key}=authConfig();const h=new Headers(extra);h.set("apikey",key);h.set("Authorization","Bearer "+token);if(!h.has("Content-Type"))h.set("Content-Type","application/json");return h;}
