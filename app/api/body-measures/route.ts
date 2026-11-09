import { insertRow, jsonError, listRows } from "../../lib/supabaseServer";
import { optionalNumber, optionalText } from "../../lib/payload";

export async function GET() {
  try {
    const result = await listRows("body_measures");
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
      waist: optionalNumber(body.waist ?? body.Cintura),
      hip: optionalNumber(body.hip ?? body.Quadril),
      arm: optionalNumber(body.arm ?? body["Braço"]),
      thigh: optionalNumber(body.thigh ?? body.Coxa),
    };

    const result = await insertRow("body_measures", payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}




