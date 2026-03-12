import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, deactivateUser } from '../services/user.service'
import type { User } from '../types/user'
import { Plus, Edit2, Trash2, Shield, User as UserIcon } from 'lucide-react'
import LoadingScreen from '../components/Loading'

function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  async function handleDeactivate(id: number) {
    if (!confirm('Deseja inativar este usuário?')) return
    try {
      await deactivateUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch {
      alert('Erro ao inativar usuário.')
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="section-title">Usuários</h1>
          <p className="text-gray-600 text-sm">{users.length} usuários cadastrados</p>
        </div>
        <button
          onClick={() => navigate('/app/usuarios/novo')}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Table Container */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="table-cell text-left font-semibold text-gray-700">Nome</th>
                <th className="table-cell text-left font-semibold text-gray-700">Email</th>
                <th className="table-cell text-left font-semibold text-gray-700">Tipo</th>
                <th className="table-cell text-left font-semibold text-gray-700">Status</th>
                <th className="table-cell text-left font-semibold text-gray-700">Desde</th>
                <th className="table-cell text-right font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`border-t border-gray-100 hover:bg-orange-50/30 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        user.type === 'ADMIN'
                          ? 'bg-purple-100'
                          : 'bg-blue-100'
                      }`}>
                        {user.type === 'ADMIN' ? (
                          <Shield size={18} className="text-purple-600" />
                        ) : (
                          <UserIcon size={18} className="text-blue-600" />
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-600 text-xs font-mono">{user.email}</td>
                  <td className="table-cell">
                    <span className={`badge ${
                      user.type === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.type === 'ADMIN' ? 'Administrador' : 'Funcionário'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${
                      user.active
                        ? 'badge-success'
                        : 'badge-danger'
                    }`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="table-cell text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/app/usuarios/${user.id}`)}
                        className="p-2 rounded-lg text-orange-600 hover:bg-orange-100 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      {user.active && (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                          title="Inativar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-medium">Nenhum usuário cadastrado</p>
          <p className="text-sm">Comece adicionando um novo usuário</p>
        </div>
      )}
    </div>
  )
}

export default Users