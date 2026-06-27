import type { Product } from '@/lib/shop-content'

export function getProductStock(product: Product) {
  return product.stockQuantity
}

export function getProductStockLabel(product: Product) {
  const stock = getProductStock(product)

  return stock > 0 ? `在庫 ${stock}点` : '在庫なし'
}
