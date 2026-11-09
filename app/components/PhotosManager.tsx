"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";

import { Card, CardTitle } from "./AppShell";
import { RecordActions } from "./RecordActions";
import type { DbPatient, DbPhoto } from "../lib/dataServer";

type PhotosManagerProps = {
  patients: DbPatient[];
  photos: DbPhoto[];
};

function formatDate(value: string | null | undefined) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function PhotosManager({ patients, photos }: PhotosManagerProps) {
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const [filterPatient, setFilterPatient] = useState("Todos");
  const [filterAngle, setFilterAngle] = useState("Todos");
  const [preview, setPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  const selectedPatient = patients.find((patient) => patient.id === patientId);
  const angles = useMemo(() => ["Todos", ...Array.from(new Set(photos.map((photo) => photo.angle).filter(Boolean))) as string[]], [photos]);
  const filteredPhotos = photos.filter((photo) => {
    const byPatient = filterPatient === "Todos" || photo.patient_id === filterPatient;
    const byAngle = filterAngle === "Todos" || photo.angle === filterAngle;
    return byPatient && byAngle;
  });
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / pageSize));
  const visiblePhotos = filteredPhotos.slice((Math.min(page, totalPages) - 1) * pageSize, Math.min(page, totalPages) * pageSize);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3000);
  }

  async function uploadPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");

    if (!selectedPatient) {
      showFeedback("Selecione um paciente.");
      return;
    }
    if (!(file instanceof File) || !file.size) {
      showFeedback("Selecione uma imagem.");
      return;
    }

    formData.set("patient_id", selectedPatient.id);
    formData.set("patient_name", selectedPatient.name);
    setSaving(true);

    try {
      const response = await fetch("/api/photos", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível enviar a fotografia.");

      form.reset();
      setPreview(null);
      window.location.reload();
      showFeedback("Fotografia enviada.");
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : "Erro ao enviar fotografia.");
    } finally {
      setSaving(false);
    }
  }

  function updatePreview(file: File | undefined) {
    if (!file) {
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-[320px_1fr]">
      <Card className="h-fit">
        <CardTitle title="Enviar fotografia" subtitle="JPG, PNG ou WEBP até 10 MB" />
        <form onSubmit={uploadPhoto} className="space-y-4 p-5">
          <label className="space-y-2 block">
            <span className="text-sm font-bold text-[var(--muted-strong)]">Paciente</span>
            <select value={patientId} onChange={(event) => setPatientId(event.target.value)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" required>
              {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
            </select>
          </label>
          <label className="space-y-2 block">
            <span className="text-sm font-bold text-[var(--muted-strong)]">Ângulo</span>
            <select name="angle" className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]" required>
              <option>Frente</option>
              <option>Costas</option>
              <option>Lateral direita</option>
              <option>Lateral esquerda</option>
              <option>Detalhe</option>
            </select>
          </label>
          <label className="space-y-2 block">
            <span className="text-sm font-bold text-[var(--muted-strong)]">Imagem</span>
            <input name="file" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => updatePreview(event.target.files?.[0])} className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm" required />
          </label>
          {preview ? <div className="relative h-52 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface-soft)]"><Image src={preview} alt="Prévia da fotografia" fill className="object-cover" unoptimized /></div> : null}
          <label className="space-y-2 block">
            <span className="text-sm font-bold text-[var(--muted-strong)]">Observação</span>
            <textarea name="note" className="min-h-24 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm outline-none focus:border-[var(--gold)]" placeholder="Observação do registro" />
          </label>
          <label className="flex items-start gap-3 rounded-md border border-[var(--border)] p-3 text-sm"><input name="consent" value="accepted" type="checkbox" required className="mt-1" /><span>Confirmo o consentimento específico do paciente para armazenar esta fotografia.</span></label>
          <button type="submit" disabled={saving || !patients.length} className="w-full rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-70">{saving ? "Enviando..." : "Enviar fotografia"}</button>
          {feedback ? <p className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm font-semibold text-[var(--text)]">{feedback}</p> : null}
        </form>
      </Card>

      <Card>
        <CardTitle title="Evolução fotográfica" subtitle={`${filteredPhotos.length} registro(s)`} />
        <div className="grid gap-3 border-b border-[var(--border)] p-5 md:grid-cols-2">
          <select value={filterPatient} onChange={(event) => setFilterPatient(event.target.value)} className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
            <option>Todos</option>
            {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
          </select>
          <select value={filterAngle} onChange={(event) => setFilterAngle(event.target.value)} className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm outline-none focus:border-[var(--gold)]">
            {angles.map((angle) => <option key={angle} value={angle}>{angle}</option>)}
          </select>
        </div>
        <div className="grid gap-5 p-5 lg:grid-cols-2 2xl:grid-cols-3">
          {visiblePhotos.map((photo) => (
            <article key={photo.id} className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface-soft)]">
              <div className="relative h-64 bg-[var(--header-bg)]">
                {photo.file_url ? <Image src={photo.file_url} alt={photo.file_name ?? "Fotografia corporal"} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" unoptimized /> : <div className="grid h-full place-items-center p-4 text-sm font-bold text-[var(--muted-strong)]">{photo.file_name ?? "Sem imagem"}</div>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="font-bold">{photo.angle ?? "Ângulo"}</p><p className="text-xs font-bold text-[var(--gold-strong)]">{formatDate(photo.created_at)}</p></div><span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--gold-strong)]">{photo.patient_name ?? "Paciente"}</span></div>
                <p className="mt-3 text-sm text-[var(--muted-strong)]">{photo.note ?? "Sem observação"}</p>
                <RecordActions endpoint={`/api/photos/${photo.id}`} title="Fotografia" hidden={{ patient_id: photo.patient_id, patient: photo.patient_name, Paciente: photo.patient_name }} fields={[{ label: "Paciente", name: "Paciente", value: photo.patient_name, required: true }, { label: "Ângulo", name: "Ângulo", value: photo.angle, options: ["Frente", "Costas", "Lateral direita", "Lateral esquerda", "Detalhe"], required: true }, { label: "Observação", name: "Observação", value: photo.note, textarea: true }]} />
              </div>
            </article>
          ))}
          {!filteredPhotos.length ? <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-5 text-sm font-semibold text-[var(--muted-strong)] lg:col-span-2">Nenhuma fotografia encontrada.</div> : null}
        </div>
        {totalPages > 1 ? <div className="flex justify-center gap-2 border-t border-[var(--border)] p-4">{Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <button key={item} type="button" onClick={() => setPage(item)} className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${item === page ? "bg-[var(--primary)] text-white" : "border border-[var(--border)]"}`}>{item}</button>)}</div> : null}
      </Card>
    </section>
  );
}
