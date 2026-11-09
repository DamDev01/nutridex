import dataset from "../../data/taco-4a-edicao.json";
import type { FoodItem } from "./foodNutrition";

export const TACO_FOODS: readonly FoodItem[] = dataset as FoodItem[];
const byId = new Map(TACO_FOODS.map((food) => [food.id, food]));
export function getTacoFood(id: string) {
  return byId.get(id);
}
