export const appointments = [
  { time: "09:00", patient: "Maria Silva", type: "Retorno", goal: "Perda de peso", status: "Confirmada" },
  { time: "11:00", patient: "Bianca Torres", type: "Avaliação", goal: "Reeducação", status: "Pendente" },
  { time: "14:30", patient: "João Santos", type: "Primeira consulta", goal: "Hipertrofia", status: "Confirmada" },
];

export const alerts = [
  { title: "3 pacientes sem retorno ha mais de 30 dias", tone: "danger", detail: "Revisar lista de acompanhamento" },
  { title: "5 avaliacoes de progresso pendentes", tone: "success", detail: "Agende os retornos" },
  { title: "2 planos alimentares vencem hoje", tone: "warning", detail: "Atualizar prescricoes" },
];

export const stats = [
  { label: "Consultas", value: "32", note: "este mês" },
  { label: "Novos pacientes", value: "8", note: "este mês" },
  { label: "Taxa retorno", value: "85%", note: "média mensal" },
  { label: "Objetivos ativos", value: "28", note: "em acompanhamento" },
];

export const patients = [
  { name: "Maria Silva", age: 34, goal: "Emagrecimento", calories: 1800, adherence: 91, next: "Hoje, 09:00", weight: "74,2 kg" },
  { name: "João Santos", age: 29, goal: "Hipertrofia", calories: 2800, adherence: 84, next: "Hoje, 14:30", weight: "82,4 kg" },
  { name: "Bianca Torres", age: 41, goal: "Reeducação", calories: 1950, adherence: 76, next: "Amanhã, 11:00", weight: "68,7 kg" },
];

export const meals = [
  { name: "Café da manhã", time: "07:00", calories: 400, protein: 20, carbs: 45, fat: 15, status: "Registrado" },
  { name: "Lanche manhã", time: "10:00", calories: 180, protein: 12, carbs: 22, fat: 5, status: "Planejado" },
  { name: "Almoço", time: "12:30", calories: 620, protein: 42, carbs: 72, fat: 18, status: "Planejado" },
  { name: "Lanche tarde", time: "16:00", calories: 260, protein: 18, carbs: 28, fat: 8, status: "Planejado" },
  { name: "Jantar", time: "20:00", calories: 520, protein: 35, carbs: 48, fat: 17, status: "Planejado" },
];

export const mealItems = [
  { food: "Pao integral", amount: "2 fatias - 50g", calories: 130 },
  { food: "Ovo cozido", amount: "1 unidade - 50g", calories: 78 },
  { food: "Café com leite desnatado", amount: "1 xícara - 200ml", calories: 92 },
  { food: "Mamao", amount: "1 porção - 120g", calories: 100 },
];

export const foods = [
  { name: "Maçã", category: "Frutas", calories: 52, carbs: 14, protein: 0.3, fat: 0.2, serving: "100g" },
  { name: "Banana", category: "Frutas", calories: 89, carbs: 23, protein: 1.1, fat: 0.3, serving: "100g" },
  { name: "Peito de frango", category: "Proteínas", calories: 165, carbs: 0, protein: 31, fat: 3.6, serving: "100g" },
  { name: "Arroz integral", category: "Carboidratos", calories: 124, carbs: 26, protein: 2.6, fat: 1, serving: "100g" },
  { name: "Abacate", category: "Gorduras", calories: 160, carbs: 9, protein: 2, fat: 15, serving: "100g" },
  { name: "Iogurte natural", category: "Laticínios", calories: 61, carbs: 4.7, protein: 3.5, fat: 3.3, serving: "100g" },
];

export const anthropometry = [
  { label: "Peso", value: "74,2 kg", change: "-1,8 kg" },
  { label: "IMC", value: "26,1", change: "Sobrepeso" },
  { label: "Gordura corporal", value: "28%", change: "-2,1%" },
  { label: "Massa magra", value: "53,4 kg", change: "+0,8 kg" },
];

export const measures = [
  { area: "Cintura", current: "82 cm", previous: "86 cm" },
  { area: "Quadril", current: "101 cm", previous: "103 cm" },
  { area: "Braço", current: "31 cm", previous: "30 cm" },
  { area: "Coxa", current: "58 cm", previous: "59 cm" },
];

export const exams = [
  { name: "Hemograma", date: "12/06/2026", status: "Normal", note: "Sem alterações relevantes" },
  { name: "Glicemia", date: "12/06/2026", status: "Atenção", note: "Levemente elevada" },
  { name: "Vitamina D", date: "20/05/2026", status: "Baixa", note: "Solicitar suplementacao" },
];

export const photos = [
  { date: "01/06/2026", type: "Frente", note: "Inicio do protocolo" },
  { date: "15/06/2026", type: "Lateral", note: "Reducao abdominal visivel" },
  { date: "24/06/2026", type: "Costas", note: "Melhora de postura" },
];

export const notes = [
  { title: "Preferências alimentares", text: "Evita leite integral, aceita iogurte e queijos magros." },
  { title: "Rotina", text: "Treina segunda, quarta e sexta as 18h." },
  { title: "Observação clínica", text: "Relata fome no fim da tarde; ajustar lanche." },
];

export const history = [
  { date: "24/06/2026", patient: "Maria Silva", summary: "Ajuste de macros e revisao de medidas" },
  { date: "10/06/2026", patient: "Maria Silva", summary: "Retorno com boa aderência ao plano" },
  { date: "27/05/2026", patient: "Maria Silva", summary: "Primeira consulta e definicao de metas" },
];

export const finances = [
  { label: "Receita do mês", value: "R$ 8.450", note: "+12% vs mês anterior" },
  { label: "Consultas pagas", value: "28", note: "4 em aberto" },
  { label: "Ticket medio", value: "R$ 302", note: "consultas e retornos" },
];

export const reports = [
  { title: "Aderência média", value: "84%", detail: "Pacientes ativos" },
  { title: "Perda média de peso", value: "1,6 kg", detail: "Últimos 30 dias" },
  { title: "Planos atualizados", value: "22", detail: "Este mês" },
];



