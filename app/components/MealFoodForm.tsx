"use client";
import { useState, type FormEvent } from "react";
import type { DbMealPlanItem } from "../lib/dataServer";
import { foodPortion, hasCompleteNutrition, referenceGrams, type FoodItem } from "../lib/foodNutrition";
import { FoodPicker } from "./FoodPicker";
type Props = { foods: FoodItem[]; planId: string; mealName: string; initialFoodId?: string; disabled?: boolean; onAdded: (item: DbMealPlanItem) => void };
export function MealFoodForm({ foods, planId, mealName, initialFoodId = "", disabled = false, onAdded }: Props) {
  const initial = foods.find((food) => food.id === initialFoodId);
  const [foodId, setFoodId] = useState(initial?.id ?? "");
  const [quantity, setQuantity] = useState(String(initial ? referenceGrams(initial) ?? 1 : 100));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const food = foods.find((item) => item.id === foodId);
  const base = food ? referenceGrams(food) : null;
  let preview: ReturnType<typeof foodPortion> | null = null;
  if (food && quantity) {
    try { preview = foodPortion(food, base !== null ? { grams: quantity } : { servings: quantity }); } catch { /* The form presents invalid portions below. */ }
  }
  function selectFood(id: string) {
    setFoodId(id);
    const selected = foods.find((item) => item.id === id);
    setQuantity(String(selected ? referenceGrams(selected) ?? 1 : 100));
    setFeedback("");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!food || !preview || disabled || saving) return;
    setSaving(true); setFeedback("");
    try {
      const response = await fetch("/api/meal-plan-items", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal_plan_id: planId, meal_name: mealName, food_id: food.id, ...(base !== null ? { grams: quantity } : { servings: quantity }) }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok || !result.data?.[0]) throw new Error(result.error ?? "Não foi possível adicionar o alimento.");
      onAdded(result.data[0]); selectFood(""); setFeedback(food.name + " adicionado à refeição.");
    } catch (error) { setFeedback(error instanceof Error ? error.message : "Não foi possível adicionar o alimento."); }
    finally { setSaving(false); }
  }
  return <form onSubmit={submit} className="meal-add-form print:hidden">
    <FoodPicker foods={foods} value={foodId} onChange={selectFood} disabled={saving || disabled} />
    {food ? <div className="meal-portion">
      <div className="meal-portion-heading"><div><h3>Defina a porção</h3><p>Os nutrientes são ajustados automaticamente.</p></div><label><span>{base !== null ? "Quantidade em gramas" : "Quantidade de porções"}</span><div className="meal-quantity-input"><input autoFocus name="quantity" aria-label={base !== null ? "Quantidade em gramas" : "Quantidade de porções"} type="number" min="0.1" max={base !== null ? 5000 : 100} step="0.1" required value={quantity} onChange={(event) => setQuantity(event.target.value)} disabled={saving || disabled} /><span>{base !== null ? "g" : "porções"}</span></div></label></div>
      {base !== null ? <div className="meal-quick-portions"><span>Porções rápidas</span>{[50,100,150,200].map((grams) => <button key={grams} type="button" aria-pressed={Number(quantity) === grams} onClick={() => setQuantity(String(grams))} disabled={saving || disabled}>{grams} g</button>)}</div> : null}
      {!hasCompleteNutrition(food) ? <p role="alert" className="meal-portion-note">Alguns nutrientes estão indisponíveis. Escolha outro preparo ou cadastre este alimento com valores revisados.</p> : preview ? <div className="meal-portion-macros" role="status" aria-label="Nutrientes da porção">{([{key:"calories",label:"Energia",unit:"kcal"},{key:"protein",label:"Proteínas",unit:"g"},{key:"carbs",label:"Carboidratos",unit:"g"},{key:"fat",label:"Gorduras",unit:"g"}] as const).map((macro) => <div key={macro.key}><span>{macro.label}</span><strong>{preview![macro.key].toLocaleString("pt-BR")}<small> {macro.unit}</small></strong></div>)}</div> : <p className="meal-portion-note">Informe uma quantidade válida para calcular a porção.</p>}
    </div> : null}
    <div className="meal-add-footer"><p role="status">{feedback || (food ? "Confira a porção antes de adicionar." : "Busque e selecione um alimento para começar.")}</p><button type="submit" disabled={saving || disabled || !preview}>{saving ? "Adicionando..." : "Adicionar à refeição"}<span aria-hidden="true"> +</span></button></div>
  </form>;
}
