import { AppShell, Card, CardTitle, PageHeader } from "../components/AppShell";
import { RecordActions } from "../components/RecordActions";
import { formatDate, getNotes } from "../lib/dataServer";

export const dynamic = "force-dynamic";

export default async function NotasPage() {
  const notes = await getNotes();

  return (
    <AppShell>
      <PageHeader eyebrow="Notas" title="Notas clínicas" description="Registre observações rápidas e pontos de atenção para próximas consultas." action="Nova nota" />
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <Card>
          <CardTitle title="Notas salvas" />
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {notes.map((note) => (
              <div key={note.id} className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><p className="font-bold">{note.title}</p><span className="text-xs font-bold text-[var(--gold-strong)]">{formatDate(note.created_at)}</span></div>
                <p className="mt-1 text-xs font-bold text-[var(--muted)]">{note.patient_name ?? "Paciente não vinculado"}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{note.note}</p>
                <RecordActions endpoint={`/api/clinical-notes/${note.id}`} title="Nota clínica" hidden={{ patient_id: note.patient_id }} fields={[{ label: "Paciente", name: "Paciente", value: note.patient_name }, { label: "Título", name: "Título", value: note.title }, { label: "Nota", name: "Nota", value: note.note, textarea: true }]} />
              </div>
            ))}
            {!notes.length ? <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-5 text-sm font-semibold text-[var(--muted-strong)] lg:col-span-2">Nenhuma nota clínica cadastrada.</div> : null}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
