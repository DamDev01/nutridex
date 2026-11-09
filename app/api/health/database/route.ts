import { hasSupabaseConfig, listRows, jsonError } from '../../../lib/supabaseServer';

export async function GET() {
  if (!hasSupabaseConfig()) return Response.json({ ok: false, database: 'not_configured' }, { status: 503 });
  try {
    const result = await listRows('patients', 'id', 'created_at.desc&limit=1');
    return Response.json({ ok: result.ok, database: result.ok ? 'up' : 'down' }, { status: result.ok ? 200 : 503, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return jsonError(error); }
}
