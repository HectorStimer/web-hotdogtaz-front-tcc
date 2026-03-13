import { LayoutDashboard, ClipboardList, UtensilsCrossed, ChefHat, Users, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import { useRoles } from '../hooks/useRoles'

function Sidebar() {
  const { keycloak } = useKeycloak()
  const { isAdmin } = useRoles()

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/app' },
    { label: 'Comandas', icon: ClipboardList, path: '/app/comandas' },
    { label: 'Fila', icon: ChefHat, path: '/app/fila' },
    ...(isAdmin ? [
      { label: 'Cardápio', icon: UtensilsCrossed, path: '/app/cardapio' },
      { label: 'Usuários', icon: Users, path: '/app/usuarios' },
    ] : []),
  ]

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌭</span>
          <div>
            <h1 className="text-xl font-bold">Hot Dog Taz</h1>
            <p className="text-xs text-orange-100">Gestão de Pedidos</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase px-4 py-2 mb-4">Menu Principal</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-3">
        <div className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700">
          <p className="text-xs text-gray-400">Usuário Logado</p>
          <p className="text-sm font-semibold text-white truncate">
            {keycloak?.tokenParsed?.preferred_username || 'Usuário'}
          </p>
        </div>
        <button
          onClick={() => keycloak?.logout()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 font-medium text-sm"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}

export default Sidebar