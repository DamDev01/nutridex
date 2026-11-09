import { AppShell, PageHeader } from "../components/AppShell";
import { PhotosManager } from "../components/PhotosManager";
import { getPatients, getPhotos } from "../lib/dataServer";

export const dynamic = "force-dynamic";

export default async function FotografiasPage() {
  const [patients, photos] = await Promise.all([getPatients(), getPhotos()]);

  return (
    <AppShell>
      <PageHeader eyebrow="Fotografias" title="Evolução fotográfica" description="Organize registros fotográficos por paciente, data, ângulo e observação." />
      <PhotosManager patients={patients} photos={photos} />
    </AppShell>
  );
}
