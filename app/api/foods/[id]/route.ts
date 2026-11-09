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
      name: requiredText(body.name ?? body.Nome),
      category: optionalText(body.category ?? body.Categoria),
      calories: optionalNumber(body.calories ?? body.Calorias),
      carbs: optionalNumber(body.carbs ?? body.Carboidratos),
      protein: optionalNumber(body.protein ?? body.Proteinas ?? body["Proteínas"]),
      fat: optionalNumber(body.fat ?? body.Gorduras),
      serving: optionalText(body.serving ?? body.Porcao ?? body["Porção"]) ?? "100g",
    };

    const result = await updateRow("foods", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const result = await deleteRow("foods", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
