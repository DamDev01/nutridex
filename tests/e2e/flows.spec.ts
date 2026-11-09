import { expect, test, type APIRequestContext } from "@playwright/test";

const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const patientName = `E2E NutriDex ${runId}`;
let patientId = "";
let foodId = "";
let planId = "";
let photoId = "";

async function create(request: APIRequestContext, endpoint: string, payload: object) {
  const response = await request.post(endpoint, { data: payload });
  expect(response.ok(), await response.text()).toBeTruthy();
  const body = await response.json();
  expect(body.ok).toBeTruthy();
  return body.data?.[0];
}

test.describe.serial("fluxos clínicos", () => {
  test.beforeAll(async ({ request }) => {
    const patient = await create(request, "/api/patients", { name: patientName, email: `e2e-${runId}@example.test`, goal: "Teste automatizado", calories: 2000, weight: 70, height: 1.7 });
    const food = await create(request, "/api/foods", { name: `Alimento E2E ${runId}`, category: "Teste", serving: "100 g", calories: 120, protein: 10, carbs: 15, fat: 2 });
    patientId = patient.id;
    foodId = food.id;
  });

  test.afterAll(async ({ request }) => {
    if (photoId) await request.delete(`/api/photos/${photoId}`);
    if (planId) await request.delete(`/api/meal-plans/${planId}`);
    if (foodId) await request.delete(`/api/foods/${foodId}`);
    if (patientId) await request.delete(`/api/patients/${patientId}`);
  });

  test("criar paciente pela interface", async ({ page, request }) => {
    const name = `Cadastro visual ${runId}`;
    await page.goto("/pacientes/novo");
    await page.getByLabel("Nome").fill(name);
    await page.getByLabel("Email").fill(`visual-${runId}@example.test`);
    await page.getByLabel("Objetivo").fill("Acompanhamento E2E");
    await page.getByRole("button", { name: "Salvar paciente" }).click();
    await expect(page.getByText("Paciente salvo no banco.")).toBeVisible();
    await expect(page).toHaveURL(/\/pacientes$/);

    const response = await request.get("/api/patients");
    const body = await response.json();
    const created = body.data.find((item: { name: string }) => item.name === name);
    expect(created).toBeTruthy();
    await request.delete(`/api/patients/${created.id}`);
  });

  test("montar plano alimentar e validar documento", async ({ page }) => {
    await page.goto(`/plano-alimentar?patient=${patientId}`);
    const createButton = page.getByRole("button", { name: "Criar plano alimentar" });
    if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page.getByText("Plano alimentar criado.")).toBeVisible();
      await page.reload();
    }
    const plans = await page.request.get("/api/meal-plans");
    const body = await plans.json();
    planId = body.data.find((item: { patient_id: string }) => item.patient_id === patientId)?.id ?? "";

    await page.locator('select[name="foodId"]').selectOption(foodId);
    await page.locator('input[name="amount"]').fill("150 g");
    await page.getByRole("button", { name: "Adicionar" }).click();
    await expect(page.getByRole("paragraph").filter({ hasText: `Alimento E2E ${runId}` })).toBeVisible();
    await page.getByTestId("meal-plan-observations").fill("Orientação validada pelo teste E2E.");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".print-document")).toBeVisible();
    await expect(page.locator(".print-document")).toContainText(patientName);
    await page.pdf({ path: `test-results/plano-${runId}.pdf`, format: "A4", printBackground: true });
  });

  test("subir fotografia vinculada ao paciente", async ({ page }) => {
    await page.goto("/fotografias");
    await page.locator("form select").first().selectOption(patientId);
    await page.getByLabel("Imagem").setInputFiles({ name: "e2e-photo.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64") });
    await page.getByLabel("Observação").fill(`Foto E2E ${runId}`);
    await page.getByText("Confirmo o consentimento específico").click();
    await page.getByRole("button", { name: "Enviar fotografia" }).click();
    await expect(page.getByText("Fotografia enviada.")).toBeVisible();
    await page.reload();
    await expect(page.getByText(`Foto E2E ${runId}`)).toBeVisible();

    const photos = await page.request.get("/api/photos");
    const body = await photos.json();
    photoId = body.data.find((item: { note: string }) => item.note === `Foto E2E ${runId}`)?.id ?? "";
    expect(photoId).not.toBe("");
  });

  test("salvar e listar anamnese com consentimento", async ({ page }) => {
    await page.goto("/anamnese");
    await page.locator('select[name="patient_id"]').selectOption(patientId);
    await page.getByLabel("Queixa principal").fill(`Queixa E2E ${runId}`);
    await page.getByText("Confirmo que o paciente autorizou").click();
    await page.getByRole("button", { name: "Salvar anamnese" }).click();
    await expect(page.getByText("Anamnese salva no banco.")).toBeVisible();
    await page.reload();
    await expect(page.getByText(`Queixa E2E ${runId}`)).toBeVisible();
  });

  test("exportar dados do paciente", async ({ request }) => {
    const response = await request.get(`/api/privacy/patients/${patientId}/export`);
    expect(response.ok(), await response.text()).toBeTruthy();
    const body = await response.json();
    expect(body.ok).toBeTruthy();
    expect(body.data.patient.id).toBe(patientId);
    expect(body.data.anamneses.length).toBeGreaterThan(0);
  });

  test("gerar relatório profissional", async ({ page }) => {
    await page.goto("/relatorios");
    await page.locator("select").first().selectOption(patientId);
    await page.getByTestId("report-observations").fill("Relatório revisado e validado.");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".print-document")).toBeVisible();
    await expect(page.locator(".print-document")).toContainText(patientName);
    await page.pdf({ path: `test-results/relatorio-${runId}.pdf`, format: "A4", printBackground: true });
  });
});
