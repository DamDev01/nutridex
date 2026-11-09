'use client';

import { useState, type FormEvent } from 'react';
import type { DbClinicSettings } from '../lib/dataServer';

export function SettingsForm({ initial }: { initial: DbClinicSettings | null }) {
  const [feedback, setFeedback] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFeedback('Salvando...');
    const form = event.currentTarget; const data: Record<string, unknown> = Object.fromEntries(new FormData(form));
    data.notifications_enabled = Boolean((form.elements.namedItem('notifications_enabled') as HTMLInputElement).checked);
    const response = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json(); setFeedback(result.ok ? 'Configurações salvas no banco.' : result.error ?? 'Não foi possível salvar.');
  }
  const input = 'h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3';
  return <form onSubmit={submit} className='grid gap-4 p-5 sm:grid-cols-2'><label className='space-y-2'><span className='text-sm font-bold'>Nome da clínica</span><input name='clinic_name' defaultValue={initial?.clinic_name ?? ''} className={input} /></label><label className='space-y-2'><span className='text-sm font-bold'>E-mail</span><input name='contact_email' type='email' defaultValue={initial?.contact_email ?? ''} className={input} /></label><label className='space-y-2'><span className='text-sm font-bold'>Telefone</span><input name='contact_phone' defaultValue={initial?.contact_phone ?? ''} className={input} /></label><label className='space-y-2'><span className='text-sm font-bold'>Horários</span><input name='business_hours' defaultValue={initial?.business_hours ?? ''} className={input} /></label><label className='space-y-2'><span className='text-sm font-bold'>Retenção dos dados (meses)</span><input name='data_retention_months' type='number' min='1' max='240' defaultValue={initial?.data_retention_months ?? 60} className={input} /></label><label className='flex items-center gap-3 pt-7'><input name='notifications_enabled' type='checkbox' defaultChecked={initial?.notifications_enabled ?? true} /><span className='font-semibold'>Notificações habilitadas</span></label><div className='flex items-center gap-4 sm:col-span-2'><button className='rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white'>Salvar alterações</button><span className='text-sm font-semibold'>{feedback}</span></div></form>;
}
