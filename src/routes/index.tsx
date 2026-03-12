import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Dashboard from '../pages/Dashboard'
import Comandas from '../pages/Comandas'
import Cardapio from '../pages/Cardapio'
import AddProduct from '../pages/AddProduct'
import EditProduct from '../pages/EditProduct'
import Command from '../pages/Command'
import NewRequest from '../pages/NewRequest'
import Queue from '../pages/Queue'

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Login</h1>,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'comandas', element: <Comandas /> },
      { path: 'cardapio', element: <Cardapio /> },
      { path: 'cardapio/novo', element: <AddProduct /> },
      { path: 'cardapio/:id', element: <EditProduct /> },
      { path: 'comandas/:id', element: <Command /> },
      { path: 'comandas/:id/novo-pedido', element: <NewRequest /> },
      { path: 'fila', element: <Queue /> },
    ],
  },
])

export default router