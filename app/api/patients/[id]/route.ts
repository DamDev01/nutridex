import { deleteRow, jsonError, queryRows, updateRow } from "../../../lib/supabaseServer";
import { assertRange, optionalEmail, optionalNumber, optionalText, requiredText } from "../../../lib/payload";

type PatientRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: PatientRouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = {
      name: requiredText(body.name ?? body.Nome ?? body.Paciente),
      email: optionalEmail(body.email ?? body.Email),
      phone: optionalText(body.phone ?? body.Telefone),
      age: assertRange(optionalNumber(body.age ?? body.Idade), "Idade", 0, 130),
      goal: optionalText(body.goal ?? body.Objetivo),
      calories: assertRange(optionalNumber(body.calories ?? body.Calorias), "Calorias", 0, 10000),
      adherence: assertRange(optionalNumber(body.adherence ?? body.Aderência), "Aderência", 0, 100),
      weight: assertRange(optionalNumber(body.weight ?? body.Peso), "Peso", 0, 500),
      height: assertRange(optionalNumber(body.height ?? body.Altura), "Altura", 0, 3),
      notes: optionalText(body.notes ?? body["Observações"]),
    };

    const result = await updateRow("patients", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: PatientRouteProps) {
  try {
    const { id } = await params;
    const photos = await queryRows<{ file_url: string | null }>(`photos?select=file_url&patient_id=eq.${encodeURIComponent(id)}`);
    if (!photos.ok) throw new Error("Não foi possível verificar as fotografias do paciente. A exclusão foi interrompida.");
    if (photos.data.length) return Response.json({ ok: false, error: "Este paciente possui fotografias. Exclua as fotografias antes de excluir o paciente ou use a opção de exclusão dos dados." }, { status: 409 });
    const result = await deleteRow("patients", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

