import { Badge } from '@/components/ui/badge'
import { productStatusBadgeClassNames } from '@/lib/badge-styles'

const newsLabelClassNames: Record<string, string> = {
  SALE: productStatusBadgeClassNames.SALE,
  NEW: productStatusBadgeClassNames.NEW,
  入荷: 'border-primary/20 bg-primary/10 text-primary',
  EVENT: 'border-accent bg-accent text-accent-foreground',
  お知らせ: 'border-border bg-muted text-muted-foreground',
}

const fallbackLabelClassName =
  'border-border bg-secondary text-secondary-foreground'

export function NewsLabelBadge({ label }: { label: string }) {
  return (
    <Badge className={newsLabelClassNames[label] ?? fallbackLabelClassName}>
      {label}
    </Badge>
  )
}
