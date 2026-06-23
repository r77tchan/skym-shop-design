import { createContext } from 'react'

import type { Product } from '@/lib/shop-content'

export type CartLine = {
  product: Product
  quantity: number
}

export type CartProviderState = {
  addItem: (productId: number, quantity?: number) => void
  cartLines: readonly CartLine[]
  getAvailableQuantity: (productId: number) => number
  getCartQuantity: (productId: number) => number
  itemCount: number
  removeItem: (productId: number) => void
  subtotal: number
  updateQuantity: (productId: number, quantity: number) => void
}

export const CartProviderContext = createContext<CartProviderState | undefined>(
  undefined,
)
