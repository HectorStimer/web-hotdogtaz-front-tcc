import { useEffect, useState } from 'react'
import { getCommandsSummary } from '../services/command.service'
import { getQueue } from '../services/request.service'
import type { Request } from '../types/request'
import { TrendingUp, Zap, CheckCircle, Activity } from 'lucide-react'
import LoadingScreen from '../components/Loading'

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

  if (loading) return <LoadingScreen />

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ElementType; color: string }) => (
    <div className={`card-hover p-6 flex flex-col gap-3 relative overflow-hidden group`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} opacity-20`}>
          <Icon size={24} className={`${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-gray-200 to-transparent rounded-full" />
    </div>
  )

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="section-title">Dashboard</h1>
        <p className="text-gray-600 text-sm">Bem-vindo! Aqui está um resumo do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total de Comandas" 
          value={summary?.total ?? 0}
          icon={TrendingUp}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard 
          title="Comandas Abertas" 
          value={summary?.open ?? 0}
          icon={Activity}
          color="from-green-500 to-emerald-500"
        />
        <StatCard 
          title="Comandas Finalizadas" 
          value={summary?.completed ?? 0}
          icon={CheckCircle}
          color="from-gray-500 to-slate-500"
        />
      </div>

      {/* Queue Section */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Pedidos em Andamento</h2>
            {queue.length > 0 && (
              <span className="ml-auto bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {queue.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-400 text-sm">✨ Nenhum pedido em andamento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.slice(0, 5).map((request) => (
                <div 
                  key={request.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-25 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
                >
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="font-semibold text-gray-900 text-sm">Pedido #{request.id}</span>
                    <span className="text-xs text-gray-500">
                      {request.items.length} {request.items.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(request.orderDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`badge text-xs ${STATUS_COLORS[request.status] ?? 'badge-info'}`}>
                      {STATUS_LABELS[request.status] ?? request.status}
                    </span>
                  </div>
                </div>
              ))}

              {queue.length > 5 && (
                <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-600">
                    + {queue.length - 5} pedidos na fila
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard