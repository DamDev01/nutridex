"use client";
import { useMemo, useRef, useState } from "react";
import { RecordActions } from "./RecordActions";
import { nutrientLabel, hasCompleteNutrition, type FoodItem } from "../lib/foodNutrition";
import { findFoods, foodPage } from "../lib/foodSearch";
import { FoodPager } from "./FoodPager";

export function FoodsBrowser({ foods }: { foods: FoodItem[] }) {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const categories = useMemo(() => Array.from(new Set(foods.map((food) => food.category).filter((name): name is string => Boolean(name)))).sort((a, b) => a.localeCompare(b, "pt-BR")), [foods]);
  const filtered = useMemo(() => findFoods(foods, query, category, source), [foods, category, query, source]);
  const visible = foodPage(filtered, page, 15);
  const tacoCount = foods.filter((food) => food.source === "TACO").length;
  function changeSource(value: string) { setSource(value); setCategory(""); setPage(1); }
  function clear() { setQuery(""); setCategory(""); setSource(""); setPage(1); }
  return <section className="food-library" aria-label="Biblioteca de alimentos">
    <div className="food-library-panel">
      <div className="food-library-tabs" aria-label="Origem dos alimentos">
        {[{value:"", label:"Todos", count:foods.length}, {value:"TACO",label:"Tabela TACO",count:tacoCount}, {value:"personal",label:"Meus alimentos",count:foods.length-tacoCount}].map((tab) =>
          <button type="button" key={tab.value} aria-pressed={source === tab.value} onClick={() => changeSource(tab.value)}>{tab.label}<span>{tab.count}</span></button>)}
      </div>
      <div className="food-library-toolbar">
        <div className="food-search-field"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input aria-label="Buscar alimentos" placeholder="Buscar por nome, preparo ou categoria..." type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></div>
        <select aria-label="Categoria de alimentos" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option value="">Todas as categorias</option>{categories.map((name) => <option key={name} value={name}>{name}</option>)}</select>
      </div>
      <div className="food-library-meta"><p role="status"><strong>{filtered.length}</strong> {filtered.length === 1 ? "alimento encontrado" : "alimentos encontrados"}{filtered.length ? <span> · {visible.start + 1}–{visible.end} nesta página</span> : null}</p>{query || category ? <button type="button" onClick={clear}>Limpar filtros</button> : <span>Compare os nutrientes e escolha o preparo</span>}</div>
      {visible.items.length ? <div ref={resultsRef} className="food-table-wrap"><table className="food-table">
        <caption className="sr-only">Alimentos e valores nutricionais por porção de referência</caption>
        <thead><tr><th scope="col">Alimento / porção</th><th scope="col">Energia</th><th scope="col">Proteínas</th><th scope="col">Carboidratos</th><th scope="col">Gorduras</th><th scope="col"><span className="sr-only">Ações</span></th></tr></thead>
        <tbody>{visible.items.map((food) => <tr key={food.id}>
          <th scope="row"><strong>{food.name}</strong><span className="food-row-info">{food.category}<span className="food-origin">{food.source === "TACO" ? "TACO" : "Meu cadastro"}</span></span><small>Por {food.serving || "porção cadastrada"}{!hasCompleteNutrition(food) ? " · Dados a revisar" : ""}</small></th>
          <td data-label="Energia"><strong className="food-kcal">{nutrientLabel(food, "calories")}</strong><small> kcal</small></td>
          <td data-label="Proteínas">{nutrientLabel(food, "protein")}<small> g</small></td>
          <td data-label="Carboidratos">{nutrientLabel(food, "carbs")}<small> g</small></td>
          <td data-label="Gorduras">{nutrientLabel(food, "fat")}<small> g</small></td>
          <td className="food-row-actions"><a href={"/plano-alimentar?food=" + encodeURIComponent(food.id)} aria-label={"Usar " + food.name + " no plano"}>Usar no plano <span aria-hidden="true">↗</span></a>{food.source !== "TACO" ? <details><summary aria-label={"Mais ações para " + food.name}>•••</summary><RecordActions endpoint={"/api/foods/" + food.id} title="Alimento" fields={[
            {label:"Nome",name:"Nome",value:food.name},{label:"Categoria",name:"Categoria",value:food.category,options:["Frutas","Proteínas","Carboidratos","Gorduras","Laticínios","Vegetais","Receitas"]},
            {label:"Calorias",name:"Calorias",type:"number",value:food.calories},{label:"Carboidratos",name:"Carboidratos",type:"number",value:food.carbs},{label:"Proteínas",name:"Proteínas",type:"number",value:food.protein},{label:"Gorduras",name:"Gorduras",type:"number",value:food.fat},{label:"Porção",name:"Porção",value:food.serving}
          ]}/></details> : null}</td>
        </tr>)}</tbody>
      </table></div> : <div className="food-empty"><span aria-hidden="true">⌕</span><strong>Nenhum alimento encontrado</strong><p>Tente outro nome ou remova os filtros para ver mais opções.</p><button type="button" onClick={clear}>Limpar busca e filtros</button></div>}
      <FoodPager page={visible.page} pages={visible.pages} onChange={(next) => { setPage(next); resultsRef.current?.scrollIntoView({ block: "start" }); }} />
    </div>
  </section>;
}
