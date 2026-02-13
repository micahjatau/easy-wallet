import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { StorageErrorProvider } from './contexts/StorageErrorContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <StorageErrorProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </StorageErrorProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>,
)
