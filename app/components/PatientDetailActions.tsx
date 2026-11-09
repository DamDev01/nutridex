"use client";


import { useState, type FormEvent } from "react";
import type { DbPatient } from "../lib/dataServer";

type Field = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  defaultValue?: string | number | null;
};

type RelatedAction = {
  id: string;
  label: string;
  title: string;
  endpoint: string;
  submitLabel: string;
  success: string;
  fields: Field[];
};

type PatientDetailActionsProps = {
  patient: DbPatient;
};

function valueOf(value: string | number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

export function PatientDetailActions({ patient }: PatientDetailActionsProps) {
  const [activeAction, setActiveAction] = useState<RelatedAction | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const editFields: Field[] = [
    { label: "Nome", name: "name", defaultValue: patient.name },
    { label: "E-mail", name: "email", type: "email", defaultValue: patient.email },
    { label: "Telefone", name: "phone", type: "tel", defaultValue: patient.phone },
    { label: "Idade", name: "age", type: "number", defaultValue: patient.age },
    { label: "Objetivo", name: "goal", defaultValue: patient.goal },
    { label: "Calorias", name: "calories", type: "number", defaultValue: patient.calories },
    { label: "Aderência", name: "adherence", type: "number", defaultValue: patient.adherence },
    { label: "Peso", name: "weight", type: "number", defaultValue: patient.weight },
    { label: "Altura", name: "height", type: "number", defaultValue: patient.height },
    { label: "Observações", name: "notes", textarea: true, defaultValue: patient.notes },
  ];

  const relatedActions: RelatedAction[] = [
    {
      id: "appointment",
      label: "Nova consulta",
      title: "Nova consulta",
      endpoint: "/api/appointments",
      submitLabel: "Agendar consulta",
      success: "Consulta salva para o paciente.",
      fields: [
        { label: "Data", name: "Data", type: "date" },
        { label: "Horário", name: "Horário", type: "time" },
        { label: "Tipo", name: "Tipo", placeholder: "Retorno, avaliação..." },
        { label: "Objetivo", name: "Objetivo", defaultValue: patient.goal },
        { label: "Observação", name: "Observação", textarea: true },
      ],
    },
    {
      id: "note",
      label: "Nova nota",
      title: "Nova nota clínica",
      endpoint: "/api/clinical-notes",
      submitLabel: "Salvar nota",
      success: "Nota vinculada ao paciente.",
      fields: [
        { label: "Título", name: "Título" },
        { label: "Nota", name: "Nota", textarea: true },
      ],
    },
    {
      id: "exam",
      label: "Adicionar exame",
      title: "Adicionar exame",
      endpoint: "/api/exams",
      submitLabel: "Salvar exame",
      success: "Exame vinculado ao paciente.",
      fields: [
        { label: "Exame", name: "Exame" },
        { label: "Data", name: "Data", type: "date" },
        { label: "Status", name: "Status", placeholder: "Normal, atenção..." },
        { label: "Observação", name: "Observação", textarea: true },
      ],
    },
    {
      id: "anthropometry",
      label: "Nova avaliação",
      title: "Nova avaliação antropométrica",
      endpoint: "/api/anthropometry",
      submitLabel: "Salvar avaliação",
      success: "Avaliação vinculada ao paciente.",
      fields: [
        { label: "Peso", name: "Peso", type: "number", defaultValue: patient.weight },
        { label: "Altura", name: "Altura", type: "number", defaultValue: patient.height },
        { label: "Gordura corporal", name: "Gordura corporal", type: "number" },
        { label: "Massa magra", name: "Massa magra", type: "number" },
      ],
    },
    {
      id: "measures",
      label: "Registrar medidas",
      title: "Registrar medidas corporais",
      endpoint: "/api/body-measures",
      submitLabel: "Salvar medidas",
      success: "Medidas vinculadas ao paciente.",
      fields: [
        { label: "Cintura", name: "Cintura", type: "number" },
        { label: "Quadril", name: "Quadril", type: "number" },
        { label: "Braço", name: "Braço", type: "number" },
        { label: "Coxa", name: "Coxa", type: "number" },
      ],
    },
    {
      id: "payment",
      label: "Registrar pagamento",
      title: "Registrar pagamento",
      endpoint: "/api/payments",
      submitLabel: "Salvar pagamento",
      success: "Pagamento vinculado ao paciente.",
      fields: [
        { label: "Valor", name: "Valor", type: "number" },
        { label: "Forma de pagamento", name: "Forma de pagamento", placeholder: "Pix, cartão, dinheiro..." },
      ],
    },
  ];

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2600);
  }

  function payloadFromForm(form: HTMLFormElement) {
    return Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([key, value]) => [
        key,
        value instanceof File ? value.name : value,
      ]),
    );
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadFromForm(event.currentTarget)),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível salvar o paciente.");

      setEditing(false);
      window.location.reload();
      showFeedback("Paciente atualizado.");
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao atualizar paciente.");
    } finally {
      setSaving(false);
    }
  }

  async function submitRelated(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeAction) return;
    setSaving(true);

    try {
      const payload = {
        ...payloadFromForm(event.currentTarget),
        patient_id: patient.id,
        patient: patient.name,
        Paciente: patient.name,
      };
      const response = await fetch(activeAction.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível salvar.");

      setActiveAction(null);
      window.location.reload();
      showFeedback(activeAction.success);
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao salvar registro.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePatient() {
    setSaving(true);

    try {
      const response = await fetch(`/api/privacy/patients/${patient.id}/erase`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível excluir o paciente.");

      window.location.assign("/pacientes");
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao excluir paciente.");
      setDeleting(false);
    } finally {
      setSaving(false);
    }
  }

  function renderFields(fields: Field[]) {
    return fields.map((field) => (
      <label key={field.name} className={field.textarea ? "space-y-2 sm:col-span-2" : "space-y-2"}>
        <span className="text-sm font-bold text-[var(--muted-strong)]">{field.label}</span>
        {field.textarea ? (
          <textarea name={field.name} defaultValue={valueOf(field.defaultValue)} className="min-h-28 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm outline-none focus:border-[var(--gold)]" placeholder={field.placeholder} />
        ) : (
          <input name={field.name} type={field.type ?? "text"} defaultValue={valueOf(field.defaultValue)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" placeholder={field.placeholder ?? field.label} />
        )}
      </label>
    ));
  }

  return (
    <div className="mb-5 space-y-3">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setEditing(true)} className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)]">Editar paciente</button>
        {relatedActions.map((action) => (
          <button key={action.id} type="button" onClick={() => setActiveAction(action)} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--muted-strong)] transition hover:border-[var(--gold)] hover:text-[var(--gold-strong)]">{action.label}</button>
        ))}
        <button type="button" onClick={() => window.location.assign(`/plano-alimentar?patient=${patient.id}`)} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--muted-strong)] transition hover:border-[var(--gold)] hover:text-[var(--gold-strong)]">Plano alimentar</button><a href={`/api/privacy/patients/${patient.id}/export`} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--muted-strong)] transition hover:border-[var(--gold)]">Exportar dados</a><button type="button" onClick={() => setDeleting(true)} className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:border-red-300">Excluir dados</button>
      </div>

      {feedback ? <p className="w-fit rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)] shadow-sm">{feedback}</p> : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
          <form onSubmit={submitEdit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase text-[var(--gold-strong)]">Paciente</p><h2 className="mt-1 text-xl font-bold text-[var(--heading)]">Editar cadastro</h2></div><button type="button" onClick={() => setEditing(false)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] font-bold">x</button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">{renderFields(editFields)}</div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEditing(false)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-bold">Cancelar</button><button type="submit" disabled={saving} className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-70">{saving ? "Salvando..." : "Salvar alterações"}</button></div>
          </form>
        </div>
      ) : null}

      {activeAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
          <form onSubmit={submitRelated} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase text-[var(--gold-strong)]">{patient.name}</p><h2 className="mt-1 text-xl font-bold text-[var(--heading)]">{activeAction.title}</h2></div><button type="button" onClick={() => setActiveAction(null)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] font-bold">x</button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">{renderFields(activeAction.fields)}</div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setActiveAction(null)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-bold">Cancelar</button><button type="submit" disabled={saving} className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-70">{saving ? "Salvando..." : activeAction.submitLabel}</button></div>
          </form>
        </div>
      ) : null}

      {deleting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
          <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <p className="text-xs font-bold uppercase text-red-700">Exclusão</p>
            <h2 className="mt-1 text-xl font-bold text-[var(--heading)]">Excluir {patient.name}?</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">Esta ação apaga permanentemente cadastro, prontuário, planos e fotografias vinculadas. Exporte os dados antes se necessário.</p>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeleting(false)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-bold">Cancelar</button><button type="button" onClick={deletePatient} disabled={saving} className="rounded-full bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-70">{saving ? "Excluindo..." : "Excluir"}</button></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

