import { AppShell, Card, CardTitle, PageHeader } from '../components/AppShell';
import { AnamnesisForm } from '../components/AnamnesisForm';
import { formatDate, getAnamneses, getPatients } from '../lib/dataServer';

export const dynamic = 'force-dynamic';
export default async function AnamnesePage() {
  const [patients, records] = await Promise.all([getPatients(), getAnamneses()]);
  return <AppShell><PageHeader eyebrow='Anamnese' title='Ficha de anamnese nutricional' description='Registro estruturado do histórico clínico, rotina, sintomas e preferências alimentares.' /><section className='mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8'><Card><CardTitle title='Questionário' subtitle='Selecione o paciente e registre o consentimento' /><AnamnesisForm patients={patients} /></Card><Card><CardTitle title='Histórico de anamneses' subtitle={`${records.length} registro(s)`} /><div className='grid gap-4 p-5 md:grid-cols-2'>{records.map((record) => <article key={record.id} className='rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-4'><div className='flex justify-between gap-3'><strong>{record.patient_name ?? 'Paciente'}</strong><span className='text-xs text-[var(--gold-strong)]'>{formatDate(record.created_at)}</span></div><p className='mt-3 text-sm text-[var(--muted)]'>{record.chief_complaint ?? 'Sem queixa principal'}</p><p className='mt-2 text-xs font-semibold'>{record.consent_recorded_at ? 'Consentimento registrado' : 'Sem consentimento'}</p></article>)}{!records.length ? <p className='text-sm text-[var(--muted)]'>Nenhuma anamnese registrada.</p> : null}</div></Card></section></AppShell>;
}
