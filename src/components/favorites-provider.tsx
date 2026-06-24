import { useCallback, useMemo, useState, type ReactNode } from 'react'

import {
  FavoritesProviderContext,
  type FavoritesProviderState,
} from '@/lib/favorites-context'
import { storefrontProducts } from '@/lib/shop-content'

type FavoritesProviderProps = {
  children: ReactNode
}

const demoFavoriteProductIds = [23, 22, 20, 17] as const
const productById = new Map(
  storefrontProducts.map((product) => [product.id, product]),
)

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteProductIds, setFavoriteProductIds] = useState<number[]>([
    ...demoFavoriteProductIds,
  ])
  const favoriteProductIdSet = useMemo(
    () => new Set(favoriteProductIds),
    [favoriteProductIds],
  )
  const favoriteProducts = useMemo(
    () =>
      favoriteProductIds.flatMap((productId) => {
        const product = productById.get(productId)

        return product ? [product] : []
      }),
    [favoriteProductIds],
  )

  const isFavorite = useCallback(
    (productId: number) => favoriteProductIdSet.has(productId),
    [favoriteProductIdSet],
  )

  const removeFavorite = useCallback((productId: number) => {
    setFavoriteProductIds((productIds) =>
      productIds.filter((currentProductId) => currentProductId !== productId),
    )
  }, [])

  const toggleFavorite = useCallback((productId: number) => {
    setFavoriteProductIds((productIds) =>
      productIds.includes(productId)
        ? productIds.filter(
            (currentProductId) => currentProductId !== productId,
          )
        : [productId, ...productIds],
    )
  }, [])

  const value = useMemo<FavoritesProviderState>(
    () => ({
      favoriteProductIds,
      favoriteProducts,
      isFavorite,
      removeFavorite,
      toggleFavorite,
    }),
    [
      favoriteProductIds,
      favoriteProducts,
      isFavorite,
      removeFavorite,
      toggleFavorite,
    ],
  )

  return (
    <FavoritesProviderContext.Provider value={value}>
      {children}
    </FavoritesProviderContext.Provider>
  )
}
