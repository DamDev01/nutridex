"use client";

import Script from "next/script";
import { useMemo, useState } from "react";
import { Card } from "./AppShell";

declare global {
  interface Window {
    openCalculator?: (type: string) => void;
    closeModal?: () => void;
  }
}

const calculators = [
  { id: "tmb", title: "TMB", description: "Taxa Metabolica Basal", group: "Energia" },
  { id: "get", title: "GET", description: "Gasto Energetico Total", group: "Energia" },
  { id: "imc", title: "IMC", description: "Índice de Massa Corporal", group: "Antropometria" },
  { id: "homa", title: "HOMA-IR", description: "Resistencia a insulina", group: "Bioquímica" },
  { id: "tfg", title: "TFG", description: "Taxa de Filtracao Glomerular", group: "Bioquímica" },
  { id: "lipid", title: "Razoes lipidicas", description: "Indicadores de perfil lipidico", group: "Bioquímica" },
  { id: "bolus", title: "Bolus", description: "Cálculo de insulina", group: "Clínica" },
  { id: "superavit", title: "Superavit", description: "Superavit calorico", group: "Energia" },
  { id: "Deficit", title: "Deficit", description: "Deficit calorico", group: "Energia" },
  { id: "cbc", title: "Hemograma", description: "Analise de hemograma completo", group: "Bioquímica" },
  { id: "satfat", title: "Gordura saturada", description: "Limite de gordura saturada", group: "Dieta" },
  { id: "proteina", title: "Proteína", description: "Necessidades proteicas", group: "Dieta" },
  { id: "hidratacao", title: "Hidratacao", description: "Necessidades hidricas", group: "Dieta" },
  { id: "rcq", title: "RCQ", description: "Relacao cintura-quadril", group: "Antropometria" },
  { id: "bioquimicos", title: "Bioquímicos", description: "Avaliação de exames", group: "Bioquímica" },
  { id: "pesoIdeal", title: "Peso ideal", description: "Estimativa de peso ideal", group: "Antropometria" },
  { id: "gastoAtividade", title: "Gasto atividade", description: "Gasto calorico por exercicio", group: "Energia" },
  { id: "macros", title: "Macros", description: "Distribuicao de macronutrientes", group: "Dieta" },
  { id: "dri", title: "DRI", description: "Adequacao da dieta", group: "Dieta" },
  { id: "riscoFratura", title: "Risco de fratura", description: "Avaliação para mulheres com DMO", group: "Clínica" },
  { id: "tvpWells", title: "TVP Wells", description: "Probabilidade clínica de TVP", group: "Clínica" },
  { id: "epWells", title: "EP Wells", description: "Probabilidade clínica de EP", group: "Clínica" },
  { id: "perc", title: "PERC", description: "Regra para embolia pulmonar", group: "Clínica" },
  { id: "pesi", title: "PESI", description: "Índice de severidade da EP", group: "Clínica" },
  { id: "ldlCalculadora", title: "LDL", description: "LDL e tamanho de particula", group: "Bioquímica" },
  { id: "tireoideDiagnostico", title: "Tireoide", description: "Diagnostico tireoidiano", group: "Bioquímica" },
  { id: "ascvdRisco", title: "ASCVD", description: "Risco cardiovascular em 10 anos", group: "Clínica" },
];

const groups = ["Todas", "Energia", "Dieta", "Antropometria", "Bioquímica", "Clínica"];

export function CalculadorasClient() {
  const [scriptReady, setScriptReady] = useState(false);
  const [activeGroup, setActiveGroup] = useState("Todas");
  const [query, setQuery] = useState("");

  const filteredCalculators = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return calculators.filter((calculator) => {
      const groupMatches = activeGroup === "Todas" || calculator.group === activeGroup;
      const textMatches = !normalizedQuery || `${calculator.title} ${calculator.description}`.toLowerCase().includes(normalizedQuery);

      return groupMatches && textMatches;
    });
  }, [activeGroup, query]);

  function open(type: string) {
    if (!scriptReady || !window.openCalculator) return;
    window.openCalculator(type);
  }

  return (
    <>
      <Script src="/calculadoras-legacy.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
      <style jsx global>{`
        #calculator-modal {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: none;
          background: rgba(8, 17, 10, 0.68);
          padding: 24px;
          overflow-y: auto;
          backdrop-filter: blur(6px);
        }

        #calculator-modal .modal-content {
          position: relative;
          width: min(760px, 100%);
          margin: 32px auto;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface);
          color: var(--text);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
          padding: 28px;
        }

        #calculator-modal .close-button {
          position: absolute;
          right: 16px;
          top: 14px;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--surface-soft);
          color: var(--gold-strong);
          font-size: 22px;
          font-weight: 700;
          line-height: 1;
        }

        #calculator-content h2,
        #calculator-content h3,
        #calculator-content h4 {
          color: var(--heading);
          font-weight: 800;
          margin: 0 40px 16px 0;
        }

        #calculator-content .form-group {
          margin-bottom: 14px;
        }

        #calculator-content label {
          display: block;
          margin-bottom: 6px;
          color: var(--muted-strong);
          font-size: 14px;
          font-weight: 700;
        }

        #calculator-content input,
        #calculator-content select {
          width: 100%;
          height: 42px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface-soft);
          color: var(--text);
          padding: 0 12px;
          outline: none;
        }

        #calculator-content input:focus,
        #calculator-content select:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--gold) 22%, transparent);
        }

        #calculator-content button {
          min-height: 42px;
          border: 0;
          border-radius: 999px;
          background: var(--primary);
          color: white;
          font-weight: 800;
          padding: 0 18px;
          cursor: pointer;
        }

        #calculator-content button:hover {
          background: var(--primary-hover);
        }

        #calculator-content .result,
        #calculator-content .additional-info {
          margin-top: 18px;
          border-left: 4px solid var(--gold);
          border-radius: 6px;
          background: var(--accent-soft);
          color: var(--text);
          padding: 14px;
          line-height: 1.55;
        }

        #calculator-content ul {
          margin: 10px 0 0 18px;
        }
      `}</style>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <Card className="p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 text-sm outline-none focus:border-[var(--gold)]"
              placeholder="Pesquisar calculadora..."
            />
            <div className="flex gap-2 overflow-x-auto">
              {groups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setActiveGroup(group)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                    activeGroup === group
                      ? "border-[var(--gold)] bg-[var(--accent-soft)] text-[var(--gold-strong)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] hover:border-[var(--gold)]"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCalculators.map((calculator) => (
            <button
              key={calculator.id}
              type="button"
              onClick={() => open(calculator.id)}
              disabled={!scriptReady}
              className="group rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
            >
              <span className="mb-4 inline-flex rounded-md bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase text-[var(--gold-strong)]">
                {calculator.group}
              </span>
              <span className="block text-xl font-bold text-[var(--heading)]">{calculator.title}</span>
              <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">{calculator.description}</span>
              <span className="mt-5 inline-flex text-sm font-bold text-[var(--primary)] group-hover:text-[var(--gold-strong)]">
                Abrir calculadora
              </span>
            </button>
          ))}
        </div>
      </section>

      <div id="calculator-modal">
        <div className="modal-content">
          <button type="button" className="close-button" onClick={() => window.closeModal?.()}>
            x
          </button>
          <div id="calculator-content" />
        </div>
      </div>
    </>
  );
}

