import Link from "next/link";

const patients = [
  { id: 1, name: "Maria Silva", goal: "Perda de Peso", lastVisit: "2025-04-01" },
  { id: 2, name: "João Santos", goal: "Ganho de Massa", lastVisit: "2025-03-15" },
  { id: 3, name: "Ana Oliveira", goal: "Manutenção", lastVisit: "2025-02-10" },
];

export default function Patients() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Lista de Pacientes</h1>
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar ao Dashboard
        </Link>
      </header>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {patients.map((patient) => (
            <li key={patient.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Objetivo: {patient.goal} | Última Visita: {patient.lastVisit}
                </p>
              </div>
              <Link
                href={`/patients/${patient.id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ver Detalhes
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 