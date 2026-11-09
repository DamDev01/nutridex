"use client";


import { useEffect, useState, type FormEvent } from "react";

type RecordField = {
  label: string;
  name: string;
  type?: string;
  value?: string | number | null;
  textarea?: boolean;
  required?: boolean;
  options?: string[];
};

type PatientOption = {
  id: string;
  name: string;
};

type RecordActionsProps = {
  endpoint: string;
  title: string;
  fields: RecordField[];
  hidden?: Record<string, string | number | null | undefined>;
};

function valueOf(value: string | number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

function fieldKey(field: RecordField) {
  return field.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function selectedPatientName(form: HTMLFormElement) {
  const select = form.elements.namedItem("patient_id") as HTMLSelectElement | null;
  if (!select || select.selectedIndex < 0) return "";
  return select.options[select.selectedIndex]?.dataset.name ?? "";
}

export function RecordActions({ endpoint, title, fields, hidden = {} }: RecordActionsProps) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [patients, setPatients] = useState<PatientOption[]>([]);

  useEffect(() => {
    if (!editing || patients.length) return;

    fetch("/api/patients")
      .then((response) => response.json())
      .then((result) => {
        if (result.ok && Array.isArray(result.data)) {
          setPatients(result.data.map((patient: PatientOption) => ({ id: patient.id, name: patient.name })));
        }
      })
      .catch(() => setPatients([]));
  }, [editing, patients.length]);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  }

  function payloadFromForm(form: HTMLFormElement) {
    const payload = {
      ...hidden,
      ...Object.fromEntries(new FormData(form).entries()),
    };
    const patientName = selectedPatientName(form);

    if (patientName) {
      return { ...payload, patient: patientName, Paciente: patientName, patient_name: patientName };
    }

    return payload;
  }

  async function updateRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadFromForm(event.currentTarget)),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível salvar.");

      setEditing(false);
      window.location.reload();
      showFeedback("Registro atualizado.");
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord() {
    setSaving(true);

    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível excluir.");

      setConfirmingDelete(false);
      window.location.reload();
      showFeedback("Registro excluído.");
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao excluir.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => setEditing(true)} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--muted-strong)] transition hover:border-[var(--gold)] hover:text-[var(--gold-strong)]">Editar</button>
      <button type="button" onClick={() => setConfirmingDelete(true)} className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:border-red-300">Excluir</button>
      {feedback ? <span className="text-xs font-bold text-[var(--gold-strong)]">{feedback}</span> : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
          <form onSubmit={updateRecord} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase text-[var(--gold-strong)]">Editar</p><h2 className="mt-1 text-xl font-bold text-[var(--heading)]">{title}</h2></div>
              <button type="button" onClick={() => setEditing(false)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] font-bold">x</button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map((field) => {
                const key = fieldKey(field);
                const isPatient = key === "paciente";
                const defaultPatientId = valueOf(hidden.patient_id);

                return (
                  <label key={field.name} className={field.textarea ? "space-y-2 sm:col-span-2" : "space-y-2"}>
                    <span className="text-sm font-bold text-[var(--muted-strong)]">{field.label}</span>
                    {isPatient ? (
                      <select name="patient_id" defaultValue={defaultPatientId} required={field.required} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
                        <option value="">Selecione um paciente</option>
                        {patients.map((patient) => <option key={patient.id} value={patient.id} data-name={patient.name}>{patient.name}</option>)}
                      </select>
                    ) : field.options ? (
                      <select name={field.name} defaultValue={valueOf(field.value)} required={field.required} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
                        <option value="">Selecione</option>
                        {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    ) : field.textarea ? (
                      <textarea name={field.name} defaultValue={valueOf(field.value)} required={field.required} className="min-h-28 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm outline-none focus:border-[var(--gold)]" />
                    ) : (
                      <input name={field.name} type={field.type ?? "text"} step={field.type === "number" ? "0.1" : undefined} defaultValue={valueOf(field.value)} required={field.required} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" />
                    )}
                  </label>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEditing(false)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-bold">Cancelar</button><button type="submit" disabled={saving} className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-70">{saving ? "Salvando..." : "Salvar"}</button></div>
          </form>
        </div>
      ) : null}

      {confirmingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
          <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <p className="text-xs font-bold uppercase text-red-700">Excluir</p>
            <h2 className="mt-1 text-xl font-bold text-[var(--heading)]">Excluir registro?</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">Essa ação não pode ser desfeita.</p>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-bold">Cancelar</button><button type="button" onClick={deleteRecord} disabled={saving} className="rounded-full bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-70">{saving ? "Excluindo..." : "Excluir"}</button></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
