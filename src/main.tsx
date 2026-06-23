import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import { CartProvider } from './components/cart-provider'
import { FavoritesProvider } from './components/favorites-provider'
import { ScrollToTopOnNavigation } from './components/scroll-to-top-on-navigation'
import { ThemeProvider } from './components/theme-provider'
import './styles.css'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <ScrollToTopOnNavigation />
      <ThemeProvider>
        <FavoritesProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
