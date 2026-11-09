import { insertRow, jsonError, listRows } from "../../lib/supabaseServer";
import { optionalText, requiredText } from "../../lib/payload";

export async function GET() {
  try {
    const result = await listRows("exams");
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
      name: requiredText(body.name ?? body.Exame),
      exam_date: optionalText(body.date ?? body.Data),
      status: optionalText(body.status ?? body.Status),
      note: optionalText(body.note ?? body["Observação"] ?? body.Observacao ?? body["Observação"]),
    };

    const result = await insertRow("exams", payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}




