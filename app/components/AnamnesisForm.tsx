'use client';

import { useState, type FormEvent } from 'react';
import type { DbPatient } from '../lib/dataServer';

const fields = [
  ['chief_complaint', 'Queixa principal'], ['food_history', 'Histórico alimentar'],
  ['pathologies', 'Patologias'], ['medications', 'Medicamentos'],
  ['sleep_notes', 'Sono'], ['physical_activity', 'Atividade física'],
] as const;

export function AnamnesisForm({ patients }: { patients: DbPatient[] }) {
  const [feedback, setFeedback] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFeedback('Salvando...');
    const form = event.currentTarget; const data: Record<string, unknown> = Object.fromEntries(new FormData(form));
    const select = form.elements.namedItem('patient_id') as HTMLSelectElement;
    data.patient_name = select.options[select.selectedIndex]?.dataset.name ?? '';
    data.consent = Boolean((form.elements.namedItem('consent') as HTMLInputElement).checked);
    const response = await fetch('/api/anamneses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json(); setFeedback(result.ok ? 'Anamnese salva no banco.' : result.error ?? 'Não foi possível salvar.');
    if (result.ok) form.reset();
  }
  return <form onSubmit={submit} className='p-5'><label className='block space-y-2'><span className='text-sm font-bold'>Paciente</span><select name='patient_id' required className='h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3'><option value=''>Selecione</option>{patients.map((p) => <option key={p.id} value={p.id} data-name={p.name}>{p.name}</option>)}</select></label><div className='mt-4 grid gap-4 xl:grid-cols-2'>{fields.map(([name, label]) => <label key={name} className='space-y-2'><span className='text-sm font-bold text-[var(--muted-strong)]'>{label}</span><textarea name={name} maxLength={4000} className='min-h-28 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm' /></label>)}</div><label className='mt-4 flex items-start gap-3 rounded-md border border-[var(--border)] p-4 text-sm'><input name='consent' type='checkbox' required className='mt-1' /><span>Confirmo que o paciente autorizou o registro e tratamento destes dados clínicos.</span></label><div className='mt-5 flex items-center gap-4'><button className='rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white'>Salvar anamnese</button><span className='text-sm font-semibold'>{feedback}</span></div></form>;
}
