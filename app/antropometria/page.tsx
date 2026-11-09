import { AppShell, Card, CardTitle, PageHeader } from "../components/AppShell";
import { RecordActions } from "../components/RecordActions";
import { anthropometry, formatDate, getAnthropometryRecords } from "../lib/dataServer";

export const dynamic = "force-dynamic";

export default async function AntropometriaPage() {
  const records = await getAnthropometryRecords();
  const latest = records[0];
  const cards = latest ? [
    { label: "Peso", value: latest.weight ? `${latest.weight} kg` : "--", change: "Registro atual" },
    { label: "Altura", value: latest.height ? `${latest.height} m` : "--", change: "Cadastro" },
    { label: "Gordura corporal", value: latest.body_fat ? `${latest.body_fat}%` : "--", change: "Avaliação" },
    { label: "Massa magra", value: latest.lean_mass ? `${latest.lean_mass} kg` : "--", change: "Avaliação" },
  ] : anthropometry;

  return (
    <AppShell>
      <PageHeader eyebrow="Antropometria" title="Avaliação antropométrica" description="Resumo de peso, composição corporal e indicadores principais do paciente." action="Nova avaliação" />
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-[0.8fr_1.2fr]">
        <Card><CardTitle title="Paciente" subtitle={latest?.patient_name ?? "Sem avaliação selecionada"} /><div className="space-y-3 p-5 text-sm text-[var(--muted-strong)]"><p><strong>Última avaliação:</strong> {latest ? formatDate(latest.recorded_at) : "Sem registro"}</p><p><strong>Fonte:</strong> {latest ? "Supabase" : "Dados iniciais"}</p></div></Card>
        <div className="grid gap-4 sm:grid-cols-2">{cards.map((item) => <Card key={item.label} className="p-5"><p className="text-sm font-bold text-[var(--muted)]">{item.label}</p><p className="mt-2 text-3xl font-bold text-[var(--heading)]">{item.value}</p><p className="mt-1 text-sm text-[var(--gold-strong)]">{item.change}</p></Card>)}</div>
        <Card className="xl:col-span-2">
          <CardTitle title="Histórico de avaliações" subtitle="Registros salvos no banco" />
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {records.map((record) => (
              <div key={record.id} className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <div className="flex flex-wrap justify-between gap-3"><p className="font-bold">{record.patient_name ?? "Paciente não vinculado"}</p><span className="text-xs font-bold text-[var(--gold-strong)]">{formatDate(record.recorded_at)}</span></div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm"><p>Peso: <strong>{record.weight ?? "--"} kg</strong></p><p>Altura: <strong>{record.height ?? "--"} m</strong></p><p>Gordura: <strong>{record.body_fat ?? "--"}%</strong></p><p>Massa magra: <strong>{record.lean_mass ?? "--"} kg</strong></p></div>
                <RecordActions endpoint={`/api/anthropometry/${record.id}`} title="Avaliação antropométrica" hidden={{ patient_id: record.patient_id }} fields={[{ label: "Paciente", name: "Paciente", value: record.patient_name }, { label: "Peso", name: "Peso", type: "number", value: record.weight }, { label: "Altura", name: "Altura", type: "number", value: record.height }, { label: "Gordura corporal", name: "Gordura corporal", type: "number", value: record.body_fat }, { label: "Massa magra", name: "Massa magra", type: "number", value: record.lean_mass }]} />
              </div>
            ))}
            {!records.length ? <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-5 text-sm font-semibold text-[var(--muted-strong)] lg:col-span-2">Nenhuma avaliação cadastrada.</div> : null}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
