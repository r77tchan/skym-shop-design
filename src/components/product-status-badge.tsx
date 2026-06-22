import { Badge } from '@/components/ui/badge'
import { productStatusBadgeClassNames } from '@/lib/badge-styles'
import { sortProductStatusesByPriority } from '@/lib/product-status'
import type { ProductStatus } from '@/lib/shop-content'

export function ProductStatusBadge({ status }: { status?: ProductStatus }) {
  if (!status) {
    return null
  }

  return (
    <Badge className={productStatusBadgeClassNames[status]}>{status}</Badge>
  )
}

export function ProductStatusBadges({
  statuses,
}: {
  statuses?: readonly ProductStatus[]
}) {
  if (!statuses?.length) {
    return null
  }

  const sortedStatuses = sortProductStatusesByPriority(statuses)

  return (
    <>
      {sortedStatuses.map((status) => (
        <ProductStatusBadge key={status} status={status} />
      ))}
    </>
  )
}
