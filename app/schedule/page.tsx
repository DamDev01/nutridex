import Link from "next/link";

const schedule = [
  { id: 1, date: "2025-04-03", time: "09:00", patient: "Maria Silva", type: "Retorno" },
  { id: 2, date: "2025-04-03", time: "14:30", patient: "João Santos", type: "Primeira Consulta" },
  { id: 3, date: "2025-04-04", time: "10:00", patient: "Ana Oliveira", type: "Retorno" },
];

export default function Schedule() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Agenda Completa</h1>
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar ao Dashboard
        </Link>
      </header>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {schedule.map((consultation) => (
            <li key={consultation.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium">
                {consultation.date} às {consultation.time} - {consultation.patient}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.type}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}