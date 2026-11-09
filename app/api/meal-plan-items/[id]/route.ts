import { deleteRow, jsonError, updateRow } from "../../../lib/supabaseServer";
import { optionalNumber, optionalText, requiredText } from "../../../lib/payload";

type MealPlanItemRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: MealPlanItemRouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = {
      meal_name: requiredText(body.meal_name ?? body.mealName ?? body["Refeição"], "Refeição"),
      food_name: requiredText(body.food_name ?? body.foodName ?? body.Alimento),
      amount: optionalText(body.amount ?? body.Quantidade),
      calories: optionalNumber(body.calories ?? body.Calorias),
      protein: optionalNumber(body.protein ?? body["Proteína"]),
      carbs: optionalNumber(body.carbs ?? body.Carboidratos),
      fat: optionalNumber(body.fat ?? body.Gorduras),
    };

    const result = await updateRow("meal_plan_items", id, payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: MealPlanItemRouteProps) {
  try {
    const { id } = await params;
    const result = await deleteRow("meal_plan_items", id);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}
