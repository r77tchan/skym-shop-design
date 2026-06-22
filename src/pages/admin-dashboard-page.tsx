import { ChevronRightIcon, ShoppingCartIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'

export function AdminDashboardPage() {
  return (
    <>
      <section className="border-b pb-5">
        <div className="flex h-10 items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
              ホーム
            </h1>
          </div>
        </div>
      </section>

      <Link
        aria-label="対応が必要な注文2件を確認"
        className="group flex min-w-0 items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-xs outline-none hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-5"
        to="/admin/orders"
      >
        <span className="relative grid size-11 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
          <ShoppingCartIcon aria-hidden="true" className="size-5" />
          <Badge className="absolute -top-2 -right-2 h-5 min-w-5 px-1.5">
            2
          </Badge>
        </span>
        <span className="min-w-0 flex-1 text-sm font-medium sm:text-base">
          対応が必要な注文が2件あります
        </span>
        <ChevronRightIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground"
        />
      </Link>
    </>
  )
}
