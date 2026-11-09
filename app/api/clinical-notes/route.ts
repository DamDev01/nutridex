import { insertRow, jsonError, listRows } from "../../lib/supabaseServer";
import { optionalText, requiredText } from "../../lib/payload";

export async function GET() {
  try {
    const result = await listRows("clinical_notes");
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
      patient_name: optionalText(body.patient ?? body.Paciente),
      title: requiredText(body.title ?? body["Título"], "Nova nota"),
      note: requiredText(body.note ?? body.Nota ?? body["Observação"] ?? body.Observacao ?? body["Observação"], "Nota sem texto"),
    };

    const result = await insertRow("clinical_notes", payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}






