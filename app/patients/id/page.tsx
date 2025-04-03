import Link from "next/link";

// Simulação de dados (em um projeto real, isso viria de uma API ou banco de dados)
const patientData = {
  1: {
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "1234-5678",
    goal: "Perda de Peso",
    consultations: [
      { date: "2025-04-01", type: "Retorno", notes: "Progresso de 2kg" },
      { date: "2025-03-01", type: "Primeira Consulta", notes: "Plano inicial definido" },
    ],
  },
  2: {
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "8765-4321",
    goal: "Ganho de Massa",
    consultations: [{ date: "2025-03-15", type: "Primeira Consulta", notes: "Plano de treino iniciado" }],
  },
  3: {
    name: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    phone: "5678-1234",
    goal: "Manutenção",
    consultations: [{ date: "2025-02-10", type: "Retorno", notes: "Manutenção estável" }],
  },
} as const;

// Definir o tipo das chaves de patientData
type PatientId = keyof typeof patientData;

export default function PatientDetails({ params }: { params: { id: string } }) {
  // Converter params.id (string) para número
  const id = Number(params.id);

  // Verificar se o id é uma chave válida de patientData
  const patient = (id as PatientId) in patientData ? patientData[id as PatientId] : null;

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-foreground">Paciente não encontrado</h1>
        <Link href="/patients" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar à Lista de Pacientes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Detalhes do Paciente</h1>
        <Link href="/patients" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar à Lista de Pacientes
        </Link>
      </header>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{patient.name}</h2>
        <div className="space-y-4">
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Telefone:</strong> {patient.phone}</p>
          <p><strong>Objetivo:</strong> {patient.goal}</p>
          <h3 className="text-lg font-semibold mt-6">Histórico de Consultas</h3>
          <ul className="space-y-4">
            {patient.consultations.map((consultation, index) => (
              <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium">{consultation.date} - {consultation.type}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.notes}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}