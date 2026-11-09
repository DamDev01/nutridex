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
      waist: optionalNumber(body.waist ?? body.Cintura),
      hip: optionalNumber(body.hip ?? body.Quadril),
      arm: optionalNumber(body.arm ?? body["Braço"]),
      thigh: optionalNumber(body.thigh ?? body.Coxa),
    };

    const result = await updateRow("body_measures", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const result = await deleteRow("body_measures", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
