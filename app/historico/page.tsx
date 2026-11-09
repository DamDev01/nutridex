import { AppShell, Card, CardTitle, PageHeader } from "../components/AppShell";
import { formatDate, getAppointments } from "../lib/dataServer";

export const dynamic = "force-dynamic";

export default async function HistóricoPage() {
  const history = await getAppointments();
  return <AppShell><PageHeader eyebrow="Histórico" title="Histórico de consultas" description="Linha do tempo de atendimentos, evolução e ajustes realizados." /><section className="mx-auto max-w-7xl px-5 py-6 sm:px-8"><Card><CardTitle title="Consultas registradas" /><div className="divide-y divide-[#edf3f4]">{history.map((item) => <div key={item.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[140px_180px_1fr]"><p className="font-bold text-[var(--gold-strong)]">{formatDate(item.scheduled_at)}</p><p className="font-semibold">{item.patient_name}</p><p className="text-sm text-[var(--muted)]">{item.type ?? "Consulta"} · {item.goal ?? "Acompanhamento"} · {item.status ?? "Sem status"}</p></div>)}{!history.length ? <p className="p-5 text-sm text-[var(--muted)]">Nenhuma consulta registrada.</p> : null}</div></Card></section></AppShell>;
}
