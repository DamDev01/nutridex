import { insertRow, jsonError, listRows } from "../../lib/supabaseServer";
import { combineDateTime, optionalText, requiredText } from "../../lib/payload";

export async function GET() {
  try {
    const result = await listRows("appointments");
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      patient_id: optionalText(body.patient_id ?? body.patientId),
      patient_name: requiredText(body.patient ?? body.Paciente),
      scheduled_at: combineDateTime(body.date ?? body.Data, body.time ?? body["Horário"]),
      type: optionalText(body.type ?? body.Tipo),
      goal: optionalText(body.goal ?? body.Objetivo),
      status: optionalText(body.status ?? body.Status) ?? "Pendente",
      notes: optionalText(body.notes ?? body["Observação"] ?? body.Observacao ?? body["Observação"]),
    };

    const result = await insertRow("appointments", payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}





