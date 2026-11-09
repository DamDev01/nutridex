"use client";
import { useId, useMemo, useRef, useState } from "react";
import { hasCompleteNutrition, nutrientLabel, type FoodItem } from "../lib/foodNutrition";
import { findFoods, foodPage } from "../lib/foodSearch";
import { FoodPager } from "./FoodPager";
type Props = { foods: FoodItem[]; value: string; onChange: (id: string) => void; disabled?: boolean };
export function FoodPicker({ foods, value, onChange, disabled = false }: Props) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLUListElement>(null);
  const categories = useMemo(() => Array.from(new Set(foods.map((food) => food.category).filter((name): name is string => Boolean(name)))).sort((a, b) => a.localeCompare(b, "pt-BR")), [foods]);
  const results = useMemo(() => findFoods(foods, query, category, source), [foods, query, category, source]);
  const visible = foodPage(results, page, 8);
  const selected = foods.find((food) => food.id === value);
  const reset = () => { setQuery(""); setCategory(""); setSource(""); setPage(1); onChange(""); };
  return <fieldset className="food-picker" disabled={disabled}>
    <legend>Buscar alimento</legend>
    <div className="food-search-field">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg>
      <input id={id + "-search"} aria-label="Buscar alimento para a refeição" type="search" autoComplete="off" placeholder="Busque um alimento, ex.: arroz cozido" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); onChange(""); }} />
    </div>
    <details className="food-picker-filters"><summary>Filtrar por categoria ou origem{category || source ? " · filtros ativos" : ""}</summary>
      <div>
        <label htmlFor={id + "-category"}>Categoria<select id={id + "-category"} value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); onChange(""); }}><option value="">Todas as categorias</option>{categories.map((name) => <option value={name} key={name}>{name}</option>)}</select></label>
        <label htmlFor={id + "-source"}>Origem<select id={id + "-source"} value={source} onChange={(event) => { setSource(event.target.value); setPage(1); onChange(""); }}><option value="">Todos os alimentos</option><option value="TACO">Tabela TACO</option><option value="personal">Meus alimentos</option></select></label>
      </div>
    </details>
    {selected ? <div className="food-chosen"><span aria-hidden="true">✓</span><div><small>Alimento selecionado</small><strong>{selected.name}</strong></div><button type="button" onClick={() => onChange("")}>Trocar</button></div> : <>
      <div className="food-picker-caption"><span role="status">{results.length} {results.length === 1 ? "alimento encontrado" : "alimentos encontrados"}</span><span>Selecione para definir a porção</span></div>
      {visible.items.length ? <ul ref={resultsRef} className="food-picker-results" aria-label="Resultados de alimentos">
        {visible.items.map((food) => <li key={food.id}><button type="button" onClick={() => onChange(food.id)} className="food-result" aria-label={"Selecionar " + food.name + (food.source === "TACO" ? " da TACO" : " do meu cadastro")}>
          <span className="food-result-name"><strong>{food.name}</strong><small>{food.category}<span className="food-origin">{food.source === "TACO" ? "TACO" : "Meu cadastro"}</span>{!hasCompleteNutrition(food) ? <span className="food-review-tag">Revisar dados</span> : null}</small></span>
          <span className="food-result-energy"><strong>{nutrientLabel(food, "calories")} <small>kcal</small></strong><small>por {food.serving || "porção"}</small></span><span className="food-result-add" aria-hidden="true">+</span>
        </button></li>)}
      </ul> : <div className="food-empty"><strong>Nenhum alimento encontrado</strong><p>Tente um nome mais curto ou retire os filtros.</p><button type="button" onClick={reset}>Limpar busca e filtros</button></div>}
      <FoodPager page={visible.page} pages={visible.pages} onChange={(next) => { setPage(next); resultsRef.current?.scrollTo({ top: 0 }); }} />
    </>}
  </fieldset>;
}
