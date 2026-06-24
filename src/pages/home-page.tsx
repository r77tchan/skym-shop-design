import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'

import { NewsLabelBadge } from '@/components/news-label-badge'
import { ProductPrice } from '@/components/product-price'
import { ProductStatusBadge } from '@/components/product-status-badge'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assetUrl } from '@/lib/asset-url'
import { getPrimaryProductStatus, isSoldOut } from '@/lib/product-status'
import {
  getNewsItemPath,
  getProductPath,
  newsItems,
  shopDescription,
  storefrontProducts,
  type Product,
} from '@/lib/shop-content'
import {
  interactiveCardLinkClassName,
  interactiveCardMutedTextClassName,
  interactiveCardTitleClassName,
  sectionActionButtonClassName,
} from '@/lib/ui-styles'
import { cn } from '@/lib/utils'

const homeProducts = storefrontProducts
  .filter((product) => !isSoldOut(product))
  .slice(0, 6)

export function HomePage() {
  return (
    <main className="min-h-svh bg-background pt-[calc(4rem+1px)] text-foreground sm:pt-0">
      <SiteHeader transparentOnTop transparentOnTopFrom="sm" />

      <section className="relative isolate flex aspect-[16/9] min-h-0 items-end overflow-hidden sm:aspect-auto sm:min-h-[620px] lg:min-h-[88svh]">
        <img
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover"
          src={assetUrl('/skym-shop-assets/images/site/skym-hero.jpg')}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.14_0.025_245_/_.08)_0%,oklch(0.14_0.025_245_/_.02)_42%,oklch(0.14_0.025_245_/_.22)_100%)] sm:bg-[linear-gradient(90deg,oklch(0.14_0.025_245_/_.16),oklch(0.14_0.025_245_/_.08)_45%,transparent_72%)]" />
        <div className="absolute inset-0 -z-10 hidden sm:block sm:bg-[radial-gradient(ellipse_at_23%_82%,oklch(0.11_0.02_245_/_.62)_0%,oklch(0.11_0.02_245_/_.36)_30%,oklch(0.11_0.02_245_/_.1)_52%,transparent_68%)]" />
        <h1 className="sr-only">SKYMSHOP FISHING TACKLE STORE</h1>
        <div className="mx-auto hidden w-full max-w-7xl px-gutter py-section text-white sm:block">
          <div className="max-w-2xl">
            <div className="mb-5">
              <Badge className="bg-black/32 text-white ring-1 ring-white/20">
                SKYMSHOP FISHING TACKLE STORE
              </Badge>
            </div>
            <p className="max-w-xl text-[0.95rem] leading-8 font-medium text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.86)] sm:text-lg">
              {shopDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b bg-background sm:hidden">
        <div className="mx-auto grid max-w-7xl gap-3 px-gutter py-5">
          <Badge className="w-fit bg-secondary text-secondary-foreground">
            SKYMSHOP FISHING TACKLE STORE
          </Badge>
          <p className="text-sm leading-7 font-medium text-foreground/86">
            {shopDescription}
          </p>
        </div>
      </section>

      <section className="border-y bg-background" id="all-items">
        <div className="mx-auto grid max-w-7xl gap-5 px-gutter py-8 sm:gap-6 sm:py-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-primary">ITEMS</p>
              <h2 className="mt-1 font-heading text-xl font-semibold">
                商品一覧
              </h2>
            </div>
            <Button asChild className={sectionActionButtonClassName}>
              <Link to="/items">
                全ての商品
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </div>

          <div className="-mx-gutter [scrollbar-width:none] overflow-x-auto px-gutter pb-2 [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-4">
              {homeProducts.map((product) => (
                <ProductRailCard key={product.name} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/35" id="news">
        <div className="mx-auto grid max-w-7xl gap-5 px-gutter py-8 sm:gap-6 sm:py-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-primary">NEWS</p>
              <h2 className="mt-1 font-heading text-xl font-semibold">
                お知らせ
              </h2>
            </div>
            <Button asChild className={sectionActionButtonClassName}>
              <Link to="/news">
                全てのお知らせ
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3">
            {newsItems.slice(0, 3).map((item) => (
              <Link
                className={cn(
                  interactiveCardLinkClassName,
                  'grid gap-2 p-4 sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:items-center',
                )}
                key={item.title}
                to={getNewsItemPath(item)}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {item.date}
                </span>
                <NewsLabelBadge label={item.label} />
                <span
                  className={cn(
                    'min-w-0 text-sm font-medium',
                    interactiveCardTitleClassName,
                  )}
                >
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function ProductRailCard({ product }: { product: Product }) {
  const primaryStatus = getPrimaryProductStatus(product)

  return (
    <Link
      className={cn(
        interactiveCardLinkClassName,
        'grid w-48 shrink-0 gap-3 p-3 sm:w-52',
      )}
      to={getProductPath(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
        <img
          alt=""
          className="size-full object-cover"
          src={assetUrl(product.image)}
        />
        {primaryStatus ? (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            <ProductStatusBadge status={primaryStatus} />
          </div>
        ) : null}
      </div>
      <div className="grid min-w-0 gap-2">
        <div className="min-w-0">
          <p
            className={cn(
              'truncate text-xs font-medium text-muted-foreground',
              interactiveCardMutedTextClassName,
            )}
          >
            {product.brand}
          </p>
          <p
            className={cn(
              'mt-0.5 [display:-webkit-box] min-h-10 overflow-hidden text-sm leading-5 font-medium [-webkit-box-orient:vertical] [-webkit-line-clamp:2]',
              interactiveCardTitleClassName,
            )}
          >
            {product.name}
          </p>
        </div>
        <ProductPrice product={product} variant="rail" />
      </div>
    </Link>
  )
}
