import { AppShell, PageHeader } from "../components/AppShell";
import { MealPlanBuilder } from "../components/MealPlanBuilder";
import { FoodSourceNote } from "../components/FoodSourceNote";
import { getMealPlanData } from "../lib/dataServer";

export const dynamic = "force-dynamic";

type PlanoAlimentarPageProps = {
  searchParams: Promise<{ patient?: string; food?: string }>;
};

export default async function PlanoAlimentarPage({ searchParams }: PlanoAlimentarPageProps) {
  const { patient, food } = await searchParams;
  const data = await getMealPlanData(patient);

  return (
    <AppShell footerNote={<FoodSourceNote />}>
      <PageHeader eyebrow="Plano alimentar" title="Plano alimentar do paciente" description="Selecione um paciente, organize refeições e acompanhe os totais nutricionais em um só lugar." />
      <MealPlanBuilder patients={data.patients} selectedPatient={data.selectedPatient} plan={data.plan} items={data.items} foods={data.foods} initialFoodId={food} />
    </AppShell>
  );
}
