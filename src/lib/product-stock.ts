import { isSoldOut } from '@/lib/product-status'
import { products, type Product } from '@/lib/shop-content'

const demoStockLevels = [18, 9, 0, 7, 0, 14, 4, 6, 21, 11, 3, 5] as const

const productStockById = new Map(
  products.map((product, index) => [
    product.id,
    isSoldOut(product) ? 0 : demoStockLevels[index % demoStockLevels.length],
  ]),
)

export function getProductStock(product: Product) {
  return productStockById.get(product.id) ?? 0
}

export function getProductStockLabel(product: Product) {
  const stock = getProductStock(product)

  return stock > 0 ? `在庫 ${stock}点` : '在庫なし'
}
