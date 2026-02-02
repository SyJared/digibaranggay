import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './LOGIN/header.css'
import './LOGIN/login.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import '@fontsource/inter'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
