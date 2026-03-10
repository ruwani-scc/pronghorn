import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { initializeTestAuth, isAuthenticated } from './services/auth'

// Auto-authenticate on app start (development only)
if (import.meta.env.DEV) {
  // Check if already authenticated
  if (!isAuthenticated()) {
    // Auto-authenticate with test credentials
    initializeTestAuth()
      .then(() => {
        console.log('✅ Auto-authenticated successfully');
      })
      .catch((error) => {
        console.warn('⚠️ Auto-authentication failed:', error.message);
        console.log('💡 You can manually authenticate using: await window.auth.initializeTestAuth()');
      });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
