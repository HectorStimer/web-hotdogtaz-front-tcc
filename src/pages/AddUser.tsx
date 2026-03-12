import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../services/user.service'
import { ArrowLeft, Loader2 } from 'lucide-react'

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
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/usuarios')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Usuário</h1>
          <p className="text-sm text-gray-600">Adicione um novo membro à equipe</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-6">
        <div className="form-group">
          <label className="form-label">Nome Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: João Silva"
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: joao@example.com"
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de Usuário</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'ADMIN' | 'CLERK')}
            className="input-field"
          >
            <option value="CLERK">Funcionário</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Administradores têm acesso a todas as funcionalidades, funcionários têm acesso limitado
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/app/usuarios')}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              'Criar Usuário'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddUser