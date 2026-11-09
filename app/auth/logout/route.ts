import { NextResponse } from "next/server";
import { authClient } from "../../lib/googleAuth";
export async function POST(request:Request){const origin=process.env.NUTRIDEX_SITE_ORIGIN??new URL(request.url).origin;if(request.headers.get("origin")!==origin)return NextResponse.json({ok:false},{status:403});const client=await authClient();await client.auth.signOut();return NextResponse.redirect(new URL("/login",origin),303);}
