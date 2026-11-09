"use client";

import { MealFoodForm } from "./MealFoodForm";
import { roundNutrition, TACO_ATTRIBUTION } from "../lib/foodNutrition";


import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Card, CardTitle } from "./AppShell";
import { PrintableDocument } from "./PrintableDocument";
import type { DbFood, DbMealPlan, DbMealPlanItem, DbPatient } from "../lib/dataServer";

type MealPlanBuilderProps = {
  patients: DbPatient[];
  selectedPatient: DbPatient | null;
  plan: DbMealPlan | null;
  items: DbMealPlanItem[];
  foods: DbFood[];
  initialFoodId?: string;
};

const mealNames = ["Café da manhã", "Lanche manhã", "Almoço", "Lanche tarde", "Jantar", "Ceia"];

function numberValue(value: number | null | undefined) {
  return Number(value ?? 0);
}

function macroTotals(items: DbMealPlanItem[]) {
  const total = items.reduce(
    (acc, item) => ({
      calories: acc.calories + numberValue(item.calories),
      protein: acc.protein + numberValue(item.protein),
      carbs: acc.carbs + numberValue(item.carbs),
      fat: acc.fat + numberValue(item.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
  return { calories: roundNutrition(total.calories, 1), protein: roundNutrition(total.protein), carbs: roundNutrition(total.carbs), fat: roundNutrition(total.fat) };
}

function toPayload(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries());
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function MealPlanBuilder({ patients, selectedPatient, plan, items, foods, initialFoodId }: MealPlanBuilderProps) {
  const [activeMeal, setActiveMeal] = useState(mealNames[0]);
  const [editingItem, setEditingItem] = useState<DbMealPlanItem | null>(null);
  const [copyTarget, setCopyTarget] = useState("");
  const [feedback, setFeedback] = useState("");
  const [printObservations, setPrintObservations] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentItems, setCurrentItems] = useState(items);

  useEffect(() => setCurrentItems(items), [items]);

  const totals = useMemo(() => macroTotals(currentItems), [currentItems]);
  const targetCalories = Number(selectedPatient?.calories ?? 0);
  const calorieProgress = targetCalories ? Math.min((totals.calories / targetCalories) * 100, 140) : 0;
  const activeItems = currentItems.filter((item) => item.meal_name === activeMeal);
  const mealSummaries = mealNames.map((meal) => {
    const mealItems = currentItems.filter((item) => item.meal_name === meal);
    return { meal, count: mealItems.length, totals: macroTotals(mealItems) };
  });

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3200);
  }

  function changePatient(patientId: string) {
    window.location.assign(`/plano-alimentar?patient=${patientId}`);
  }

  async function createPlan(patient = selectedPatient, title?: string) {
    if (!patient) return null;
    setSaving(true);

    try {
      const response = await fetch("/api/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patient.id,
          patient_name: patient.name,
          title: title ?? `Plano alimentar - ${patient.name}`,
          status: "Ativo",
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível criar o plano.");

      showFeedback("Plano alimentar criado.");
      return result.data?.[0] as DbMealPlan | undefined;
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao criar plano.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function updateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/meal-plan-items/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(event.currentTarget)),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível atualizar o item.");

      setEditingItem(null);
      const updated = result.data?.[0] as DbMealPlanItem | undefined;
      if (updated) setCurrentItems((previous) => previous.map((item) => item.id === updated.id ? updated : item));
      showFeedback("Item atualizado.");
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao atualizar item.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: DbMealPlanItem) {
    setSaving(true);

    try {
      const response = await fetch(`/api/meal-plan-items/${item.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível excluir o item.");

      setCurrentItems((previous) => previous.filter((current) => current.id !== item.id));
      showFeedback("Item removido do plano.");
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao remover item.");
    } finally {
      setSaving(false);
    }
  }

  async function copyPlan() {
    if (!plan || !copyTarget || !currentItems.length) {
      showFeedback("Selecione um paciente de destino e mantenha ao menos um item no plano.");
      return;
    }

    const target = patients.find((patient) => patient.id === copyTarget);
    if (!target) return;

    setSaving(true);

    try {
      const createdPlan = await createPlan(target, `Cópia de ${plan.title}`);
      if (!createdPlan) throw new Error("Não foi possível criar o plano de destino.");

      for (const item of currentItems) {
        const response = await fetch("/api/meal-plan-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meal_plan_id: createdPlan.id,
            meal_name: item.meal_name,
            food_name: item.food_name,
            amount: item.amount,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error ?? "Falha ao copiar itens.");
      }

      showFeedback(`Plano copiado para ${target.name}.`);
      window.location.assign(`/plano-alimentar?patient=${target.id}`);
      window.location.reload();
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao copiar plano.");
    } finally {
      setSaving(false);
    }
  }

  function exportCsv() {
    const rows = [
      ["Paciente", selectedPatient?.name ?? ""],
      ["Plano", plan?.title ?? "Sem plano"],
      [],
      ["Refeição", "Alimento", "Quantidade", "Calorias", "Proteínas", "Carboidratos", "Gorduras"],
      ...currentItems.map((item) => [item.meal_name, item.food_name, item.amount ?? "", item.calories ?? 0, item.protein ?? 0, item.carbs ?? 0, item.fat ?? 0]),
      [],
      ["Totais", "", "", totals.calories, totals.protein, totals.carbs, totals.fat],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadText(`plano-alimentar-${selectedPatient?.name ?? "paciente"}.csv`, csv, "text/csv;charset=utf-8");
    showFeedback("Plano exportado em CSV.");
  }

  function printPlan() {
    window.print();
  }

  if (!selectedPatient) {
    return <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8"><Card className="p-5">Cadastre um paciente para criar planos alimentares.</Card></section>;
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-[300px_1fr]">
      <Card className="h-fit print:hidden">
        <CardTitle title="Paciente" subtitle="Nutrição personalizada para cada paciente" />
        <div className="space-y-4 p-4">
          <label className="space-y-2">
            <span className="text-sm font-bold text-[var(--muted-strong)]">Selecionar paciente</span>
            <select value={selectedPatient.id} onChange={(event) => changePatient(event.target.value)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
              {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
            </select>
          </label>

          <div className="rounded-md bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted-strong)]">
            <p><strong>Objetivo:</strong> {selectedPatient.goal ?? "Sem objetivo"}</p>
            <p><strong>Meta:</strong> {selectedPatient.calories ?? "--"} kcal/dia</p>
            <p><strong>Peso:</strong> {selectedPatient.weight ?? "--"} kg</p>
          </div>

          {!plan ? (
            <button type="button" onClick={() => createPlan().then(() => window.location.reload())} disabled={saving} className="w-full rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-70">{saving ? "Criando..." : "Criar plano alimentar"}</button>
          ) : (
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="font-bold text-[var(--heading)]">{plan.title}</p>
              <p className="mt-1 text-sm text-[var(--gold-strong)]">{plan.status ?? "Ativo"}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${Math.min(calorieProgress, 100)}%` }} /></div>
              <p className="mt-2 text-xs font-bold text-[var(--muted)]">{targetCalories ? `${Math.round(calorieProgress)}% da meta calórica` : "Meta calórica não definida"}</p>
            </div>
          )}

          {plan ? (
            <div className="space-y-3 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-sm font-bold text-[var(--heading)]">Ações do plano</p>
              <div className="grid gap-2">
                <button type="button" data-testid="meal-plan-pdf" onClick={printPlan} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--muted-strong)] hover:border-[var(--gold)]">Gerar PDF</button>
                <button type="button" onClick={exportCsv} disabled={!currentItems.length} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--muted-strong)] hover:border-[var(--gold)] disabled:opacity-60">Exportar CSV</button>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-bold text-[var(--muted-strong)]">Observações para o paciente</span>
                <textarea data-testid="meal-plan-observations" value={printObservations} onChange={(event) => setPrintObservations(event.target.value)} rows={3} maxLength={600} placeholder="Orientações, substituições ou recomendações..." className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--gold)]" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-[var(--muted-strong)]">Copiar para</span>
                <select value={copyTarget} onChange={(event) => setCopyTarget(event.target.value)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--gold)]">
                  <option value="">Selecione outro paciente</option>
                  {patients.filter((patient) => patient.id !== selectedPatient.id).map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
                </select>
              </label>
              <button type="button" onClick={copyPlan} disabled={saving || !copyTarget || !currentItems.length} className="w-full rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Copiar plano</button>
            </div>
          ) : null}

          {feedback ? <p className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)]">{feedback}</p> : null}
        </div>
      </Card>

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="p-4"><p className="text-sm font-bold text-[var(--muted)]">Calorias</p><p className="mt-1 text-2xl font-bold text-[var(--heading)]">{totals.calories}</p></Card>
          <Card className="p-4"><p className="text-sm font-bold text-[var(--muted)]">Proteínas</p><p className="mt-1 text-2xl font-bold text-[var(--heading)]">{totals.protein.toFixed(1)}g</p></Card>
          <Card className="p-4"><p className="text-sm font-bold text-[var(--muted)]">Carboidratos</p><p className="mt-1 text-2xl font-bold text-[var(--heading)]">{totals.carbs.toFixed(1)}g</p></Card>
          <Card className="p-4"><p className="text-sm font-bold text-[var(--muted)]">Gorduras</p><p className="mt-1 text-2xl font-bold text-[var(--heading)]">{totals.fat.toFixed(1)}g</p></Card>
        </div>

        <Card>
          <CardTitle title="Resumo por refeição" subtitle="Totais calculados automaticamente" />
          <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
            {mealSummaries.map((summary) => (
              <button key={summary.meal} type="button" onClick={() => setActiveMeal(summary.meal)} className={`rounded-md border p-4 text-left transition hover:border-[var(--gold)] ${activeMeal === summary.meal ? "border-[var(--primary)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface-soft)]"}`}>
                <p className="font-bold text-[var(--heading)]">{summary.meal}</p>
                <p className="mt-1 text-xs font-bold text-[var(--gold-strong)]">{summary.count} item(ns)</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{summary.totals.calories} kcal · P {summary.totals.protein.toFixed(1)}g · C {summary.totals.carbs.toFixed(1)}g · G {summary.totals.fat.toFixed(1)}g</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle title={activeMeal} subtitle="Escolha o alimento e ajuste a porção para esta refeição" />
          <div className="space-y-4 p-5">
            {plan ? (
              <MealFoodForm key={plan.id + ":" + activeMeal} foods={foods} planId={plan.id} mealName={activeMeal} initialFoodId={initialFoodId} disabled={saving} onAdded={(created) => setCurrentItems((previous) => [...previous, created])} />
            ) : <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm font-semibold text-[var(--muted-strong)]">Crie um plano para adicionar alimentos.</div>}

            <div className="space-y-3">
              {activeItems.map((item) => (
                <div key={item.id} className="grid gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:grid-cols-[1fr_120px_auto]">
                  <div><p className="font-bold">{item.food_name}</p><p className="text-sm text-[var(--muted)]">{item.amount ?? "1 porção"} · P {item.protein ?? 0}g · C {item.carbs ?? 0}g · G {item.fat ?? 0}g</p></div>
                  <p className="text-sm font-bold text-[var(--gold-strong)]">{item.calories ?? 0} kcal</p>
                  <div className="flex gap-2 sm:justify-end print:hidden"><button type="button" onClick={() => setEditingItem(item)} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--muted-strong)] transition hover:border-[var(--gold)] hover:text-[var(--gold-strong)]">Editar</button><button type="button" onClick={() => deleteItem(item)} disabled={saving} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:border-red-300 disabled:opacity-70">Excluir</button></div>
                </div>
              ))}
              {!activeItems.length ? <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm font-semibold text-[var(--muted-strong)]">Nenhum item nesta refeição.</div> : null}
            </div>
          </div>
        </Card>
      </div>

      {editingItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
          <form onSubmit={updateItem} className="w-full max-w-2xl rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase text-[var(--gold-strong)]">Item do plano</p><h2 className="mt-1 text-xl font-bold text-[var(--heading)]">Editar item</h2></div><button type="button" onClick={() => setEditingItem(null)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] font-bold">x</button></div>
            <p className="mt-3 text-sm text-[var(--muted)]">Edição manual: ao mudar a quantidade ou o alimento, revise também as calorias e os macronutrientes. Para recalcular pela referência, adicione uma nova porção pela busca.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2"><span className="text-sm font-bold text-[var(--muted-strong)]">Refeição</span><select name="meal_name" defaultValue={editingItem.meal_name} required className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">{mealNames.map((meal) => <option key={meal} value={meal}>{meal}</option>)}</select></label>
              <label className="space-y-2"><span className="text-sm font-bold text-[var(--muted-strong)]">Alimento</span><input name="food_name" defaultValue={editingItem.food_name} required maxLength={220} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" /></label>
              <label className="space-y-2"><span className="text-sm font-bold text-[var(--muted-strong)]">Quantidade</span><input name="amount" defaultValue={editingItem.amount ?? ""} maxLength={40} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" /></label>
              <label className="space-y-2"><span className="text-sm font-bold text-[var(--muted-strong)]">Calorias</span><input name="calories" type="number" min="0" max="50000" step="0.01" defaultValue={editingItem.calories ?? 0} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" /></label>
              <label className="space-y-2"><span className="text-sm font-bold text-[var(--muted-strong)]">Proteína</span><input name="protein" type="number" min="0" max="5000" step="0.01" defaultValue={editingItem.protein ?? 0} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" /></label>
              <label className="space-y-2"><span className="text-sm font-bold text-[var(--muted-strong)]">Carboidratos</span><input name="carbs" type="number" min="0" max="5000" step="0.01" defaultValue={editingItem.carbs ?? 0} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" /></label>
              <label className="space-y-2"><span className="text-sm font-bold text-[var(--muted-strong)]">Gorduras</span><input name="fat" type="number" min="0" max="5000" step="0.01" defaultValue={editingItem.fat ?? 0} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" /></label>
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEditingItem(null)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-bold">Cancelar</button><button type="submit" disabled={saving} className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-70">{saving ? "Salvando..." : "Salvar item"}</button></div>
          </form>
        </div>
      ) : null}

      <PrintableDocument
        title={plan?.title ?? "Plano alimentar"}
        subtitle="Orientação nutricional individualizada"
        observations={printObservations}
        metadata={[
          { label: "Paciente", value: selectedPatient.name },
          { label: "Objetivo", value: selectedPatient.goal ?? "Não informado" },
          { label: "Meta energética", value: selectedPatient.calories ? `${selectedPatient.calories} kcal/dia` : "Não informada" },
          { label: "Status", value: plan?.status ?? "Ativo" },
        ]}
      >
        <section className="print-summary">
          <div><span>Energia total</span><strong>{totals.calories} kcal</strong></div>
          <div><span>Proteínas</span><strong>{totals.protein.toFixed(1)} g</strong></div>
          <div><span>Carboidratos</span><strong>{totals.carbs.toFixed(1)} g</strong></div>
          <div><span>Gorduras</span><strong>{totals.fat.toFixed(1)} g</strong></div>
        </section>
        {mealNames.map((meal) => {
          const mealItems = currentItems.filter((item) => item.meal_name === meal);
          if (!mealItems.length) return null;
          return <section className="print-meal" key={meal}><h2>{meal}</h2><table><thead><tr><th>Alimento</th><th>Quantidade</th><th>Energia</th><th>Macros (P/C/G)</th></tr></thead><tbody>{mealItems.map((item) => <tr key={item.id}><td>{item.food_name}</td><td>{item.amount ?? "1 porção"}</td><td>{item.calories ?? 0} kcal</td><td>{item.protein ?? 0} / {item.carbs ?? 0} / {item.fat ?? 0} g</td></tr>)}</tbody></table></section>;
        })}
        {currentItems.some((item) => item.food_name.endsWith(" (TACO)")) ? <p className="mt-4 text-xs">{"Fonte dos alimentos identificados como TACO: " + TACO_ATTRIBUTION + " Valores ajustados às porções indicadas; traços são aproximados como zero. Plano sujeito à revisão do profissional."}</p> : null}
      </PrintableDocument>
    </section>
  );
}
