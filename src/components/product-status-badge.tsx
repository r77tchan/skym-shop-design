import { Badge } from '@/components/ui/badge'
import { productStatusBadgeClassNames } from '@/lib/badge-styles'
import type { ProductStatus } from '@/lib/shop-content'

export function ProductStatusBadge({ status }: { status?: ProductStatus }) {
  if (!status) {
    return null
  }

  return (
    <Badge className={productStatusBadgeClassNames[status]}>{status}</Badge>
  )
}
