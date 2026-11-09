import { deleteRow, jsonError, updateRow } from "../../../lib/supabaseServer";
import { combineDateTime, optionalText, requiredText } from "../../../lib/payload";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = {
      patient_id: optionalText(body.patient_id ?? body.patientId),
      patient_name: requiredText(body.patient ?? body.Paciente),
      scheduled_at: combineDateTime(body.date ?? body.Data, body.time ?? body["Horário"]),
      type: optionalText(body.type ?? body.Tipo),
      goal: optionalText(body.goal ?? body.Objetivo),
      status: optionalText(body.status ?? body.Status) ?? "Pendente",
      notes: optionalText(body.notes ?? body["Observação"] ?? body.Observacao),
    };

    const result = await updateRow("appointments", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const result = await deleteRow("appointments", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
