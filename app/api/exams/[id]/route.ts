import { deleteRow, jsonError, updateRow } from "../../../lib/supabaseServer";
import { optionalText, requiredText } from "../../../lib/payload";

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
      name: requiredText(body.name ?? body.Exame),
      exam_date: optionalText(body.date ?? body.Data),
      status: optionalText(body.status ?? body.Status),
      note: optionalText(body.note ?? body["Observação"] ?? body.Observacao),
    };

    const result = await updateRow("exams", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const result = await deleteRow("exams", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
