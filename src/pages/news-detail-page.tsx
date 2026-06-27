import { ArrowLeftIcon } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { NewsLabelBadge } from '@/components/news-label-badge'
import { NewsMarkdown } from '@/components/news-markdown'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { assetUrl } from '@/lib/asset-url'
import { newsItems } from '@/lib/shop-content'
import { backButtonClassName } from '@/lib/ui-styles'

export function NewsDetailPage() {
  const { newsId } = useParams()
  const item = newsItems.find((newsItem) => newsItem.id === Number(newsId))

  if (!item) {
    return <Navigate replace to="/news" />
  }

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
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

            <Button asChild className={backButtonClassName} variant="ghost">
              <Link to="/news">
                <ArrowLeftIcon data-icon="inline-start" />
                Back
              </Link>
            </Button>

            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <time
                  className="text-xs font-medium text-muted-foreground"
                  dateTime={item.publishedOn.replaceAll('.', '-')}
                >
                  {item.publishedOn}
                </time>
                {item.tag ? <NewsLabelBadge label={item.tag} /> : null}
              </div>
              <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold sm:text-4xl">
                {item.title}
              </h1>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto grid max-w-4xl gap-8 px-gutter py-10 sm:py-14">
            {item.mainImageUrl ? (
              <img
                alt={item.title}
                className="w-full rounded-lg border bg-muted"
                src={assetUrl(item.mainImageUrl)}
              />
            ) : null}
            <NewsMarkdown body={item.body} />
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  )
}
