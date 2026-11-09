import { matchesFoodSearch, normalizeFoodSearch, type FoodItem } from "./foodNutrition";

export function findFoods(foods: FoodItem[], query: string, category = "", source = "") {
  const term = normalizeFoodSearch(query);
  return foods.filter((food) => (!category || food.category === category) && (!source || (food.source === "TACO" ? "TACO" : "personal") === source) && matchesFoodSearch(food, query))
    .sort((a, b) => {
      const rank = (food: FoodItem) => term && normalizeFoodSearch(food.name).startsWith(term) ? 0 : 1;
      return rank(a) - rank(b) || a.name.localeCompare(b.name, "pt-BR");
    });
}
export function foodPage<T>(items: T[], requestedPage: number, size: number) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const page = Math.min(Math.max(1, requestedPage), pages);
  const start = (page - 1) * size;
  return { items: items.slice(start, start + size), page, pages, start, end: Math.min(start + size, items.length) };
}
