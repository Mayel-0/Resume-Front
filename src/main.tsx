import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import 'lenis/dist/lenis.css'
import './styles/main.scss'
import App from './App'
import TransitionProvider from './context/TransitionProvider'

// Le preloader repart toujours du haut de page : on gère le scroll nous-mêmes
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const root = document.getElementById('root')
if (!root) throw new Error('Élément #root introuvable dans index.html')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <TransitionProvider>
        <App />
      </TransitionProvider>
    </BrowserRouter>
  </StrictMode>,
)
