import { deleteRow, jsonError, updateRow } from "../../../lib/supabaseServer";
import { optionalNumber, optionalText, requiredText } from "../../../lib/payload";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = {
      patient_id: optionalText(body.patient_id ?? body.patientId),
      patient_name: requiredText(body.patient ?? body.Paciente),
      amount: optionalNumber(body.amount ?? body.Valor) ?? 0,
      method: optionalText(body.method ?? body["Forma de pagamento"]),
      status: optionalText(body.status ?? body.Status) ?? "Pago",
    };

    const result = await updateRow("payments", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const result = await deleteRow("payments", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
