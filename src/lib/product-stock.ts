import { products, type Product } from '@/lib/shop-content'

const demoStockLevels = [18, 9, 7, 14, 4, 6, 21, 11, 3, 5] as const
const outOfStockProductIds = new Set([21, 19, 18, 16, 14])

const productStockById = new Map(
  products.map((product, index) => [
    product.id,
    outOfStockProductIds.has(product.id)
      ? 0
      : demoStockLevels[index % demoStockLevels.length],
  ]),
)

export function getProductStock(product: Product) {
  return productStockById.get(product.id) ?? 0
}

export function getProductStockLabel(product: Product) {
  const stock = getProductStock(product)

  return stock > 0 ? `在庫 ${stock}点` : '在庫なし'
}
