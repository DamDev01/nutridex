import { insertRow, jsonError, listRows } from "../../lib/supabaseServer";
import { optionalNumber, optionalText } from "../../lib/payload";

export async function GET() {
  try {
    const result = await listRows("anthropometry_records");
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
      weight: optionalNumber(body.weight ?? body.Peso),
      height: optionalNumber(body.height ?? body.Altura),
      body_fat: optionalNumber(body.bodyFat ?? body["Gordura corporal"]),
      lean_mass: optionalNumber(body.leanMass ?? body["Massa magra"]),
    };

    const result = await insertRow("anthropometry_records", payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

