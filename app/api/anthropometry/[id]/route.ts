import { deleteRow, jsonError, updateRow } from "../../../lib/supabaseServer";
import { optionalNumber, optionalText } from "../../../lib/payload";

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
      weight: optionalNumber(body.weight ?? body.Peso),
      height: optionalNumber(body.height ?? body.Altura),
      body_fat: optionalNumber(body.bodyFat ?? body["Gordura corporal"]),
      lean_mass: optionalNumber(body.leanMass ?? body["Massa magra"]),
    };

    const result = await updateRow("anthropometry_records", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const result = await deleteRow("anthropometry_records", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
