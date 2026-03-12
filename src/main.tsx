import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { RouterProvider } from 'react-router-dom'
import keycloak from './keycloak'
import router from './routes'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: 'login-required', checkLoginIframe: false }}
    >
      <RouterProvider router={router} />
    </ReactKeycloakProvider>
  </StrictMode>,
)