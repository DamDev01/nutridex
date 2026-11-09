import { insertRow, jsonError, listRows } from "../../lib/supabaseServer";
import { optionalNumber, optionalText, requiredText } from "../../lib/payload";
import { getFoodForPlan } from "../../lib/foodLibraryServer";
import { foodPortion } from "../../lib/foodNutrition";

export async function GET() {
  try { return Response.json({ ...await listRows("meal_plan_items") }); }
  catch (error) { return jsonError(error); }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const base = {
      meal_plan_id: requiredText(body.meal_plan_id ?? body.mealPlanId),
      meal_name: requiredText(body.meal_name ?? body.mealName ?? body["Refeição"], "Refeição"),
    };
    let composition;
    if (body.food_id !== undefined) {
      const food = await getFoodForPlan(String(body.food_id));
      // Nutrients come from the selected reference on the server, never from the submitted preview.
      composition = {
        food_name: food.name + (food.source === "TACO" ? " (TACO)" : ""),
        ...foodPortion(food, { grams: body.grams, servings: body.servings }),
      };
    } else {
      // Existing saved-plan copies and professional manual adjustments keep their nutritional snapshot.
      composition = {
        food_name: requiredText(body.food_name ?? body.foodName ?? body.Alimento),
        amount: optionalText(body.amount ?? body.Quantidade),
        calories: optionalNumber(body.calories ?? body.Calorias),
        protein: optionalNumber(body.protein ?? body["Proteína"]),
        carbs: optionalNumber(body.carbs ?? body.Carboidratos),
        fat: optionalNumber(body.fat ?? body.Gorduras),
      };
    }
    const result = await insertRow("meal_plan_items", { ...base, ...composition });
    return Response.json({ ...result });
  } catch (error) { return jsonError(error, error instanceof RangeError ? 400 : 500); }
}
