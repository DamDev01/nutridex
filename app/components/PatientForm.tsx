"use client";


import { useState, type FormEvent } from "react";

const fields = [
  { label: "Nome", name: "name", type: "text" },
  { label: "Email", name: "email", type: "email" },
  { label: "Telefone", name: "phone", type: "tel" },
  { label: "Idade", name: "age", type: "number" },
  { label: "Objetivo", name: "goal", type: "text" },
  { label: "Peso (kg)", name: "weight", type: "number" },
  { label: "Altura (m)", name: "height", type: "number" },
  { label: "Calorias alvo (kcal)", name: "calories", type: "number" },
];

export function PatientForm() {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Não foi possível salvar o paciente.");
      }

      setStatus(result.simulated ? "Paciente validado. Configure o Supabase para persistir no banco." : "Paciente salvo no banco.");
      window.setTimeout(() => window.location.assign("/pacientes"), 900);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro ao salvar paciente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className="space-y-2">
            <span className="text-sm font-bold text-[var(--muted-strong)]">{field.label}</span>
            <input
              name={field.name}
              type={field.type}
              step={field.name === "height" ? "0.01" : field.name === "weight" ? "0.1" : field.type === "number" ? "1" : undefined}
              min={field.type === "number" ? "0" : undefined}
              max={field.name === "height" ? "3" : field.name === "weight" ? "500" : field.name === "age" ? "130" : field.name === "calories" ? "10000" : undefined}
              className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]"
              placeholder={field.label}
              required={field.name === "name"}
            />
          </label>
        ))}

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-bold text-[var(--muted-strong)]">Observações</span>
          <textarea
            name="notes"
            className="min-h-28 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm outline-none focus:border-[var(--gold)]"
            placeholder="Observações clínicas iniciais"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-4">
        <p className="text-sm font-semibold text-[var(--muted-strong)]">{status}</p>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Salvando..." : "Salvar paciente"}
        </button>
      </div>
    </form>
  );
}
