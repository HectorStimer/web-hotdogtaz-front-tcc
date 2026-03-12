import { useEffect, useState } from 'react'
import { getCommands } from '../services/command.service'
import { createCommand } from '../services/command.service'
import CommandCard from '../components/CommandCard'
import type { Command } from '../types/command'
import { Plus, X, Loader2 } from 'lucide-react'
import LoadingScreen from '../components/Loading'

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

  if (loading) return <LoadingScreen />
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="section-title">Comandas</h1>
          <p className="text-gray-600 text-sm">{commands.length} comandas abertas</p>
        </div>
        <button
          onClick={() => setOpenSheet(true)}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={20} />
          Nova Comanda
        </button>
      </div>

      {/* Commands Grid */}
      {commands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-medium">Nenhuma comanda aberta</p>
          <p className="text-sm">Comece criando uma nova comanda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {commands.map((command) => (
            <CommandCard key={command.id} command={command} />
          ))}
        </div>
      )}

      {/* Modal de criar comanda */}
      {openSheet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Nova Comanda</h2>
              <button
                onClick={() => setOpenSheet(false)}
                className="p-1 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Número da Comanda</label>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="input-field"
                  placeholder="Ex: 1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Número da Mesa</label>
                <input
                  type="number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="input-field"
                  placeholder="Ex: 5"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Observação (Opcional)</label>
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Ex: Cliente VIP, alergia a glúten..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setOpenSheet(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Criar
                    </>
                  )}
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