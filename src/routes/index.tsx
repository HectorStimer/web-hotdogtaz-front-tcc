import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import PrivateRoute from '../components/PrivateRoute'
import Dashboard from '../pages/Dashboard'
import Comandas from '../pages/Comandas'
import Cardapio from '../pages/Cardapio'
import AddProduct from '../pages/AddProduct'
import EditProduct from '../pages/EditProduct'
import NewRequest from '../pages/NewRequest'
import Queue from '../pages/Queue'
import Users from '../pages/Users'
import AddUser from '../pages/AddUser'
import EditUser from '../pages/EditUser'
import Command from '../pages/Command'
import Categories from '../pages/Categories'

import RoleRoute from '../components/RoleRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app" replace />,
  },
  {
    path: '/app',
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      // rotas só para ADMIN:
        { path: 'usuarios', element: <RoleRoute allowedRoles={['ADMIN']}><Users /></RoleRoute> },
        { path: 'usuarios/novo', element: <RoleRoute allowedRoles={['ADMIN']}><AddUser /></RoleRoute> },
        { path: 'usuarios/:id', element: <RoleRoute allowedRoles={['ADMIN']}><EditUser /></RoleRoute> },
        { path: 'categorias', element: <RoleRoute allowedRoles={['ADMIN']}><Categories /></RoleRoute> },
        
        { path: 'cardapio', element: <RoleRoute allowedRoles={['ADMIN']}><Cardapio /></RoleRoute> },
        { path: 'cardapio/novo', element: <RoleRoute allowedRoles={['ADMIN']}><AddProduct /></RoleRoute> },
        { path: 'cardapio/:id', element: <RoleRoute allowedRoles={['ADMIN']}><EditProduct /></RoleRoute> },

        // rotas para ADMIN e CLERK:
        { path: 'fila', element: <RoleRoute allowedRoles={['ADMIN', 'CLERK']}><Queue /></RoleRoute> },
        { path: 'comandas', element: <RoleRoute allowedRoles={['ADMIN', 'CLERK']}><Comandas /></RoleRoute> },
        { path: 'comandas/:id', element: <RoleRoute allowedRoles={['ADMIN', 'CLERK']}><Command /></RoleRoute> },
        { path: 'comandas/:id/novo-pedido', element: <RoleRoute allowedRoles={['ADMIN', 'CLERK']}><NewRequest /></RoleRoute> },
    ],
  },
])

export default router