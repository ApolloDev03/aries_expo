import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserAuthProvider } from './components/context/UserAuthContext.tsx'
import { AdminAuthProvider } from './components/context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <UserAuthProvider>
          <App />
        </UserAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
