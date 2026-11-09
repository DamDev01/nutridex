import { AppShell, Card, CardTitle, PageHeader } from "../components/AppShell";
import { RecordActions } from "../components/RecordActions";
import { formatDate, getBodyMeasures, measures } from "../lib/dataServer";

export const dynamic = "force-dynamic";

export default async function MedidasPage() {
  const records = await getBodyMeasures();
  const latest = records[0];
  const rows = latest ? [
    { area: "Cintura", current: latest.waist ? `${latest.waist} cm` : "--", previous: "Registro atual" },
    { area: "Quadril", current: latest.hip ? `${latest.hip} cm` : "--", previous: "Registro atual" },
    { area: "Braço", current: latest.arm ? `${latest.arm} cm` : "--", previous: "Registro atual" },
    { area: "Coxa", current: latest.thigh ? `${latest.thigh} cm` : "--", previous: "Registro atual" },
  ] : measures;

  return (
    <AppShell>
      <PageHeader eyebrow="Medidas" title="Medidas corporais" description="Comparativo das principais circunferências entre avaliação atual e anterior." action="Registrar medidas" />
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardTitle title="Comparativo" subtitle={latest ? "Último registro" : "Atual vs anterior"} />
          <div className="divide-y divide-[var(--border)]">
            {rows.map((item) => <div key={item.area} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_120px_140px]"><p className="font-bold">{item.area}</p><p>{item.current}</p><p className="text-[var(--muted)]">{item.previous}</p></div>)}
          </div>
        </Card>
        <Card>
          <CardTitle title="Histórico de medidas" subtitle="Registros salvos no banco" />
          <div className="space-y-3 p-5">
            {records.map((record) => (
              <div key={record.id} className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <div className="flex flex-wrap justify-between gap-3"><p className="font-bold">{record.patient_name ?? "Paciente não vinculado"}</p><span className="text-xs font-bold text-[var(--gold-strong)]">{formatDate(record.recorded_at)}</span></div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm"><p>Cintura: <strong>{record.waist ?? "--"} cm</strong></p><p>Quadril: <strong>{record.hip ?? "--"} cm</strong></p><p>Braço: <strong>{record.arm ?? "--"} cm</strong></p><p>Coxa: <strong>{record.thigh ?? "--"} cm</strong></p></div>
                <RecordActions endpoint={`/api/body-measures/${record.id}`} title="Medidas corporais" hidden={{ patient_id: record.patient_id }} fields={[{ label: "Paciente", name: "Paciente", value: record.patient_name }, { label: "Cintura", name: "Cintura", type: "number", value: record.waist }, { label: "Quadril", name: "Quadril", type: "number", value: record.hip }, { label: "Braço", name: "Braço", type: "number", value: record.arm }, { label: "Coxa", name: "Coxa", type: "number", value: record.thigh }]} />
              </div>
            ))}
            {!records.length ? <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-5 text-sm font-semibold text-[var(--muted-strong)]">Nenhuma medida cadastrada.</div> : null}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
