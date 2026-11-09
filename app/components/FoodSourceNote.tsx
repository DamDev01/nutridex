import { TACO_ATTRIBUTION, TACO_URL } from "../lib/foodNutrition";

export function FoodSourceNote() {
  return (
    <div className="food-source-note">
      <span>Fonte nutricional: <a href={TACO_URL} title={TACO_ATTRIBUTION} target="_blank" rel="noreferrer">TACO · NEPA/UNICAMP, 4ª edição</a></span>
      <details><summary>Sobre os valores</summary><p>Referências por 100 g de parte comestível. ND indica informação indisponível ou inconsistente; Tr indica traços, aproximados como zero nos cálculos. Confira o preparo e revise a porção antes de entregar o plano.</p></details>
    </div>
  );
}
