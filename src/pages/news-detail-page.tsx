import { Link, Navigate, useParams } from 'react-router'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { newsItems } from '@/lib/shop-content'

export function NewsDetailPage() {
  const { newsId } = useParams()
  const item = newsItems.find((newsItem) => newsItem.slug === newsId)

  if (!item) {
    return <Navigate replace to="/news" />
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <SiteHeader />

      <article>
        <section className="border-b bg-muted/35 pt-20">
          <div className="mx-auto grid max-w-7xl gap-5 px-gutter py-10 sm:py-12">
            <nav
              aria-label="パンくず"
              className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground"
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
              <Link
                className="underline decoration-foreground/35 underline-offset-4 hover:text-foreground hover:decoration-foreground"
                to="/news"
              >
                お知らせ
              </Link>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <span className="text-foreground">詳細</span>
            </nav>

            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-primary">NEWS</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
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
              <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold sm:text-4xl">
                {item.title}
              </h1>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto grid max-w-3xl gap-5 px-gutter py-10 sm:py-14">
            {item.content.map((paragraph) => (
              <p
                className="text-sm leading-8 text-foreground/86 sm:text-base"
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  )
}
