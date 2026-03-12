import type { Command } from '../types/command'
import { useNavigate } from 'react-router-dom'
import { Clock, DollarSign, Table2, ArrowRight } from 'lucide-react'

type Props = {
  command: Command
}

function CommandCard({ command }: Props) {
  const navigate = useNavigate()

  const openingDate = new Date(command.openingDate)
  const tempo = Math.floor((new Date().getTime() - openingDate.getTime()) / 60000)

  const isCompleted = command.status === 'COMPLETED'

  return (
    <div className={`card-hover overflow-hidden ${isCompleted ? 'opacity-75' : ''}`}>
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-xs text-gray-500 font-medium">Comanda</p>
            <h3 className="font-bold text-xl text-gray-900">#{command.number}</h3>
          </div>
          <span className={`badge ${
            isCompleted
              ? 'bg-gray-100 text-gray-600'
              : 'badge-success'
          }`}>
            {isCompleted ? 'Finalizada' : 'Aberta'}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-3 py-3 border-y border-gray-100">
          <div className="flex items-center gap-3 text-sm">
            <Table2 size={16} className="text-gray-400" />
            <span className="text-gray-600">Mesa <strong className="text-gray-900">{command.tableNumber}</strong></span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <DollarSign size={16} className="text-orange-500" />
            <span className="text-gray-600">Total <strong className="text-gray-900">R$ {command.total.toFixed(2)}</strong></span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-600"><strong className="text-gray-900">{tempo} min</strong> aberta</span>
          </div>
        </div>

        {/* Observation */}
        {command.observation && (
          <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
            💬 {command.observation}
          </p>
        )}

        {/* Button */}
        <button
          onClick={() => navigate(`/app/comandas/${command.id}`)}
          className="mt-auto btn-primary w-full flex items-center justify-center gap-2"
        >
          <span>Abrir</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default CommandCard