import { AppShell, PageHeader } from "../components/AppShell";
import { CalculadorasClient } from "../components/CalculadorasClient";

export default function CalculadorasPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Calculadoras"
        title="Calculadoras nutricionais e clínicas"
        description="Todas as calculadoras do arquivo original, com a logica preservada e visual adaptado ao Nutridex."
      />
      <CalculadorasClient />
    </AppShell>
  );
}
