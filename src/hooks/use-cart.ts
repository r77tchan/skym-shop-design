import { useContext } from 'react'

import { CartProviderContext } from '@/lib/cart-context'

export function useCart() {
  const context = useContext(CartProviderContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
