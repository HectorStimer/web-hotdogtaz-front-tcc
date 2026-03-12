import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'http://localhost:8180',
  realm: 'hotdogtaz',
  clientId: 'hotdogtaz-front',
})

export default keycloak