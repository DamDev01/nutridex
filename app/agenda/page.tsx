import { AppShell, PageHeader } from "../components/AppShell";
import { AgendaBoard } from "../components/AgendaBoard";
import { getAppointments } from "../lib/dataServer";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const appointments = await getAppointments();

  return (
    <AppShell>
      <PageHeader eyebrow="Agenda" title="Consultas e retornos" description="Organize horários, status e tipo de atendimento do dia." action="+ Nova consulta" />
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <AgendaBoard appointments={appointments} />
      </section>
    </AppShell>
  );
}
