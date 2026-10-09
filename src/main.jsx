import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import 'lenis/dist/lenis.css'
import './styles/main.scss'
import App from './App.jsx'
import TransitionProvider from './context/TransitionProvider.jsx'

// Le preloader repart toujours du haut de page : on gère le scroll nous-mêmes
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TransitionProvider>
        <App />
      </TransitionProvider>
    </BrowserRouter>
  </StrictMode>,
)
