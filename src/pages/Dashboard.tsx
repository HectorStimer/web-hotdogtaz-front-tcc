import { useEffect, useState } from 'react'
import { getCommandsSummary } from '../services/command.service'
import { getQueue } from '../services/request.service'
import type { Request } from '../types/request'

type Summary = {
  total: number
  open: number
  completed: number
}

const STATUS_COLORS: Record<string, string> = {
  CREATED: 'bg-yellow-100 text-yellow-700',
  IN_PREPARATION: 'bg-blue-100 text-blue-700',
  READY: 'bg-green-100 text-green-700',
}

const STATUS_LABELS: Record<string, string> = {
  CREATED: 'Novo',
  IN_PREPARATION: 'Em preparo',
  READY: 'Pronto',
}

function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [queue, setQueue] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getCommandsSummary(),
      getQueue(),
    ])
      .then(([summaryData, queueData]) => {
        setSummary(summaryData)
        setQueue(queueData)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando...</p>

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-1">
          <p className="text-sm text-gray-500">Total de Comandas</p>
          <p className="text-3xl font-bold">{summary?.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-1">
          <p className="text-sm text-gray-500">Comandas Abertas</p>
          <p className="text-3xl font-bold text-green-600">{summary?.open}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-1">
          <p className="text-sm text-gray-500">Comandas Finalizadas</p>
          <p className="text-3xl font-bold text-gray-400">{summary?.completed}</p>
        </div>
      </div>

      {/* Fila resumida */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-lg">Pedidos em Andamento</h2>

        {queue.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum pedido em andamento.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {queue.slice(0, 5).map((request) => (
              <div key={request.id} className="flex justify-between items-center border-b pb-3">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">Pedido #{request.id}</span>
                  <span className="text-xs text-gray-400">
                    {request.items.length} {request.items.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(request.orderDate).toLocaleTimeString('pt-BR')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[request.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[request.status] ?? request.status}
                  </span>
                </div>
              </div>
            ))}

            {queue.length > 5 && (
              <p className="text-sm text-gray-400 text-center">
                + {queue.length - 5} pedidos na fila
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard