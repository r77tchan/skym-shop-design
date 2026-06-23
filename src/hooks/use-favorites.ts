import { useContext } from 'react'

import { FavoritesProviderContext } from '@/lib/favorites-context'

export function useFavorites() {
  const context = useContext(FavoritesProviderContext)

  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }

  return context
}
