const baseUrl = process.env.NUTRIDEX_TEST_URL || "http://localhost:3027";

async function request(method, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(`${method} ${path} failed: ${result.error || response.statusText}`);
  }
  return result;
}

async function assertPage(path) {
  const response = await fetch(`${baseUrl}${path}`, { method: "HEAD" });
  if (!response.ok) throw new Error(`Page ${path} returned ${response.status}`);
}

async function createPatchDelete({ name, post, patch, create, update }) {
  const created = await request("POST", post, create);
  const id = created.data[0].id;
  await request("PATCH", patch.replace("ID", id), update);
  await request("DELETE", patch.replace("ID", id));
  return `${name}:ok`;
}

async function main() {
  const patient = await request("POST", "/api/patients", {
    Nome: "Paciente Teste Automatizado",
    Email: "teste-api@nutridex.local",
    Idade: 32,
    Objetivo: "Teste CRUD",
    Peso: 72,
    Altura: 1.72,
  });
  const patientId = patient.data[0].id;
  const patientName = patient.data[0].name;

  try {
    const cases = [
      {
        name: "appointments",
        post: "/api/appointments",
        patch: "/api/appointments/ID",
        create: { patient_id: patientId, Paciente: patientName, Data: "2026-08-10", Horário: "09:00", Tipo: "Retorno", Status: "Pendente" },
        update: { patient_id: patientId, Paciente: patientName, Data: "2026-08-11", Horário: "10:00", Tipo: "Acompanhamento", Status: "Confirmada" },
      },
      {
        name: "clinical-notes",
        post: "/api/clinical-notes",
        patch: "/api/clinical-notes/ID",
        create: { patient_id: patientId, Paciente: patientName, Título: "Nota teste", Nota: "Inicial" },
        update: { patient_id: patientId, Paciente: patientName, Título: "Nota teste editada", Nota: "Editada" },
      },
      {
        name: "exams",
        post: "/api/exams",
        patch: "/api/exams/ID",
        create: { patient_id: patientId, Paciente: patientName, Exame: "Hemograma", Data: "2026-08-10", Status: "Pendente" },
        update: { patient_id: patientId, Paciente: patientName, Exame: "Hemograma editado", Data: "2026-08-11", Status: "Normal" },
      },
      {
        name: "anthropometry",
        post: "/api/anthropometry",
        patch: "/api/anthropometry/ID",
        create: { patient_id: patientId, Paciente: patientName, Peso: 72, Altura: 1.72, "Gordura corporal": 20, "Massa magra": 56 },
        update: { patient_id: patientId, Paciente: patientName, Peso: 71, Altura: 1.72, "Gordura corporal": 19, "Massa magra": 57 },
      },
      {
        name: "body-measures",
        post: "/api/body-measures",
        patch: "/api/body-measures/ID",
        create: { patient_id: patientId, Paciente: patientName, Cintura: 80, Quadril: 96, Braço: 30, Coxa: 55 },
        update: { patient_id: patientId, Paciente: patientName, Cintura: 79, Quadril: 95, Braço: 31, Coxa: 56 },
      },
      {
        name: "payments",
        post: "/api/payments",
        patch: "/api/payments/ID",
        create: { patient_id: patientId, Paciente: patientName, Valor: 150, "Forma de pagamento": "Pix", Status: "Pago" },
        update: { patient_id: patientId, Paciente: patientName, Valor: 175, "Forma de pagamento": "Cartão de crédito", Status: "Pago" },
      },
      {
        name: "foods",
        post: "/api/foods",
        patch: "/api/foods/ID",
        create: { Nome: "Alimento Teste Automatizado", Categoria: "Receitas", Calorias: 120, Carboidratos: 12, Proteínas: 8, Gorduras: 3, Porção: "100g" },
        update: { Nome: "Alimento Teste Automatizado Editado", Categoria: "Receitas", Calorias: 130, Carboidratos: 13, Proteínas: 9, Gorduras: 4, Porção: "120g" },
      },
      {
        name: "photos-metadata",
        post: "/api/photos",
        patch: "/api/photos/ID",
        create: { patient_id: patientId, Paciente: patientName, Ângulo: "Frente", Observação: "Foto metadado", fileName: "teste.jpg", fileUrl: "" },
        update: { patient_id: patientId, Paciente: patientName, Ângulo: "Costas", Observação: "Editada" },
      },
    ];

    for (const testCase of cases) {
      await createPatchDelete(testCase);
    }

    const plan = await request("POST", "/api/meal-plans", { patient_id: patientId, patient_name: patientName, title: "Plano teste", status: "Ativo" });
    const planId = plan.data[0].id;
    const item = await request("POST", "/api/meal-plan-items", { meal_plan_id: planId, meal_name: "Almoço", food_name: "Arroz", amount: "100g", calories: 120, protein: 3, carbs: 25, fat: 1 });
    const itemId = item.data[0].id;
    await request("PATCH", `/api/meal-plan-items/${itemId}`, { meal_name: "Jantar", food_name: "Arroz editado", amount: "120g", calories: 140, protein: 4, carbs: 28, fat: 1 });
    await request("DELETE", `/api/meal-plan-items/${itemId}`);
    await request("DELETE", `/api/meal-plans/${planId}`);

    await Promise.all(["/agenda", "/plano-alimentar", "/relatorios", "/fotografias"].map(assertPage));
  } finally {
    await request("DELETE", `/api/patients/${patientId}`);
  }

  console.log("API CRUD smoke test passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

