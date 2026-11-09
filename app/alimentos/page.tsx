import { AppShell, PageHeader } from "../components/AppShell";
import { FoodsBrowser } from "../components/FoodsBrowser";
import { FoodSourceNote } from "../components/FoodSourceNote";
import { getFoods } from "../lib/dataServer";

export const dynamic = "force-dynamic";

export default async function AlimentosPage() {
  const foods = await getFoods();

  return (
    <AppShell footerNote={<FoodSourceNote />}>
      <PageHeader eyebrow="Biblioteca nutricional" title="Alimentos e receitas" description="Encontre o alimento, compare os nutrientes e leve a porção certa para o plano." action="+ Novo item" />
      <FoodsBrowser foods={foods} />
    </AppShell>
  );
}

