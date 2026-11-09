import { insertRow, jsonError, listRows } from "../../lib/supabaseServer";
import { optionalText, requiredText } from "../../lib/payload";

export async function GET() {
  try {
    const result = await listRows("meal_plans");
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
      patient_name: optionalText(body.patient_name ?? body.patient ?? body.Paciente),
      title: requiredText(body.title ?? body.Titulo ?? body["Título"], "Plano alimentar"),
      status: optionalText(body.status ?? body.Status) ?? "Ativo",
    };

    const result = await insertRow("meal_plans", payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
