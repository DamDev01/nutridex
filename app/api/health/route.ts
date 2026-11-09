export async function GET() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  return Response.json({ ok: configured, service: 'nutridex', application: configured ? 'up' : 'not_configured', database: 'not_checked', checked_at: new Date().toISOString() }, { status: configured ? 200 : 503, headers: { 'Cache-Control': 'no-store' } });
}
