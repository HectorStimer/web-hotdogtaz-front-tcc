import type { Command } from '../types/command'
import { useNavigate } from 'react-router-dom'

type Props = {
  command: Command
}

function CommandCard({ command }: Props) {
  const navigate = useNavigate()

  const openingDate = new Date(command.openingDate)
  const tempo = Math.floor((new Date().getTime() - openingDate.getTime()) / 60000)

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Comanda #{command.number}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          command.status === 'COMPLETED'
            ? 'bg-gray-100 text-gray-600'
            : 'bg-green-100 text-green-700'
        }`}>
          {command.status === 'COMPLETED' ? 'Finalizada' : 'Aberta'}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>Mesa: {command.tableNumber}</p>
        <p>Total: R$ {command.total.toFixed(2)}</p>
        <p className="text-gray-400">⏱ {tempo} min</p>
      </div>

      {command.observation && (
        <p className="text-xs text-gray-400 italic">{command.observation}</p>
      )}

      <button
        onClick={() => navigate(`/app/comandas/${command.id}`)}
        className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors mt-auto"
      >
        Abrir
      </button>
    </div>
  )
}

export default CommandCard