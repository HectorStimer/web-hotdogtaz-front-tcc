import { useKeycloak } from '@react-keycloak/web'
import LoadingScreen from './Loading'

type Props = {
  children: React.ReactNode
}

function PrivateRoute({ children }: Props) {
  const { keycloak, initialized } = useKeycloak()

  if (!initialized) return <LoadingScreen />

  if (!keycloak.authenticated) {
    keycloak.login()
    return <LoadingScreen />
  }

  return <>{children}</>
}

export default PrivateRoute