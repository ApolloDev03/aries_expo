import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './components/context/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserAuthProvider } from './components/context/UserAuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserAuthProvider>
          <App />
        </UserAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
