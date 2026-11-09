import { AppShell, Card, CardTitle, PageHeader } from "../components/AppShell";
import { RecordActions } from "../components/RecordActions";
import { formatDate, getExams } from "../lib/dataServer";

export const dynamic = "force-dynamic";

function inputDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
}

export default async function ExamesPage() {
  const exams = await getExams();

  return (
    <AppShell>
      <PageHeader eyebrow="Exames" title="Exames laboratoriais" description="Acompanhe resultados, datas, status e observações clínicas relevantes." action="Adicionar exame" />
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <Card>
          <CardTitle title="Resultados recentes" />
          <div className="divide-y divide-[var(--border)]">
            {exams.map((exam) => (
              <div key={exam.id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1fr_130px_130px_1.2fr_150px]">
                <p className="font-bold">{exam.name}</p>
                <p className="text-[var(--muted)]">{formatDate(exam.exam_date)}</p>
                <span className="h-fit w-fit rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--gold-strong)]">{exam.status ?? "Sem status"}</span>
                <p className="text-sm text-[var(--muted)]">{exam.note ?? "Sem observação"}</p>
                <RecordActions endpoint={`/api/exams/${exam.id}`} title="Exame" hidden={{ patient_id: exam.patient_id }} fields={[{ label: "Exame", name: "Exame", value: exam.name }, { label: "Data", name: "Data", type: "date", value: inputDate(exam.exam_date) }, { label: "Status", name: "Status", value: exam.status, options: ["Normal", "Atenção", "Alterado", "Pendente"] }, { label: "Observação", name: "Observação", value: exam.note, textarea: true }]} />
              </div>
            ))}
            {!exams.length ? <div className="p-5 text-sm font-semibold text-[var(--muted-strong)]">Nenhum exame cadastrado.</div> : null}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

