import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'

import { NewsImage } from '@/components/news-image'
import { NewsLabelBadge } from '@/components/news-label-badge'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getNewsItemPath, newsItems } from '@/lib/shop-content'
import {
  interactiveCardLinkClassName,
  interactiveCardTitleClassName,
} from '@/lib/ui-styles'
import { cn } from '@/lib/utils'

export function NewsPage() {
  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />

      <section className="border-b bg-muted/35 pt-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-10 sm:py-12">
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

          <div className="max-w-3xl">
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
              className={cn(
                interactiveCardLinkClassName,
                'grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-4 sm:grid-cols-[auto_minmax(0,1fr)_2rem] sm:gap-5',
              )}
              key={item.id}
              to={getNewsItemPath(item)}
            >
              <NewsImage
                alt=""
                className="size-24 rounded-md border sm:size-28"
                src={item.mainImageUrl}
              />

              <div className="grid min-w-0 gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <time
                    className="text-xs font-medium text-muted-foreground"
                    dateTime={item.publishedOn.replaceAll('.', '-')}
                  >
                    {item.publishedOn}
                  </time>
                  {item.tag ? <NewsLabelBadge label={item.tag} /> : null}
                </div>

                <h2
                  className={cn(
                    'text-base leading-6 font-semibold',
                    interactiveCardTitleClassName,
                  )}
                >
                  {item.title}
                </h2>
              </div>

              <ArrowRightIcon
                aria-hidden="true"
                className="hidden size-4 text-muted-foreground group-hover:text-primary sm:block sm:justify-self-end"
              />
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
