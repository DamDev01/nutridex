import { insertRow, jsonError, listRows } from "../../lib/supabaseServer";
import { optionalNumber, optionalText, requiredText } from "../../lib/payload";

export async function GET() {
  try {
    const result = await listRows("payments");
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
      amount: optionalNumber(body.amount ?? body.Valor) ?? 0,
      method: optionalText(body.method ?? body["Forma de pagamento"]),
      status: optionalText(body.status ?? body.Status) ?? "Pago",
    };

    const result = await insertRow("payments", payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

