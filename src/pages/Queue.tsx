import { useEffect, useState } from 'react'
import { getQueue, updateRequestStatus } from '../services/request.service'
import type { Request } from '../types/request'

const STATUS_LABELS: Record<string, string> = {
  CREATED: 'Novo',
  IN_PREPARATION: 'Em preparo',
  READY: 'Pronto',
  COMPLETED: 'Entregue',
  CANCELED: 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  CREATED: 'bg-yellow-100 text-yellow-700',
  IN_PREPARATION: 'bg-blue-100 text-blue-700',
  READY: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELED: 'bg-red-100 text-red-700',
}

const NEXT_STATUS: Record<string, string> = {
  CREATED: 'IN_PREPARATION',
  IN_PREPARATION: 'READY',
  READY: 'COMPLETED',
}

const NEXT_STATUS_LABEL: Record<string, string> = {
  CREATED: 'Iniciar preparo',
  IN_PREPARATION: 'Marcar como pronto',
  READY: 'Marcar como entregue',
}

function Queue() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQueue()
      .then(setRequests)
      .finally(() => setLoading(false))
  }, [])

  async function handleUpdateStatus(request: Request) {
    const next = NEXT_STATUS[request.status]
    if (!next) return

    try {
      const updated = await updateRequestStatus(request.id, next)
      setRequests((prev) =>
        prev.map((r) => r.id === updated.id ? updated : r)
      )
    } catch {
      alert('Erro ao atualizar status.')
    }
  }

  if (loading) return <p>Carregando...</p>

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Fila de Pedidos</h1>

      {requests.length === 0 ? (
        <p className="text-gray-400">Nenhum pedido na fila.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Pedido #{request.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[request.status]}`}>
                  {STATUS_LABELS[request.status]}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {request.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {request.observation && (
                <p className="text-xs text-gray-400 italic">
                  Obs: {request.observation}
                </p>
              )}

              <p className="text-xs text-gray-400">
                {new Date(request.orderDate).toLocaleTimeString('pt-BR')}
              </p>

              {NEXT_STATUS[request.status] && (
                <button
                  onClick={() => handleUpdateStatus(request)}
                  className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm mt-auto"
                >
                  {NEXT_STATUS_LABEL[request.status]}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Queue