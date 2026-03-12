import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserById, updateUser } from '../services/user.service'

function EditUser() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      getUserById(parseInt(id)).then((user) => {
        setName(user.name)
        setEmail(user.email)
        setActive(user.active)
      })
    }
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    try {
      await updateUser(parseInt(id), { name, email, active })
      navigate('/app/usuarios')
    } catch {
      alert('Erro ao atualizar usuário.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/app/usuarios')} className="text-gray-500 hover:text-gray-700">
          ← Voltar
        </button>
        <h1 className="text-2xl font-bold">Editar Usuário</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 accent-orange-500"
          />
          <label htmlFor="active" className="text-sm font-medium">Ativo</label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
}

export default EditUser