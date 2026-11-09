import { AppShell, Card, CardTitle, PageHeader } from "../../components/AppShell";
import { PatientForm } from "../../components/PatientForm";

export default function NovoPacientePage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Novo paciente" title="Cadastro de paciente" description="Tela de registro inicial com dados pessoais, objetivo e informações de acompanhamento." />
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <Card>
          <CardTitle title="Dados cadastrais" />
          <PatientForm />
        </Card>
      </section>
    </AppShell>
  );
}

