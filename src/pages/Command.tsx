import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCommandById, updateCommand } from '../services/command.service'
import { getRequestsByCommand } from '../services/request.service'
import type { Command } from '../types/command'
import type { Request } from '../types/request'
import { ArrowLeft, Plus, Check, DollarSign, Clock } from 'lucide-react'
import LoadingScreen from '../components/Loading'

function CommandPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [command, setCommand] = useState<Command | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      Promise.all([
        getCommandById(parseInt(id)),
        getRequestsByCommand(parseInt(id)),
      ])
        .then(([commandData, requestsData]) => {
          setCommand(commandData)
          setRequests(requestsData)
        })
        .catch(() => alert('Erro ao carregar comanda.'))
        .finally(() => setLoading(false))
    }
  }, [id])

  async function handleClose() {
    if (!id || !command) return
    if (!confirm('Deseja fechar esta comanda?')) return

    try {
      await updateCommand(parseInt(id), {
        number: command.number,
        tableNumber: command.tableNumber,
        observation: command.observation ?? '',
        status: 'COMPLETED',
      })
      navigate('/app/comandas')
    } catch {
      alert('Erro ao fechar comanda.')
    }
  }

  if (loading) return <LoadingScreen />
  if (!command) return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-gray-500">Comanda não encontrada.</p>
    </div>
  )

  const isCompleted = command.status === 'COMPLETED'
  const itemCount = requests.reduce((sum, r) => sum + r.items.length, 0)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/comandas')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Comanda #{command.number}</h1>
          <p className="text-sm text-gray-600">Mesa {command.tableNumber}</p>
        </div>
        <span className={`badge text-sm ${
          isCompleted
            ? 'bg-gray-100 text-gray-600'
            : 'bg-green-100 text-green-700'
        }`}>
          {isCompleted ? 'Finalizada' : 'Aberta'}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Clock size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Aberta há</p>
            <p className="text-lg font-bold text-gray-900">
              {Math.floor((new Date().getTime() - new Date(command.openingDate).getTime()) / 60000)} min
            </p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Plus size={20} className="text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Itens</p>
            <p className="text-lg font-bold text-gray-900">{itemCount}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Total</p>
            <p className="text-lg font-bold text-gray-900">R$ {command.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Command Details */}
      <div className="card p-6">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">Informações</h2>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Mesa</p>
            <p className="font-semibold text-gray-900">{command.tableNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Aberta em</p>
            <p className="font-semibold text-gray-900">
              {new Date(command.openingDate).toLocaleString('pt-BR')}
            </p>
          </div>
          {command.observation && (
            <div className="col-span-2">
              <p className="text-gray-500">Observação</p>
              <p className="font-semibold text-gray-900">{command.observation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Requests */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-900">Pedidos</h2>
          {!isCompleted && (
            <button
              onClick={() => navigate(`/app/comandas/${id}/novo-pedido`)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={18} />
              Novo Pedido
            </button>
          )}
        </div>

        <div className="p-6">
          {requests.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhum pedido ainda.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-900">Pedido #{request.id}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {request.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {request.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-600">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="font-medium text-gray-900">R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {request.observation && (
                    <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded border border-gray-100">
                      💬 {request.observation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {!isCompleted && (
        <button
          onClick={handleClose}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Fechar Comanda
        </button>
      )}
    </div>
  )
}

export default CommandPage