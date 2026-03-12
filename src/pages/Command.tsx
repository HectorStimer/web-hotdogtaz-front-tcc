import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCommandById, updateCommand } from '../services/command.service'
import { getRequestsByCommand } from '../services/request.service'
import type { Command } from '../types/command'
import type { Request } from '../types/request'

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

  if (loading) return <p>Carregando...</p>
  if (!command) return <p>Comanda não encontrada.</p>

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/comandas')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Voltar
        </button>
        <h1 className="text-2xl font-bold">Comanda #{command.number}</h1>
        <span className={`text-xs px-2 py-1 rounded-full ${
          command.status === 'COMPLETED'
            ? 'bg-gray-100 text-gray-600'
            : 'bg-green-100 text-green-700'
        }`}>
          {command.status === 'COMPLETED' ? 'Finalizada' : 'Aberta'}
        </span>
      </div>

      {/* Informações da comanda */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3">
        <h2 className="font-semibold text-lg">Informações</h2>
        <p className="text-sm text-gray-600">Mesa: {command.tableNumber}</p>
        <p className="text-sm text-gray-600">
          Aberta em: {new Date(command.openingDate).toLocaleString('pt-BR')}
        </p>
        {command.observation && (
          <p className="text-sm text-gray-600">Observação: {command.observation}</p>
        )}
        <p className="text-xl font-bold mt-2">
          Total: R$ {command.total.toFixed(2)}
        </p>
      </div>

      {/* Pedidos */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Pedidos</h2>
          {command.status !== 'COMPLETED' && (
            <button
              onClick={() => navigate(`/app/comandas/${id}/novo-pedido`)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              + Novo Pedido
            </button>
          )}
        </div>

        {requests.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum pedido ainda.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Pedido #{request.id}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {request.status}
                </span>
              </div>

              {request.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {command.status !== 'COMPLETED' && (
        <button
          onClick={handleClose}
          className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Fechar Comanda
        </button>
      )}
    </div>
  )
}

export default CommandPage