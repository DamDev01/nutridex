import { deleteRow, jsonError, updateRow } from "../../../lib/supabaseServer";
import { optionalText, requiredText } from "../../../lib/payload";

type MealPlanRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: MealPlanRouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = {
      patient_id: optionalText(body.patient_id ?? body.patientId),
      patient_name: optionalText(body.patient_name ?? body.patient ?? body.Paciente),
      title: requiredText(body.title ?? body.Titulo ?? body["Título"], "Plano alimentar"),
      status: optionalText(body.status ?? body.Status) ?? "Ativo",
    };

    const result = await updateRow("meal_plans", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: MealPlanRouteProps) {
  try {
    const { id } = await params;
    const result = await deleteRow("meal_plans", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
