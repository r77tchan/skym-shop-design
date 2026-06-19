import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/shop-content'

export function ProductStatusBadge({ status }: { status: Product['status'] }) {
  switch (status) {
    case 'SOLD OUT':
      return (
        <Badge className="bg-muted-foreground text-background">SOLD OUT</Badge>
      )
    case 'SALE':
      return (
        <Badge className="bg-product-sale text-product-sale-foreground">
          SALE
        </Badge>
      )
    case 'NEW':
      return (
        <Badge className="bg-product-new text-product-new-foreground">
          NEW
        </Badge>
      )
  }

  const exhaustiveStatus: never = status
  return exhaustiveStatus
}
