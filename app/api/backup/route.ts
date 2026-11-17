import { getGoogleSession } from '../../lib/googleAuth';
import { queryRows, jsonError, writeAudit } from '../../lib/supabaseServer';
import { signedPhotoUrl } from '../../lib/supabaseStorage';

export const dynamic = 'force-dynamic';
const tables = ['patients', 'appointments', 'foods', 'clinical_notes', 'exams', 'photos', 'payments', 'anthropometry_records', 'body_measures', 'meal_plans', 'meal_plan_items', 'anamneses', 'clinic_settings'] as const;

export async function GET() {
  try {
    const { user } = await getGoogleSession();
    const data: Record<string, Record<string, unknown>[]> = {};
    for (const table of tables) {
      const rows: Record<string, unknown>[] = [];
      // Explicit ownership also excludes shared food records from the personal backup.
      for (let offset = 0; ; offset += 500) {
        const result = await queryRows<Record<string, unknown>>(`${table}?select=*&owner_id=eq.${encodeURIComponent(user.id)}&order=id.asc&limit=500&offset=${offset}`);
        if (!result.ok) throw new Error('Não foi possível ler todos os dados. Tente gerar o backup novamente.');
        rows.push(...result.data);
        if (result.data.length < 500) break;
      }
      data[table] = rows;
    }
    const files: { path: string; url: string }[] = [];
    for (const photo of data.photos) {
      if (!photo.file_url) continue;
      const url = await signedPhotoUrl(String(photo.file_url));
      if (!url) throw new Error('Uma fotografia não está disponível. Tente novamente antes de baixar o backup.');
      const name = String(photo.file_name || 'fotografia').replace(/[^a-zA-Z0-9._-]/g, '-');
      files.push({ path: `fotografias/${photo.id}-${name}`, url });
    }
    await writeAudit('export', 'clinic_backup', user.id);
    return Response.json({ format: 'nutridex-backup', version: 1, exported_at: new Date().toISOString(), account: user.email, data, files }, {
      headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch (error) { return jsonError(error); }
}
