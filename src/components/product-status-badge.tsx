import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/shop-content'

export function ProductStatusBadge({ status }: { status: Product['status'] }) {
  if (status === 'SOLD OUT') {
    return <Badge variant="outline">SOLD</Badge>
  }

  if (status === 'SALE') {
    return (
      <Badge className="bg-product-sale text-product-sale-foreground">
        SALE
      </Badge>
    )
  }

  if (status === 'NEW') {
    return (
      <Badge className="bg-product-new text-product-new-foreground">NEW</Badge>
    )
  }

  return <Badge variant="secondary">{status}</Badge>
}
