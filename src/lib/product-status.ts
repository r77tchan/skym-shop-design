import type { Product, ProductStatus } from '@/lib/shop-content'
import { getProductStock } from '@/lib/product-stock'

const productStatusPriority = [
  'SOLD OUT',
  'SALE',
  'NEW',
] as const satisfies readonly ProductStatus[]

export function hasProductStatus(product: Product, status: ProductStatus) {
  return getProductStatuses(product).includes(status)
}

export function isSoldOut(product: Product) {
  return getProductStock(product) <= 0
}

export function isOnSale(product: Product) {
  return Boolean(product.sale)
}

export function getProductStatuses(product: Product) {
  const statuses: ProductStatus[] = []

  if (isSoldOut(product)) {
    statuses.push('SOLD OUT')
  }

  if (isOnSale(product)) {
    statuses.push('SALE')
  }

  if (product.isNew) {
    statuses.push('NEW')
  }

  return statuses
}

export function getPrimaryProductStatus(product: Product) {
  return productStatusPriority.find((status) =>
    hasProductStatus(product, status),
  )
}

export function sortProductStatusesByPriority(
  statuses?: readonly ProductStatus[],
) {
  if (!statuses?.length) {
    return []
  }

  return productStatusPriority.filter((status) => statuses.includes(status))
}
