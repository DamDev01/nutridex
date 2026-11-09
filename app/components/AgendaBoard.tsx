"use client";

import { useMemo, useState } from "react";
import { Card, CardTitle } from "./AppShell";
import { RecordActions } from "./RecordActions";
import type { DbAppointment } from "../lib/dataServer";

type AgendaBoardProps = {
  appointments: DbAppointment[];
};

function formatDate(value: string | null | undefined) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function formatTime(value: string | null | undefined) {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 5);
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);
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

function isSameDay(value: string, reference: Date) {
  const date = new Date(value);
  return date.toDateString() === reference.toDateString();
}

function isSameWeek(value: string, reference: Date) {
  const date = new Date(value);
  const start = new Date(reference);
  start.setDate(reference.getDate() - reference.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

function isSameMonth(value: string, reference: Date) {
  const date = new Date(value);
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
}

export function AgendaBoard({ appointments }: AgendaBoardProps) {
  const [period, setPeriod] = useState("week");
  const [status, setStatus] = useState("Todos");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const now = new Date();

    return appointments.filter((item) => {
      const byPeriod = period === "all" ||
        (period === "today" && isSameDay(item.scheduled_at, now)) ||
        (period === "week" && isSameWeek(item.scheduled_at, now)) ||
        (period === "month" && isSameMonth(item.scheduled_at, now));
      const byStatus = status === "Todos" || item.status === status;
      const bySearch = !normalized || [item.patient_name, item.type, item.goal].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalized));
      return byPeriod && byStatus && bySearch;
    });
  }, [appointments, period, query, status]);

  return (
    <Card>
      <CardTitle title="Linha do tempo" subtitle={`${filtered.length} de ${appointments.length} consulta(s)`} />
      <div className="grid gap-3 border-b border-[var(--border)] p-5 lg:grid-cols-[1fr_180px_180px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar paciente, tipo ou objetivo" className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" />
        <select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
          <option value="today">Hoje</option>
          <option value="week">Semana</option>
          <option value="month">Mês</option>
          <option value="all">Todas</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
          <option>Todos</option>
          <option>Pendente</option>
          <option>Confirmada</option>
          <option>Realizada</option>
          <option>Cancelada</option>
        </select>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {filtered.map((item) => (
          <div key={item.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[120px_1fr_170px_150px]">
            <div><p className="font-bold text-[var(--gold-strong)]">{formatTime(item.scheduled_at)}</p><p className="text-xs text-[var(--muted)]">{formatDate(item.scheduled_at)}</p></div>
            <div><p className="font-bold">{item.patient_name}</p><p className="text-sm text-[var(--muted)]">{item.type ?? "Consulta"} - {item.goal ?? "Acompanhamento"}</p></div>
            <span className="h-fit w-fit rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--gold-strong)]">{item.status ?? "Pendente"}</span>
            <RecordActions endpoint={`/api/appointments/${item.id}`} title="Consulta" hidden={{ patient_id: item.patient_id, patient: item.patient_name, Paciente: item.patient_name }} fields={[{ label: "Data", name: "Data", type: "date", value: inputDate(item.scheduled_at), required: true }, { label: "Horário", name: "Horário", type: "time", value: inputTime(item.scheduled_at), required: true }, { label: "Paciente", name: "Paciente", value: item.patient_name, required: true }, { label: "Tipo", name: "Tipo", value: item.type, options: ["Primeira consulta", "Retorno", "Acompanhamento", "Online"], required: true }, { label: "Objetivo", name: "Objetivo", value: item.goal }, { label: "Status", name: "Status", value: item.status, options: ["Pendente", "Confirmada", "Realizada", "Cancelada"] }]} />
          </div>
        ))}
        {!filtered.length ? <div className="p-5 text-sm font-semibold text-[var(--muted-strong)]">Nenhuma consulta encontrada para os filtros atuais.</div> : null}
      </div>
    </Card>
  );
}
