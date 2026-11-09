"use client";

import { useMemo, useState } from "react";
import { Card } from "./AppShell";
import { PrintableDocument } from "./PrintableDocument";
import type { DbAppointment, DbExam, DbPatient, DbPayment } from "../lib/dataServer";

type ReportsDashboardProps = {
  patients: DbPatient[];
  appointments: DbAppointment[];
  exams: DbExam[];
  payments: DbPayment[];
};

function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);
}

function percent(value: number) {
  return `${Math.round(value)}%`;
}

function inPeriod(value: string | null | undefined, period: string) {
  if (period === "all") return true;
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === "30") start.setDate(now.getDate() - 30);
  if (period === "90") start.setDate(now.getDate() - 90);
  if (period === "year") start.setMonth(0, 1);

  return date >= start;
}

function matchesPatient(patientId: string, selectedPatient: string) {
  return selectedPatient === "all" || patientId === selectedPatient;
}

function trendLabel(current: number, previous: number) {
  if (!previous && !current) return "sem variação";
  if (!previous) return "+100%";
  const value = ((current - previous) / previous) * 100;
  return `${value >= 0 ? "+" : ""}${Math.round(value)}%`;
}

function downloadCsv(rows: Array<Array<string | number>>) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "relatorios-nutridex.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function ReportsDashboard({ patients, appointments, exams, payments }: ReportsDashboardProps) {
  const [period, setPeriod] = useState("90");
  const [patientId, setPatientId] = useState("all");
  const [printObservations, setPrintObservations] = useState("");

  const patientByName = useMemo(() => new Map(patients.map((patient) => [patient.name, patient.id])), [patients]);

  const data = useMemo(() => {
    const selectedPatients = patients.filter((patient) => matchesPatient(patient.id, patientId));
    const selectedIds = new Set(selectedPatients.map((patient) => patient.id));
    const selectedNames = new Set(selectedPatients.map((patient) => patient.name));

    const filteredAppointments = appointments.filter((appointment) => {
      const resolvedId = appointment.patient_id ?? patientByName.get(appointment.patient_name) ?? "";
      return selectedIds.has(resolvedId) && inPeriod(appointment.scheduled_at, period);
    });
    const filteredExams = exams.filter((exam) => selectedIds.has(exam.patient_id ?? "") && inPeriod(exam.exam_date, period));
    const previousAppointments = appointments.filter((appointment) => {
      const resolvedId = appointment.patient_id ?? patientByName.get(appointment.patient_name) ?? "";
      return selectedIds.has(resolvedId) && !inPeriod(appointment.scheduled_at, period);
    });
    const previousPayments = payments.filter((payment) => {
      const resolvedId = payment.patient_id ?? patientByName.get(payment.patient_name) ?? "";
      return (selectedIds.has(resolvedId) || selectedNames.has(payment.patient_name)) && !inPeriod(payment.paid_at, period);
    });
    const filteredPayments = payments.filter((payment) => {
      const resolvedId = payment.patient_id ?? patientByName.get(payment.patient_name) ?? "";
      return (selectedIds.has(resolvedId) || selectedNames.has(payment.patient_name)) && inPeriod(payment.paid_at, period);
    });

    const paidTotal = filteredPayments.reduce((total, payment) => total + Number(payment.amount ?? 0), 0);
    const previousPaidTotal = previousPayments.reduce((total, payment) => total + Number(payment.amount ?? 0), 0);
    const averageAdherence = selectedPatients.reduce((total, patient) => total + Number(patient.adherence ?? 0), 0) / Math.max(selectedPatients.length, 1);
    const pendingExams = filteredExams.filter((exam) => ["pendente", "atenção", "alterado"].includes(String(exam.status ?? "").toLowerCase())).length;
    const doneAppointments = filteredAppointments.filter((appointment) => String(appointment.status ?? "").toLowerCase().includes("realizada")).length;

    const reports = [
      { title: "Pacientes no filtro", value: String(selectedPatients.length), detail: "Cadastros selecionados", bar: Math.min(selectedPatients.length * 12, 100) },
      { title: "Aderência média", value: percent(averageAdherence), detail: "Média dos pacientes", bar: averageAdherence },
      { title: "Receita registrada", value: formatCurrency(paidTotal), detail: `${filteredPayments.length} pagamentos · ${trendLabel(paidTotal, previousPaidTotal)}`, bar: Math.min(filteredPayments.length * 18, 100) },
      { title: "Consultas realizadas", value: String(doneAppointments), detail: `${filteredAppointments.length} consultas · ${trendLabel(filteredAppointments.length, previousAppointments.length)}`, bar: filteredAppointments.length ? (doneAppointments / filteredAppointments.length) * 100 : 0 },
      { title: "Exames pendentes", value: String(pendingExams), detail: `${filteredExams.length} exames no período`, bar: filteredExams.length ? (pendingExams / filteredExams.length) * 100 : 0 },
      { title: "Ticket médio", value: formatCurrency(paidTotal / Math.max(filteredPayments.length, 1)), detail: "Média por pagamento", bar: filteredPayments.length ? 70 : 0 },
    ];

    return { reports, filteredAppointments, filteredExams, filteredPayments, selectedPatients };
  }, [appointments, exams, patientByName, patientId, patients, payments, period]);

  function exportReport() {
    downloadCsv([
      ["Indicador", "Valor", "Detalhe"],
      ...data.reports.map((item) => [item.title, item.value, item.detail]),
      [],
      ["Resumo", "Quantidade"],
      ["Pacientes", data.selectedPatients.length],
      ["Consultas", data.filteredAppointments.length],
      ["Exames", data.filteredExams.length],
      ["Pagamentos", data.filteredPayments.length],
    ]);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
      <div className="mb-5 grid gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 lg:grid-cols-[1fr_220px_160px]">
        <select value={patientId} onChange={(event) => setPatientId(event.target.value)} className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
          <option value="all">Todos os pacientes</option>
          {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
        </select>
        <select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="year">Ano atual</option>
          <option value="all">Tudo</option>
        </select>
        <div className="flex gap-2"><button type="button" onClick={exportReport} className="flex-1 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--primary-hover)]">CSV</button><button type="button" data-testid="report-pdf" onClick={() => window.print()} className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-bold text-[var(--muted-strong)] hover:border-[var(--gold)]">PDF</button></div>
      </div>
      <textarea data-testid="report-observations" value={printObservations} onChange={(event) => setPrintObservations(event.target.value)} rows={2} maxLength={600} placeholder="Observações para incluir no relatório PDF..." className="mb-5 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--gold)]" />

      <div className="grid gap-5 xl:grid-cols-3">
        {data.reports.map((item) => (
          <Card key={item.title} className="p-5">
            <p className="text-sm font-bold text-[var(--muted)]">{item.title}</p>
            <p className="mt-3 text-4xl font-bold text-[var(--heading)]">{item.value}</p>
            <p className="mt-2 text-sm text-[var(--gold-strong)]">{item.detail}</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[var(--border)]">
              <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${Math.max(5, Math.min(item.bar, 100))}%` }} />
            </div>
          </Card>
        ))}
      </div>

      <PrintableDocument
        title="Relatório clínico e gerencial"
        subtitle="Consolidação de indicadores do período selecionado"
        observations={printObservations}
        metadata={[
          { label: "Paciente", value: patientId === "all" ? "Todos os pacientes" : patients.find((patient) => patient.id === patientId)?.name ?? "Paciente" },
          { label: "Período", value: period === "30" ? "Últimos 30 dias" : period === "90" ? "Últimos 90 dias" : period === "year" ? "Ano atual" : "Todo o histórico" },
          { label: "Consultas", value: String(data.filteredAppointments.length) },
          { label: "Exames", value: String(data.filteredExams.length) },
        ]}
      >
        <section className="print-report-grid">
          {data.reports.map((item) => <div key={item.title}><span>{item.title}</span><strong>{item.value}</strong><small>{item.detail}</small></div>)}
        </section>
        <section className="print-meal"><h2>Resumo operacional</h2><table><thead><tr><th>Categoria</th><th>Registros no filtro</th></tr></thead><tbody><tr><td>Pacientes</td><td>{data.selectedPatients.length}</td></tr><tr><td>Consultas</td><td>{data.filteredAppointments.length}</td></tr><tr><td>Exames</td><td>{data.filteredExams.length}</td></tr><tr><td>Pagamentos</td><td>{data.filteredPayments.length}</td></tr></tbody></table></section>
      </PrintableDocument>
    </section>
  );
}


