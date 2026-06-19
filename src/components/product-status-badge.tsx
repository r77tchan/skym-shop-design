import { Badge } from '@/components/ui/badge'
import { productStatusBadgeClassNames } from '@/lib/badge-styles'
import type { Product } from '@/lib/shop-content'

export function ProductStatusBadge({ status }: { status: Product['status'] }) {
  if (!status) {
    return null
  }

  return (
    <Badge className={productStatusBadgeClassNames[status]}>{status}</Badge>
  )
}
