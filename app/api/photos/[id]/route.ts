import { deleteRow, jsonError, queryRows, updateRow } from "../../../lib/supabaseServer";
import { optionalText } from "../../../lib/payload";
import { deletePhotoObjectFromUrl } from "../../../lib/supabaseStorage";

type PhotoRouteProps = {
  params: Promise<{ id: string }>;
};

type PhotoRecord = {
  id: string;
  file_url: string | null;
};

export async function PATCH(request: Request, { params }: PhotoRouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = {
      patient_id: optionalText(body.patient_id ?? body.patientId),
      patient_name: optionalText(body.patient ?? body.Paciente ?? body.patient_name),
      angle: optionalText(body.angle ?? body["Ângulo"]),
      note: optionalText(body.note ?? body["Observação"] ?? body.Observacao),
    };

    const result = await updateRow("photos", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: PhotoRouteProps) {
  try {
    const { id } = await params;
    const existing = await queryRows<PhotoRecord>(`photos?select=id,file_url&id=eq.${encodeURIComponent(id)}&limit=1`);
    if (!existing.ok) throw new Error("Não foi possível localizar a fotografia para exclusão.");
    if (!existing.data.length) return Response.json({ ok: false, error: "Fotografia não encontrada." }, { status: 404 });
    await deletePhotoObjectFromUrl(existing.data[0]?.file_url);
    const result = await deleteRow("photos", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
