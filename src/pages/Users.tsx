import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, deactivateUser } from '../services/user.service'
import type { User } from '../types/user'

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

  if (loading) return <p>Carregando...</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <button
          onClick={() => navigate('/app/usuarios/novo')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          + Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Nome</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Criado em</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.type === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.type === 'ADMIN' ? 'Administrador' : 'Funcionário'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/app/usuarios/${user.id}`)}
                      className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                    >
                      Editar
                    </button>
                    {user.active && (
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        className="text-red-400 hover:text-red-600 text-sm font-medium"
                      >
                        Inativar
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
  )
}

export default Users