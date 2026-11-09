"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";


type QuickField = {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

type PatientOption = {
  id: string;
  name: string;
};

type QuickAction = {
  title: string;
  submitLabel: string;
  success: string;
  endpoint: string;
  fields: QuickField[];
};

const quickActions: Record<string, QuickAction> = {
  "+ Nova consulta": {
    title: "Nova consulta",
    submitLabel: "Agendar consulta",
    success: "Consulta agendada.",
    endpoint: "/api/appointments",
    fields: [
      { label: "Paciente", required: true },
      { label: "Data", type: "date", required: true },
      { label: "Horário", type: "time", required: true },
      { label: "Tipo", required: true, options: ["Primeira consulta", "Retorno", "Acompanhamento", "Online"] },
      { label: "Objetivo", placeholder: "Emagrecimento, hipertrofia..." },
      { label: "Status", options: ["Pendente", "Confirmada", "Realizada", "Cancelada"] },
    ],
  },
  "Registrar pagamento": {
    title: "Registrar pagamento",
    submitLabel: "Registrar pagamento",
    success: "Pagamento registrado.",
    endpoint: "/api/payments",
    fields: [
      { label: "Paciente", required: true },
      { label: "Valor", type: "number", placeholder: "0,00", required: true },
      { label: "Forma de pagamento", required: true, options: ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro", "Boleto"] },
      { label: "Status", options: ["Pago", "Pendente", "Atrasado", "Cancelado"] },
    ],
  },
  "Adicionar exame": {
    title: "Adicionar exame",
    submitLabel: "Salvar exame",
    success: "Exame adicionado.",
    endpoint: "/api/exams",
    fields: [
      { label: "Paciente", required: true },
      { label: "Exame", placeholder: "Nome do exame", required: true },
      { label: "Data", type: "date" },
      { label: "Status", options: ["Normal", "Atenção", "Alterado", "Pendente"] },
      { label: "Observação", placeholder: "Observação do exame" },
    ],
  },
  "Enviar fotografia": {
    title: "Enviar fotografia",
    submitLabel: "Registrar fotografia",
    success: "Fotografia registrada.",
    endpoint: "/api/photos",
    fields: [
      { label: "Arquivo", type: "file" },
      { label: "Ângulo", placeholder: "Frente, lateral, costas..." },
      { label: "Observação", placeholder: "Observação do registro" },
    ],
  },
  "Nova nota": {
    title: "Nova nota",
    submitLabel: "Salvar nota",
    success: "Nota salva.",
    endpoint: "/api/clinical-notes",
    fields: [
      { label: "Paciente", required: true },
      { label: "Título", placeholder: "Título da nota", required: true },
      { label: "Nota", placeholder: "Digite a observação clínica", required: true },
    ],
  },
  "+ Novo item": {
    title: "Novo alimento ou receita",
    submitLabel: "Salvar item",
    success: "Item adicionado ao banco de alimentos.",
    endpoint: "/api/foods",
    fields: [
      { label: "Nome", placeholder: "Nome do alimento", required: true },
      { label: "Categoria", options: ["Frutas", "Proteínas", "Carboidratos", "Gorduras", "Laticínios", "Vegetais", "Receitas"] },
      { label: "Calorias", type: "number", placeholder: "kcal por porção" },
      { label: "Carboidratos", type: "number", placeholder: "g" },
      { label: "Proteínas", type: "number", placeholder: "g" },
      { label: "Gorduras", type: "number", placeholder: "g" },
      { label: "Porção", placeholder: "100g, 1 unidade..." },
    ],
  },
  "Nova avaliação": {
    title: "Nova avaliação antropométrica",
    submitLabel: "Salvar avaliação",
    success: "Avaliação registrada.",
    endpoint: "/api/anthropometry",
    fields: [
      { label: "Paciente", required: true },
      { label: "Peso", type: "number", placeholder: "kg" },
      { label: "Altura", type: "number", placeholder: "m" },
      { label: "Gordura corporal", type: "number", placeholder: "%" },
      { label: "Massa magra", type: "number", placeholder: "kg" },
    ],
  },
  "Registrar medidas": {
    title: "Registrar medidas",
    submitLabel: "Salvar medidas",
    success: "Medidas registradas.",
    endpoint: "/api/body-measures",
    fields: [
      { label: "Paciente", required: true },
      { label: "Cintura", type: "number", placeholder: "cm" },
      { label: "Quadril", type: "number", placeholder: "cm" },
      { label: "Braço", type: "number", placeholder: "cm" },
      { label: "Coxa", type: "number", placeholder: "cm" },
    ],
  },
};

const saveMessages: Record<string, string> = {
  "Salvar paciente": "Paciente salvo.",
  "Salvar anamnese": "Anamnese salva.",
  "Salvar plano": "Plano alimentar salvo.",
  "Salvar alterações": "Alterações salvas.",
};

function selectedPatientName(form: HTMLFormElement) {
  const select = form.elements.namedItem("patient_id") as HTMLSelectElement | null;
  if (!select || select.selectedIndex < 0) return "";
  return select.options[select.selectedIndex]?.dataset.name ?? "";
}

export function ThemeToggle() {
  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { window.localStorage.setItem("nutridex-theme", next ? "dark" : "light"); } catch {}
  }
  return <button type="button" onClick={toggleTheme} className="nx-theme-toggle" aria-label="Alternar modo claro e escuro" title="Alternar tema"><svg className="nx-theme-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg><svg className="nx-theme-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg></button>;
}

export function ActionButton({ label, message }: { label: string; message?: string }) {
  const [feedback, setFeedback] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const action = useMemo(() => quickActions[label], [label]);

  useEffect(() => {
    if (!modalOpen || patients.length || !action?.fields.some((field) => field.label === "Paciente")) return;

    fetch("/api/patients")
      .then((response) => response.json())
      .then((result) => {
        if (result.ok && Array.isArray(result.data)) {
          setPatients(result.data.map((patient: PatientOption) => ({ id: patient.id, name: patient.name })));
        }
      })
      .catch(() => setPatients([]));
  }, [action, modalOpen, patients.length]);

  function showFeedback(text: string) {
    setFeedback(text);
    window.setTimeout(() => setFeedback(""), 2400);
  }

  function exportReport() {
    const csv = [
      "Indicador,Valor,Detalhe",
      "Aderência média,84%,Pacientes ativos",
      "Perda média de peso,1.6 kg,Últimos 30 dias",
      "Planos atualizados,22,Este mês",
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatório-nutridex.csv";
    link.click();
    URL.revokeObjectURL(url);
    showFeedback("Relatório exportado.");
  }

  function handleClick() {
    if (label === "+ Adicionar paciente") {
      window.location.assign("/pacientes/novo");
      return;
    }

    if (label === "Exportar relatório") {
      exportReport();
      return;
    }

    if (saveMessages[label]) {
      showFeedback(message ?? saveMessages[label]);
      if (label === "Salvar paciente") {
        window.setTimeout(() => window.location.assign("/pacientes"), 700);
      }
      return;
    }

    if (action) {
      setModalOpen(true);
      return;
    }

    showFeedback(message ?? `${label} acionado.`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!action) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        value instanceof File ? value.name : value,
      ]),
    );
    const patientName = selectedPatientName(form);

    if (patientName) {
      payload.patient = patientName;
      payload.Paciente = patientName;
      payload.patient_name = patientName;
    }

    try {
      const response = await fetch(action.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Não foi possível salvar.");
      }

      setModalOpen(false);
      window.location.reload();
      showFeedback(result.simulated ? `${action.success} Configure o Supabase para persistir no banco.` : action.success);
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao salvar.");
    }
  }

  return (
    <span className="relative inline-flex w-fit">
      <button
        type="button"
        onClick={handleClick}
        className="w-fit rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--primary-hover)]"
      >
        {label}
      </button>

      {feedback ? (
        <span className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] shadow-lg">
          {feedback}
        </span>
      ) : null}

      {modalOpen && action ? (
        <span className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6" role="dialog" aria-modal="true">
          <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 text-left shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-[var(--gold-strong)]">Ação rápida</p>
                <h2 className="mt-1 text-xl font-bold text-[var(--heading)]">{action.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-sm font-bold text-[var(--muted-strong)] transition hover:border-[var(--gold)] hover:text-[var(--gold-strong)]"
                aria-label="Fechar"
              >
                x
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {action.fields.map((field) => {
                const isLong = field.label === "Nota" || field.label === "Observação";
                const isPatient = field.label === "Paciente";

                return (
                  <label key={field.label} className={isLong ? "space-y-2 sm:col-span-2" : "space-y-2"}>
                    <span className="text-sm font-bold text-[var(--muted-strong)]">{field.label}</span>
                    {isPatient ? (
                      <select name="patient_id" required={field.required} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
                        <option value="">Selecione um paciente</option>
                        {patients.map((patient) => <option key={patient.id} value={patient.id} data-name={patient.name}>{patient.name}</option>)}
                      </select>
                    ) : field.options ? (
                      <select name={field.label} required={field.required} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
                        <option value="">Selecione</option>
                        {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    ) : isLong ? (
                      <textarea name={field.label} required={field.required} className="min-h-28 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm outline-none focus:border-[var(--gold)]" placeholder={field.placeholder} />
                    ) : (
                      <input name={field.label} type={field.type ?? "text"} step={field.type === "number" ? "0.1" : undefined} required={field.required} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" placeholder={field.placeholder} />
                    )}
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--muted-strong)] transition hover:border-[var(--gold)] hover:text-[var(--gold-strong)]">
                Cancelar
              </button>
              <button type="submit" className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)]">
                {action.submitLabel}
              </button>
            </div>
          </form>
        </span>
      ) : null}
    </span>
  );
}

export function FeedbackButton({ children, message, className }: { children: ReactNode; message: string; className: string }) {
  const [feedback, setFeedback] = useState("");

  function handleClick() {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  }

  return (
    <span className="relative block">
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
      {feedback ? (
        <span className="absolute left-0 top-[calc(100%+6px)] z-50 w-56 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] shadow-lg">
          {feedback}
        </span>
      ) : null}
    </span>
  );
}
