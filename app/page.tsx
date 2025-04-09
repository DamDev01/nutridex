import Link from "next/link";

async function fetchConsultations() {
  try {
    const res = await fetch("http://localhost:3000/api/consultations", { cache: "no-store" });
    if (!res.ok) return null; // Retorna null em caso de erro
    return res.json();
  } catch (error) {
    console.error("Erro ao carregar consultas:", error);
    return null;
  }
}

async function fetchPatients() {
  try {
    const res = await fetch("http://localhost:3000/api/patients", { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Erro ao carregar pacientes:", error);
    return null;
  }
}

export default async function Dashboard() {
  const consultations = await fetchConsultations();
  const patients = await fetchPatients();

  // Filtrar consultas de hoje (simulação)
  const today = "2025-04-03"; // Substitua por uma lógica real de data
  const todayConsultations = consultations ? consultations.filter((c: any) => c.date === today) : [];

  // Simular avisos importantes
  const overduePatients = patients ? patients.length - 2 : 0; // Simulação
  const pendingEvaluations = consultations ? consultations.length - 1 : 0; // Simulação

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-foreground mb-8">Nutridex - Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Consultas de Hoje</h2>
          <ul className="space-y-4">
            {todayConsultations.length > 0 ? (
              todayConsultations.map((consultation: any) => (
                <li key={consultation.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium">
                    {consultation.time} - {consultation.patient}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.type}</p>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {consultations === null ? "Erro ao carregar consultas." : "Nenhuma consulta hoje."}
              </p>
            )}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Avisos Importantes</h2>
          <div className="space-y-4">
            <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                {overduePatients} pacientes sem retorno há mais de 30 dias
              </p>
              <Link href="/patients" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Clique para ver detalhes
              </Link>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                {pendingEvaluations} avaliações de progresso pendentes
              </p>
              <Link href="/patients" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Agende os retornos
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Estatísticas do Mês</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-2xl font-bold">{consultations ? consultations.length : 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Consultas (Este mês)</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-2xl font-bold">{patients ? patients.length : 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Novos Pacientes (Este mês)</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Retorno (Média mensal)</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-2xl font-bold">20</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Objetivos Alcançados</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Próximos Retornos</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm">{consultations ? consultations.length : 0} retornos agendados para a semana</p>
            <Link href="/schedule" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Ver agenda completa →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Metas em Andamento</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm">{patients ? patients.length : 0} pacientes em acompanhamento de peso</p>
            <Link href="/patients" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Ver detalhes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}