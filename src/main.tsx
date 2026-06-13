import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { RouterProvider } from 'react-router-dom'
import keycloak from './keycloak'
import router from './routes'
import './index.css'
import { ToastProvider } from './contexts/toast'
import { ConfirmProvider } from './contexts/confirm'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: 'login-required', checkLoginIframe: false, locale: 'pt_BR' }}
    >
      <ToastProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </ToastProvider>
    </ReactKeycloakProvider>
  </StrictMode>,
)