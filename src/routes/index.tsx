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
      { path: 'comandas', element: <Comandas /> },
      { path: 'comandas/:id', element: <Command /> },
      { path: 'comandas/:id/novo-pedido', element: <NewRequest /> },
      { path: 'cardapio', element: <Cardapio /> },
      { path: 'cardapio/novo', element: <AddProduct /> },
      { path: 'cardapio/:id', element: <EditProduct /> },
      { path: 'fila', element: <Queue /> },
      { path: 'usuarios', element: <Users /> },
      { path: 'usuarios/novo', element: <AddUser /> },
      { path: 'usuarios/:id', element: <EditUser /> },
    ],
  },
])

export default router