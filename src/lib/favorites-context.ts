import { createContext } from 'react'

import type { Product } from '@/lib/shop-content'

export type FavoritesProviderState = {
  favoriteProductIds: readonly number[]
  favoriteProducts: readonly Product[]
  isFavorite: (productId: number) => boolean
  removeFavorite: (productId: number) => void
  toggleFavorite: (productId: number) => void
}

export const FavoritesProviderContext = createContext<
  FavoritesProviderState | undefined
>(undefined)
