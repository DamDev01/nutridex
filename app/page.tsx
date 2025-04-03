import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nutridex - Dashboard</h1>
        <div className="space-x-4">
          <Link href="/patients/new">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              + Novo Paciente
            </button>
          </Link>
          <Link href="/consultations/new">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              + Nova Consulta
            </button>
          </Link>
        </div>
      </header>

      {/* Grid do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Consultas de Hoje */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Consultas de Hoje</h2>
          <ul className="space-y-4">
            <li className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium">09:00 - Maria Silva</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Retorno - Perda de Peso</p>
            </li>
            <li className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium">14:30 - João Santos</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Primeira Consulta</p>
            </li>
          </ul>
        </div>

        {/* Avisos Importantes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Avisos Importantes</h2>
          <div className="space-y-4">
            <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                3 pacientes sem retorno há mais de 30 dias
              </p>
              <Link href="/patients" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Clique para ver detalhes
              </Link>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                5 avaliações de progresso pendentes
              </p>
              <Link href="/patients" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Agende os retornos
              </Link>
            </div>
          </div>
        </div>

        {/* Estatísticas do Mês */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Estatísticas do Mês</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-2xl font-bold">32</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Consultas (Este mês)</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-2xl font-bold">8</p>
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

        {/* Próximos Retornos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Próximos Retornos</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm">5 retornos agendados para a semana</p>
            <Link href="/schedule" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Ver agenda completa →
            </Link>
          </div>
        </div>

        {/* Metas em Andamento */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Metas em Andamento</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm">12 pacientes em acompanhamento de peso</p>
            <Link href="/patients" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Ver detalhes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}