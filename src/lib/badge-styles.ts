import type { ProductStatus } from '@/lib/shop-content'

export const productStatusBadgeClassNames: Record<ProductStatus, string> = {
  'SOLD OUT': 'bg-muted-foreground text-background',
  SALE: 'bg-product-sale text-product-sale-foreground',
  NEW: 'bg-product-new text-product-new-foreground',
}
