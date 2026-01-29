import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { AgencyProvider } from './context/AgencyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AgencyProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </AgencyProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
