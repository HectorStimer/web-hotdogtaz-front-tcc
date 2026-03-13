import { useKeycloak } from '@react-keycloak/web'

export function useRoles() {
  const { keycloak } = useKeycloak()

  const roles: string[] = keycloak.tokenParsed?.realm_access?.roles ?? []

  return {
    isAdmin: roles.includes('ADMIN'),
    isClerk: roles.includes('CLERK'),
    roles,
  }
}