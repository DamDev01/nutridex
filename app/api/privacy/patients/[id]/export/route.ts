import { jsonError, queryRows } from '../../../../../lib/supabaseServer';
import { getPatientDetail } from '../../../../../lib/dataServer';

type Props = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const detail = await getPatientDetail(id);
    if (!detail) return Response.json({ ok: false, error: 'Paciente não encontrado.' }, { status: 404 });
    const anamneses = await queryRows(`anamneses?select=*&patient_id=eq.${encodeURIComponent(id)}&order=created_at.desc`);
    return Response.json({ ok: true, exported_at: new Date().toISOString(), data: { ...detail, anamneses: anamneses.data } }, {
      headers: { 'Content-Disposition': `attachment; filename="nutridex-${id}.json"` },
    });
  } catch (error) { return jsonError(error); }
}
