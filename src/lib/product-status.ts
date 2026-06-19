import type { Product, ProductStatus } from '@/lib/shop-content'

const productStatusPriority = [
  'SOLD OUT',
  'SALE',
  'NEW',
] as const satisfies readonly ProductStatus[]

export function hasProductStatus(product: Product, status: ProductStatus) {
  return product.statuses?.includes(status) ?? false
}

export function isSoldOut(product: Product) {
  return hasProductStatus(product, 'SOLD OUT')
}

export function isOnSale(product: Product) {
  return hasProductStatus(product, 'SALE')
}

export function getPrimaryProductStatus(product: Product) {
  return productStatusPriority.find((status) =>
    hasProductStatus(product, status),
  )
}
