import { notFound } from "next/navigation";
import { AppShell, Card, CardTitle, PageHeader } from "../../components/AppShell";
import { PatientDetailActions } from "../../components/PatientDetailActions";
import { RecordActions } from "../../components/RecordActions";
import { formatCurrency, formatDate, formatTime, getPatientDetail } from "../../lib/dataServer";

export const dynamic = "force-dynamic";

type PatientDetailPageProps = {
  params: Promise<{ id: string }>;
};

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm font-semibold text-[var(--muted-strong)]">{text}</div>;
}

function inputDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
}

function inputTime(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value.slice(0, 5) : date.toISOString().slice(11, 16);
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = await params;
  const detail = await getPatientDetail(id);

  if (!detail) notFound();

  const { patient, appointments, notes, exams, photos, payments, anthropometry, measures } = detail;
  const latestAnthropometry = anthropometry[0];
  const latestMeasures = measures[0];
  const paymentTotal = payments.reduce((total, payment) => total + Number(payment.amount ?? 0), 0);
  const hiddenPatient = { patient_id: patient.id, patient: patient.name, Paciente: patient.name };

  return (
    <AppShell>
      <PageHeader eyebrow="Paciente" title={patient.name} description={`${patient.age ?? "--"} anos · ${patient.goal ?? "Sem objetivo"} · ${patient.weight ? `${patient.weight} kg` : "sem peso registrado"}`} />

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <PatientDetailActions patient={patient} />

        <div className="grid gap-5 xl:grid-cols-4">
          <Card className="p-5"><p className="text-sm font-bold text-[var(--muted)]">Aderência</p><p className="mt-2 text-3xl font-bold text-[var(--heading)]">{patient.adherence ?? 0}%</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${patient.adherence ?? 0}%` }} /></div></Card>
          <Card className="p-5"><p className="text-sm font-bold text-[var(--muted)]">Calorias alvo</p><p className="mt-2 text-3xl font-bold text-[var(--heading)]">{patient.calories ?? "--"}</p><p className="mt-1 text-sm text-[var(--gold-strong)]">kcal/dia</p></Card>
          <Card className="p-5"><p className="text-sm font-bold text-[var(--muted)]">Consultas</p><p className="mt-2 text-3xl font-bold text-[var(--heading)]">{appointments.length}</p><p className="mt-1 text-sm text-[var(--gold-strong)]">registros</p></Card>
          <Card className="p-5"><p className="text-sm font-bold text-[var(--muted)]">Financeiro</p><p className="mt-2 text-3xl font-bold text-[var(--heading)]">{formatCurrency(paymentTotal)}</p><p className="mt-1 text-sm text-[var(--gold-strong)]">pagamentos</p></Card>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardTitle title="Histórico de consultas" subtitle="Agenda e retornos vinculados ao paciente" />
            <div className="space-y-3 p-5">
              {appointments.map((item) => (
                <div key={item.id} className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-bold">{formatDate(item.scheduled_at)} às {formatTime(item.scheduled_at)}</p><span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--gold-strong)]">{item.status ?? "Pendente"}</span></div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{item.type ?? "Consulta"} · {item.goal ?? patient.goal ?? "Acompanhamento"}</p>
                  <RecordActions endpoint={`/api/appointments/${item.id}`} title="Consulta" hidden={hiddenPatient} fields={[{ label: "Data", name: "Data", type: "date", value: inputDate(item.scheduled_at) }, { label: "Horário", name: "Horário", type: "time", value: inputTime(item.scheduled_at) }, { label: "Tipo", name: "Tipo", value: item.type, options: ["Primeira consulta", "Retorno", "Acompanhamento", "Online"] }, { label: "Objetivo", name: "Objetivo", value: item.goal }, { label: "Status", name: "Status", value: item.status, options: ["Pendente", "Confirmada", "Realizada", "Cancelada"] }]} />
                </div>
              ))}
              {!appointments.length ? <EmptyState text="Nenhuma consulta cadastrada para este paciente." /> : null}
            </div>
          </Card>

          <Card>
            <CardTitle title="Avaliação corporal" subtitle="Últimos registros clínicos" />
            <div className="space-y-3 p-5">
              {latestAnthropometry ? (
                <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <div className="grid gap-3 sm:grid-cols-2"><div><p className="text-sm text-[var(--muted)]">Peso</p><strong>{latestAnthropometry.weight ?? "--"} kg</strong></div><div><p className="text-sm text-[var(--muted)]">Gordura corporal</p><strong>{latestAnthropometry.body_fat ?? "--"}%</strong></div><div><p className="text-sm text-[var(--muted)]">Altura</p><strong>{latestAnthropometry.height ?? "--"} m</strong></div><div><p className="text-sm text-[var(--muted)]">Massa magra</p><strong>{latestAnthropometry.lean_mass ?? "--"} kg</strong></div></div>
                  <RecordActions endpoint={`/api/anthropometry/${latestAnthropometry.id}`} title="Avaliação antropométrica" hidden={hiddenPatient} fields={[{ label: "Peso", name: "Peso", type: "number", value: latestAnthropometry.weight }, { label: "Altura", name: "Altura", type: "number", value: latestAnthropometry.height }, { label: "Gordura corporal", name: "Gordura corporal", type: "number", value: latestAnthropometry.body_fat }, { label: "Massa magra", name: "Massa magra", type: "number", value: latestAnthropometry.lean_mass }]} />
                </div>
              ) : <EmptyState text="Nenhuma avaliação antropométrica registrada." />}
              {latestMeasures ? (
                <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <div className="grid gap-3 sm:grid-cols-2"><div><p className="text-sm text-[var(--muted)]">Cintura</p><strong>{latestMeasures.waist ?? "--"} cm</strong></div><div><p className="text-sm text-[var(--muted)]">Quadril</p><strong>{latestMeasures.hip ?? "--"} cm</strong></div><div><p className="text-sm text-[var(--muted)]">Braço</p><strong>{latestMeasures.arm ?? "--"} cm</strong></div><div><p className="text-sm text-[var(--muted)]">Coxa</p><strong>{latestMeasures.thigh ?? "--"} cm</strong></div></div>
                  <RecordActions endpoint={`/api/body-measures/${latestMeasures.id}`} title="Medidas corporais" hidden={hiddenPatient} fields={[{ label: "Cintura", name: "Cintura", type: "number", value: latestMeasures.waist }, { label: "Quadril", name: "Quadril", type: "number", value: latestMeasures.hip }, { label: "Braço", name: "Braço", type: "number", value: latestMeasures.arm }, { label: "Coxa", name: "Coxa", type: "number", value: latestMeasures.thigh }]} />
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <Card><CardTitle title="Notas clínicas" /><div className="space-y-3 p-5">{notes.map((note) => <div key={note.id} className="rounded-md bg-[var(--surface-soft)] p-4"><p className="font-bold">{note.title}</p><p className="mt-2 text-sm text-[var(--muted)]">{note.note}</p><p className="mt-2 text-xs font-bold text-[var(--gold-strong)]">{formatDate(note.created_at)}</p><RecordActions endpoint={`/api/clinical-notes/${note.id}`} title="Nota clínica" hidden={hiddenPatient} fields={[{ label: "Título", name: "Título", value: note.title }, { label: "Nota", name: "Nota", value: note.note, textarea: true }]} /></div>)}{!notes.length ? <EmptyState text="Nenhuma nota clínica registrada." /> : null}</div></Card>
          <Card><CardTitle title="Exames" /><div className="space-y-3 p-5">{exams.map((exam) => <div key={exam.id} className="rounded-md bg-[var(--surface-soft)] p-4"><div className="flex flex-wrap justify-between gap-3"><p className="font-bold">{exam.name}</p><span className="text-xs font-bold text-[var(--gold-strong)]">{exam.status ?? "Sem status"}</span></div><p className="mt-2 text-sm text-[var(--muted)]">{formatDate(exam.exam_date)} · {exam.note ?? "Sem observação"}</p><RecordActions endpoint={`/api/exams/${exam.id}`} title="Exame" hidden={hiddenPatient} fields={[{ label: "Exame", name: "Exame", value: exam.name }, { label: "Data", name: "Data", type: "date", value: inputDate(exam.exam_date) }, { label: "Status", name: "Status", value: exam.status, options: ["Normal", "Atenção", "Alterado", "Pendente"] }, { label: "Observação", name: "Observação", value: exam.note, textarea: true }]} /></div>)}{!exams.length ? <EmptyState text="Nenhum exame registrado." /> : null}</div></Card>
          <Card><CardTitle title="Pagamentos" /><div className="space-y-3 p-5">{payments.map((payment) => <div key={payment.id} className="rounded-md bg-[var(--surface-soft)] p-4"><p className="font-bold">{formatCurrency(payment.amount)}</p><p className="mt-2 text-sm text-[var(--muted)]">{payment.method ?? "Método não informado"} · {formatDate(payment.paid_at)}</p><RecordActions endpoint={`/api/payments/${payment.id}`} title="Pagamento" hidden={hiddenPatient} fields={[{ label: "Valor", name: "Valor", type: "number", value: payment.amount }, { label: "Forma de pagamento", name: "Forma de pagamento", value: payment.method }, { label: "Status", name: "Status", value: payment.status, options: ["Pago", "Pendente", "Atrasado", "Cancelado"] }]} /></div>)}{!payments.length ? <EmptyState text="Nenhum pagamento registrado." /> : null}</div></Card>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <Card><CardTitle title="Fotografias" /><div className="space-y-3 p-5">{photos.map((photo) => <div key={photo.id} className="rounded-md bg-[var(--surface-soft)] p-4"><p className="font-bold">{photo.angle ?? "Ângulo"}</p><p className="mt-2 text-sm text-[var(--muted)]">{photo.file_name ?? "Sem arquivo"}</p><p className="mt-2 text-xs font-bold text-[var(--gold-strong)]">{formatDate(photo.created_at)}</p></div>)}{!photos.length ? <EmptyState text="Nenhuma fotografia registrada." /> : null}</div></Card>
        </div>
      </section>
    </AppShell>
  );
}


