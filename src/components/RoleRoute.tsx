import { useRoles } from '../hooks/useRoles'
import { Navigate } from 'react-router-dom'

type Props = {
  children: React.ReactNode
  allowedRoles: ('ADMIN' | 'CLERK')[]
}

function RoleRoute({ children, allowedRoles }: Props) {
  const { roles } = useRoles()

  const hasAccess = allowedRoles.some((role) => roles.includes(role))

  if (!hasAccess) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}

export default RoleRoute