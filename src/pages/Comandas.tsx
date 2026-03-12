import { useEffect, useState } from 'react'
import { getCommands } from '../services/command.service'
import { createCommand } from '../services/command.service'
import CommandCard from '../components/CommandCard'
import type { Command } from '../types/command'

function Comandas() {
  const [commands, setCommands] = useState<Command[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openSheet, setOpenSheet] = useState(false)

  const [number, setNumber] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [observation, setObservation] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCommands()
      .then((data) => setCommands(data))
      .catch(() => setError('Erro ao carregar comandas.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const created = await createCommand({
        number: parseInt(number),
        tableNumber: parseInt(tableNumber),
        observation,
      })
      setCommands((prev) => [...prev, created])
      setOpenSheet(false)
      setNumber('')
      setTableNumber('')
      setObservation('')
    } catch {
      alert('Erro ao criar comanda.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Carregando...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Comandas</h1>
        <button
          onClick={() => setOpenSheet(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          + Nova Comanda
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {commands.map((command) => (
          <CommandCard key={command.id} command={command} />
        ))}
      </div>

      {/* Modal de criar comanda */}
      {openSheet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4">
            <h2 className="text-xl font-bold">Nova Comanda</h2>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Número da Comanda</label>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Número da Mesa</label>
                <input
                  type="number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Observação</label>
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenSheet(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Comandas