import { TACO_FOODS, getTacoFood } from "./foodCatalog";
import { referenceGrams, type FoodItem } from "./foodNutrition";
import { listRows, queryRows } from "./supabaseServer";

function personalFood(food: FoodItem): FoodItem {
  return { ...food, source: "personal", referenceGrams: referenceGrams({ ...food, source: "personal" }), traces: [] };
}
export async function getFoodLibrary(): Promise<FoodItem[]> {
  const result = await listRows<FoodItem>("foods", "id,name,category,calories,carbs,protein,fat,serving");
  if (!result.ok) throw new Error("Não foi possível carregar os alimentos da sua conta. Tente novamente.");
  return [...result.data.map(personalFood), ...TACO_FOODS];
}
export async function getFoodForPlan(id: string): Promise<FoodItem> {
  const taco = getTacoFood(id);
  if (taco) return taco;
  if (!/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(id)) {
    throw new RangeError("Selecione um alimento válido.");
  }
  // queryRows sends the authenticated user's token; existing RLS limits this lookup to their account.
  const result = await queryRows<FoodItem>("foods?select=id,name,category,calories,carbs,protein,fat,serving&id=eq." + encodeURIComponent(id) + "&limit=1");
  if (!result.ok) throw new Error("Não foi possível consultar o alimento. Tente novamente.");
  if (!result.data[0]) throw new RangeError("Alimento não encontrado na sua conta.");
  return personalFood(result.data[0]);
}
