import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Application Entry Point
 * Renders the React application into the DOM
 * Uses React createRoot API for concurrent features
 * Wraps the app in StrictMode for development checks and warnings
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
