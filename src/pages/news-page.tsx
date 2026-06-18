import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { getNewsItemPath, newsItems } from '@/lib/shop-content'

export function NewsPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <SiteHeader />

      <section className="border-b bg-muted/35 pt-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-gutter py-10 sm:py-12">
          <nav
            aria-label="パンくず"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
          >
            <Link
              className="underline decoration-foreground/35 underline-offset-4 hover:text-foreground hover:decoration-foreground"
              to="/"
            >
              トップ
            </Link>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span className="text-foreground">お知らせ</span>
          </nav>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-primary">NEWS</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
              お知らせ
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              入荷情報、セール、イベント、発送に関するご案内をまとめています。
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-4 px-gutter py-8 sm:py-10">
          {newsItems.map((item) => (
            <Link
              aria-label={`${item.title}の詳細へ`}
              className="grid gap-3 rounded-lg border bg-card p-5 hover:border-primary/35 hover:bg-accent/45 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none sm:grid-cols-[9rem_minmax(0,1fr)_2rem] sm:items-center sm:gap-5"
              key={item.title}
              to={getNewsItemPath(item)}
            >
              <div className="flex items-center gap-3 sm:grid sm:gap-3">
                <time
                  className="text-xs font-medium text-muted-foreground"
                  dateTime={item.date.replaceAll('.', '-')}
                >
                  {item.date}
                </time>
                <Badge variant={item.label === 'SALE' ? 'default' : 'outline'}>
                  {item.label}
                </Badge>
              </div>

              <div className="min-w-0">
                <h2 className="text-base leading-6 font-semibold">
                  {item.title}
                </h2>
              </div>

              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground sm:justify-self-end"
              />
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
