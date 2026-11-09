import { insertRow, jsonError, listRows } from "../../lib/supabaseServer";
import { assertRange, optionalEmail, optionalNumber, optionalText, requiredText } from "../../lib/payload";

export async function GET() {
  try {
    const result = await listRows("patients");
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      name: requiredText(body.name ?? body.Nome ?? body.Paciente),
      email: optionalEmail(body.email ?? body.Email),
      phone: optionalText(body.phone ?? body.Telefone),
      age: assertRange(optionalNumber(body.age ?? body.Idade), "Idade", 0, 130),
      goal: optionalText(body.goal ?? body.Objetivo),
      calories: assertRange(optionalNumber(body.calories ?? body.Calorias), "Calorias", 0, 10000),
      weight: assertRange(optionalNumber(body.weight ?? body.Peso), "Peso", 0, 500),
      height: assertRange(optionalNumber(body.height ?? body.Altura), "Altura", 0, 3),
      notes: optionalText(body.notes ?? body["Observações"]),
    };

    const result = await insertRow("patients", payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}



