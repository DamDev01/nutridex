import { AppShell, Card, CardTitle, PageHeader } from '../components/AppShell';
import { SettingsForm } from '../components/SettingsForm';
import { getClinicSettings } from '../lib/dataServer';

export const dynamic = 'force-dynamic';
export default async function ConfiguracoesPage() {
  const settings = await getClinicSettings();
  return <AppShell><PageHeader eyebrow='Configurações' title='Configurações do sistema' description='Ajuste dados da clínica, preferências e política de retenção.' /><section className='mx-auto max-w-7xl px-5 py-6 sm:px-8'><Card><CardTitle title='Preferências persistentes' /><SettingsForm initial={settings} /></Card></section></AppShell>;
}
