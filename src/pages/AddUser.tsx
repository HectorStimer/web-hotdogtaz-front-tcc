import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../services/user.service'

function AddUser() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState<'ADMIN' | 'CLERK'>('CLERK')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await createUser({ name, email, password, type })
      navigate('/app/usuarios')
    } catch {
      alert('Erro ao criar usuário.')
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
        <h1 className="text-2xl font-bold">Novo Usuário</h1>
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

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'ADMIN' | 'CLERK')}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="CLERK">Funcionário</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Criar Usuário'}
        </button>
      </form>
    </div>
  )
}

export default AddUser