export const NUTRIENTS = ["calories", "protein", "carbs", "fat"] as const;
export type Nutrient = typeof NUTRIENTS[number];
export type FoodItem = {
  id: string;
  name: string;
  category: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  serving: string | null;
  source?: "TACO" | "personal";
  sourceCode?: number;
  referenceGrams?: number | null;
  traces?: Nutrient[];
  sourceIssues?: Partial<Record<Nutrient, number>>;
};
export const TACO_URL = "https://nepa.unicamp.br/publicacoes/";
export const TACO_ATTRIBUTION = "NEPA/UNICAMP — Tabela Brasileira de Composição de Alimentos (TACO), 4ª edição, 2011.";
const numberFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

export function normalizeFoodSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}
export function matchesFoodSearch(food: FoodItem, query: string) {
  const haystack = normalizeFoodSearch(food.name + " " + (food.category ?? "") + " " + (food.source === "TACO" ? "TACO" : "meus alimentos"));
  return normalizeFoodSearch(query).split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
}
export function referenceGrams(food: Pick<FoodItem, "source" | "referenceGrams" | "serving">) {
  if (food.source === "TACO") return 100;
  const match = food.serving?.match(/^\s*(\d+(?:[.,]\d+)?)\s*(?:g|gramas?)\s*$/i);
  if (!match) return null;
  const value = Number(match[1].replace(",", "."));
  return Number.isFinite(value) && value > 0 && value <= 10000 ? value : null;
}
export function hasCompleteNutrition(food: FoodItem) {
  return NUTRIENTS.every((key) => typeof food[key] === "number" && Number.isFinite(food[key]) && food[key]! >= 0);
}
export function nutrientLabel(food: FoodItem, key: Nutrient) {
  if (food[key] === null || !Number.isFinite(food[key]) || food[key]! < 0) return "ND";
  if (food.traces?.includes(key)) return "Tr";
  return numberFormat.format(food[key]!);
}
export function sourceLabel(food: FoodItem) {
  return food.source === "TACO" ? "TACO / UNICAMP" : "Meu cadastro";
}
export function roundNutrition(value: number, places = 2) {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
function positiveQuantity(value: unknown, max: number) {
  if ((typeof value !== "string" && typeof value !== "number") || !/^\d+(?:[.,]\d+)?$/.test(String(value).trim())) {
    throw new RangeError("Informe uma quantidade numérica válida.");
  }
  const number = Number(String(value).trim().replace(",", "."));
  if (!Number.isFinite(number) || number < 0.1 || number > max) {
    throw new RangeError("A quantidade deve estar entre 0,1 e " + max + ".");
  }
  return number;
}
export function foodPortion(food: FoodItem, input: { grams?: unknown; servings?: unknown }) {
  if (!hasCompleteNutrition(food)) throw new RangeError("Este alimento tem nutrientes não disponíveis (ND). Cadastre uma versão própria com os valores revisados.");
  const base = referenceGrams(food);
  let factor: number;
  let amount: string;
  if (base !== null) {
    if (input.servings !== undefined) throw new RangeError("Informe o peso deste alimento em gramas.");
    const grams = positiveQuantity(input.grams, 5000);
    factor = grams / base;
    amount = numberFormat.format(grams) + " g";
  } else {
    if (input.grams !== undefined) throw new RangeError("Este cadastro usa porções; não há peso em gramas definido.");
    const servings = positiveQuantity(input.servings, 100);
    factor = servings;
    amount = numberFormat.format(servings) + (servings === 1 ? " porção (" : " porções (") + (food.serving || "porção cadastrada") + ")";
  }
  const result = {
    amount,
    calories: roundNutrition(food.calories! * factor, 1),
    protein: roundNutrition(food.protein! * factor),
    carbs: roundNutrition(food.carbs! * factor),
    fat: roundNutrition(food.fat! * factor),
  };
  if (!NUTRIENTS.every((key) => Number.isFinite(result[key]))) throw new RangeError("Os valores desta porção excedem o limite de cálculo.");
  return result;
}
