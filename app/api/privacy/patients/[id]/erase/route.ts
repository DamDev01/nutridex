import { deleteRow, deleteRowsWhere, jsonError, queryRows, writeAudit } from '../../../../../lib/supabaseServer';
import { deletePhotoObjectFromUrl } from '../../../../../lib/supabaseStorage';

type Props = { params: Promise<{ id: string }> };
export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const photos = await queryRows<{ file_url: string | null }>(`photos?select=file_url&patient_id=eq.${encodeURIComponent(id)}`);
    if (!photos.ok) throw new Error('Não foi possível verificar as fotografias do paciente. A exclusão foi interrompida.');
    await Promise.all(photos.data.map((photo) => deletePhotoObjectFromUrl(photo.file_url)));
    for (const table of ['meal_plans', 'appointments', 'clinical_notes', 'exams', 'photos', 'payments', 'anthropometry_records', 'body_measures', 'anamneses']) {
      await deleteRowsWhere(table, 'patient_id', id);
    }
    await deleteRow('patients', id);
    await writeAudit('privacy_erasure', 'patient', id);
    return Response.json({ ok: true, erased_at: new Date().toISOString() });
  } catch (error) { return jsonError(error); }
}

