import { AppShell, PageHeader } from "../components/AppShell";
import { ReportsDashboard } from "../components/ReportsDashboard";
import { getAppointments, getExams, getPatients, getPayments } from "../lib/dataServer";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const [patients, appointments, exams, payments] = await Promise.all([
    getPatients(),
    getAppointments(),
    getExams(),
    getPayments(),
  ]);

  return (
    <AppShell>
      <PageHeader eyebrow="Relatórios" title="Análises e indicadores" description="Indicadores reais para acompanhar resultado, aderência, financeiro e produtividade clínica." />
      <ReportsDashboard patients={patients} appointments={appointments} exams={exams} payments={payments} />
    </AppShell>
  );
}
