import { useEffect, useState } from 'react'
import { getQueue, updateRequestStatus } from '../services/request.service'
import type { Request } from '../types/request'
import { ChefHat, CheckCircle, Zap, Clock } from 'lucide-react'
import LoadingScreen from '../components/Loading'

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

  if (loading) return <LoadingScreen />

  const pendingRequests = requests.filter(r => ['CREATED', 'IN_PREPARATION'].includes(r.status))
  const readyRequests = requests.filter(r => r.status === 'READY')
  const completedRequests = requests.filter(r => ['COMPLETED', 'CANCELED'].includes(r.status))

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="section-title">Fila de Pedidos</h1>
        <p className="text-gray-600 text-sm">{requests.length} pedidos no total</p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <ChefHat size={48} className="text-gray-300 mb-4" />
          <p className="text-lg font-medium">Nenhum pedido na fila</p>
          <p className="text-sm">A cozinha está em dia! 👨‍🍳</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pendentes */}
          {pendingRequests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Zap size={20} className="text-orange-600" />
                <h2 className="text-lg font-bold text-gray-900">Em Andamento ({pendingRequests.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pendingRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Prontos */}
          {readyRequests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">Prontos para Sair ({readyRequests.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {readyRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Finalizados */}
          {completedRequests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Finalizados ({completedRequests.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {completedRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RequestCard({ request, onUpdateStatus }: { request: Request; onUpdateStatus: (r: Request) => void }) {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-2">
        <span className="font-bold text-lg text-gray-900">Pedido #{request.id}</span>
        <span className={`badge text-xs ${STATUS_COLORS[request.status]}`}>
          {STATUS_LABELS[request.status]}
        </span>
      </div>

      <div className="space-y-2 py-3 border-y border-gray-100">
        {request.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600">
            <span>{item.quantity}x {item.product.name}</span>
            <span className="font-medium text-gray-900">R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {request.observation && (
        <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
          💬 {request.observation}
        </p>
      )}

      <p className="text-xs text-gray-400">
        {new Date(request.orderDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </p>

      {NEXT_STATUS[request.status] && (
        <button
          onClick={() => onUpdateStatus(request)}
          className="btn-primary w-full text-sm mt-auto"
        >
          {NEXT_STATUS_LABEL[request.status]}
        </button>
      )}
    </div>
  )
}

export default Queue