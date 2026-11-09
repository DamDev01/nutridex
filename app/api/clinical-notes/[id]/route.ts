import { deleteRow, jsonError, updateRow } from "../../../lib/supabaseServer";
import { optionalText, requiredText } from "../../../lib/payload";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = {
      patient_id: optionalText(body.patient_id ?? body.patientId),
      patient_name: optionalText(body.patient ?? body.Paciente),
      title: requiredText(body.title ?? body["Título"], "Nova nota"),
      note: requiredText(body.note ?? body.Nota ?? body["Observação"] ?? body.Observacao, "Nota sem texto"),
    };

    const result = await updateRow("clinical_notes", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const result = await deleteRow("clinical_notes", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
