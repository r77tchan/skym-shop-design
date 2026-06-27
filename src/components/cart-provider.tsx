import { useCallback, useMemo, useState, type ReactNode } from 'react'

import {
  CartProviderContext,
  type CartLine,
  type CartProviderState,
} from '@/lib/cart-context'
import { getProductStock } from '@/lib/product-stock'
import { getProductPriceNumber, storefrontProducts } from '@/lib/shop-content'

type CartProviderProps = {
  children: ReactNode
}

type CartLineState = {
  productId: number
  quantity: number
}

const demoCartLineDefinitions = [
  { productId: 11, quantity: 1 },
  { productId: 22, quantity: 1 },
  { productId: 12, quantity: 2 },
] as const satisfies readonly CartLineState[]
const productById = new Map(
  storefrontProducts.map((product) => [product.id, product]),
)

export function CartProvider({ children }: CartProviderProps) {
  const [cartLineStates, setCartLineStates] = useState<CartLineState[]>([
    ...demoCartLineDefinitions,
  ])
  const cartLines = useMemo<CartLine[]>(
    () =>
      cartLineStates.flatMap((lineState) => {
        const product = productById.get(lineState.productId)
        const quantity = product
          ? clampCartQuantity(product, lineState.quantity)
          : 0

        return product && quantity > 0 ? [{ product, quantity }] : []
      }),
    [cartLineStates],
  )
  const cartQuantityByProductId = useMemo(
    () => new Map(cartLines.map((line) => [line.product.id, line.quantity])),
    [cartLines],
  )
  const itemCount = useMemo(
    () => cartLines.reduce((total, line) => total + line.quantity, 0),
    [cartLines],
  )
  const subtotal = useMemo(
    () =>
      cartLines.reduce(
        (total, line) =>
          total + getProductPriceNumber(line.product) * line.quantity,
        0,
      ),
    [cartLines],
  )

  const addItem = useCallback((productId: number, quantity = 1) => {
    const product = productById.get(productId)

    if (!product || getProductStock(product) <= 0) {
      return
    }

    setCartLineStates((lines) => {
      const currentLine = lines.find((line) => line.productId === productId)

      if (currentLine) {
        return lines.map((line) =>
          line.productId === productId
            ? {
                ...line,
                quantity: clampCartQuantity(product, line.quantity + quantity),
              }
            : line,
        )
      }

      return [
        { productId, quantity: clampCartQuantity(product, quantity) },
        ...lines,
      ]
    })
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    const product = productById.get(productId)

    if (!product) {
      return
    }

    setCartLineStates((lines) =>
      lines.map((line) =>
        line.productId === productId
          ? { ...line, quantity: clampCartQuantity(product, quantity) }
          : line,
      ),
    )
  }, [])

  const removeItem = useCallback((productId: number) => {
    setCartLineStates((lines) =>
      lines.filter((line) => line.productId !== productId),
    )
  }, [])

  const getCartQuantity = useCallback(
    (productId: number) => cartQuantityByProductId.get(productId) ?? 0,
    [cartQuantityByProductId],
  )

  const getAvailableQuantity = useCallback(
    (productId: number) => {
      const product = productById.get(productId)

      if (!product) {
        return 0
      }

      return Math.max(getProductStock(product) - getCartQuantity(productId), 0)
    },
    [getCartQuantity],
  )

  const value = useMemo<CartProviderState>(
    () => ({
      addItem,
      cartLines,
      getAvailableQuantity,
      getCartQuantity,
      itemCount,
      removeItem,
      subtotal,
      updateQuantity,
    }),
    [
      addItem,
      cartLines,
      getAvailableQuantity,
      getCartQuantity,
      itemCount,
      removeItem,
      subtotal,
      updateQuantity,
    ],
  )

  return (
    <CartProviderContext.Provider value={value}>
      {children}
    </CartProviderContext.Provider>
  )
}

function clampCartQuantity(
  product: (typeof storefrontProducts)[number],
  quantity: number,
) {
  const stock = getProductStock(product)

  if (stock <= 0) {
    return 0
  }

  return Math.min(Math.max(Math.trunc(quantity) || 1, 1), stock)
}
