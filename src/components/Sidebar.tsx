import { LayoutDashboard, ClipboardList, UtensilsCrossed, ChefHat } from 'lucide-react'
import { NavLink } from 'react-router-dom'


const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/app' },
  { label: 'Comandas', icon: ClipboardList, path: '/app/comandas' },
  { label: 'Cardápio', icon: UtensilsCrossed, path: '/app/cardapio' },
  { label: 'Fila', icon: ChefHat, path: '/app/fila' },
]

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-gray-700">
        🌭 Hot Dog Taz
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar