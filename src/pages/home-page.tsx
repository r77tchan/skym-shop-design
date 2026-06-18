import { ArrowRightIcon, ShoppingCartIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assetUrl } from '@/lib/asset-url'
import { cn } from '@/lib/utils'

const newsItems = [
  {
    date: '2026.06.01',
    label: '入荷',
    title: 'ValkeINスプーン 入荷しました',
    body: '人気のValkeINスプーンが各カラー再入荷しました。',
  },
  {
    date: '2026.05.28',
    label: '入荷',
    title: 'ロデオクラフト ドリフトスピン 入荷しました',
    body: '高実績のドリフトスピンが入荷。エリアの定番スプーンです。',
  },
  {
    date: '2026.05.25',
    label: 'SALE',
    title: 'サマーセール開催中',
    body: '対象のルアーが最大50%OFF。この機会にぜひ。',
  },
]

const shopDescription =
  '株式会社SKYM が運営するフィッシングタックル オンラインストア。トラウトを中心に、フィールドを愛するアングラーへ確かな道具をお届けします。'

const products = [
  {
    name: '〖VELVET ARTS〗フォルテ 2.1g（二代目鱒王）',
    brand: 'VELVET ARTS',
    price: 'SOLD OUT',
    status: 'SOLD OUT',
    image:
      '/skym-shop-assets/images/items/009a5cdcca1badfeec38fad4838bbb11.jpg',
  },
  {
    name: '〖VELVET ARTS〗フォルテ 2.1g（キックオンザフェスタ）',
    brand: 'VELVET ARTS',
    price: 'SOLD OUT',
    status: 'SOLD OUT',
    image:
      '/skym-shop-assets/images/items/0f3609149d944d478f4f2004dcf8842a.jpg',
  },
  {
    name: '〖VELVET ARTS〗フォルテ 2.1g（シルバー）',
    brand: 'VELVET ARTS',
    price: '¥500',
    status: 'NEW',
    image:
      '/skym-shop-assets/images/items/161b25ac6ba3c56743cad57b38ad7ee5.jpg',
  },
  {
    name: '1089工房 さかさにょろ Slim 35FS',
    brand: '1089工房',
    price: '¥1,980',
    status: 'LIMITED',
    image:
      '/skym-shop-assets/images/items/02d6f2ac86e6516284eb5680692eabff.jpg',
  },
  {
    name: '〖ValkeIN〗HI BURST 1.6g(UVフラッシュ)',
    brand: 'ValkeIN',
    price: '¥400',
    status: 'RESTOCK',
    image:
      '/skym-shop-assets/images/items/01ffb9bb455cb67ba79e0f8049e3c6e0.jpg',
  },
  {
    name: '〖RODIO CRAFT〗ドリフトスピン',
    brand: 'RODIO CRAFT',
    price: '¥500',
    status: 'NEW',
    image:
      '/skym-shop-assets/images/items/033805811c6e8f5bae5e02633d66741f.jpg',
  },
]

export function HomePage() {
  const [isHeaderPinned, setIsHeaderPinned] = useState(false)

  useEffect(() => {
    const updateHeaderState = () => {
      setIsHeaderPinned(window.scrollY > 24)
    }

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateHeaderState)
    }
  }, [])

  return (
    <main className="min-h-svh bg-background text-foreground">
      <header
        className={cn(
          'site-header fixed inset-x-0 top-0 z-50',
          isHeaderPinned ? 'site-header--pinned' : 'site-header--top',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-gutter py-3">
          <Link
            className={cn(
              'shrink-0 font-heading text-base font-semibold tracking-normal',
              isHeaderPinned
                ? 'drop-shadow-none'
                : 'drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]',
            )}
            to="/"
          >
            SKYMSHOP
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle
              activeButtonClassName="header-control-button--active"
              buttonClassName="header-control-button"
              className="header-control-group"
            />
            <Button
              aria-label="カート"
              className="header-control-button size-[38px]"
              size="icon-sm"
              title="カート"
              variant="ghost"
            >
              <ShoppingCartIcon aria-hidden="true" className="size-3.5" />
              <span className="sr-only">カート</span>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative isolate flex min-h-[620px] items-end overflow-hidden lg:min-h-[88svh]">
        <img
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover"
          src={assetUrl('/skym-shop-assets/images/site/skym-hero.jpg')}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.14_0.025_245_/_.02)_0%,oklch(0.14_0.025_245_/_.06)_42%,oklch(0.14_0.025_245_/_.3)_100%)] sm:bg-[linear-gradient(90deg,oklch(0.14_0.025_245_/_.16),oklch(0.14_0.025_245_/_.08)_45%,transparent_72%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_22%_78%,oklch(0.11_0.02_245_/_.68)_0%,oklch(0.11_0.02_245_/_.42)_30%,oklch(0.11_0.02_245_/_.16)_52%,transparent_70%)] sm:bg-[radial-gradient(ellipse_at_23%_82%,oklch(0.11_0.02_245_/_.62)_0%,oklch(0.11_0.02_245_/_.36)_30%,oklch(0.11_0.02_245_/_.1)_52%,transparent_68%)]" />
        <div className="mx-auto w-full max-w-7xl px-gutter py-section text-white">
          <div className="max-w-2xl">
            <div className="mb-5">
              <Badge className="bg-black/32 text-white ring-1 ring-white/20">
                SKYMSHOP FISHING TACKLE STORE
              </Badge>
            </div>
            <h1 className="sr-only">SKYMSHOP FISHING TACKLE STORE</h1>
            <p className="max-w-xl text-[0.95rem] leading-8 font-medium text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.86)] sm:text-lg">
              {shopDescription}
            </p>
          </div>
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
            <Button
              asChild
              className="shrink-0 border-primary/25 bg-primary/10 px-3.5 text-primary hover:bg-primary hover:text-primary-foreground"
              variant="outline"
            >
              <a href="#all-items">
                全ての商品
                <ArrowRightIcon data-icon="inline-end" />
              </a>
            </Button>
          </div>

          <div className="-mx-gutter [scrollbar-width:none] overflow-x-auto px-gutter pb-2 [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-4">
              {products.map((product) => (
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
            <Button
              asChild
              className="shrink-0 border-primary/25 bg-primary/10 px-3.5 text-primary hover:bg-primary hover:text-primary-foreground"
              variant="outline"
            >
              <a href="#news">
                全てのお知らせ
                <ArrowRightIcon data-icon="inline-end" />
              </a>
            </Button>
          </div>

          <div className="grid gap-3">
            {newsItems.map((item) => (
              <a
                className="grid gap-2 rounded-lg border bg-background p-4 hover:bg-accent sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:items-center"
                href="#all-items"
                key={item.title}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {item.date}
                </span>
                <Badge variant={item.label === 'SALE' ? 'default' : 'outline'}>
                  {item.label}
                </Badge>
                <span className="min-w-0 text-sm font-medium">
                  {item.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-footer-border bg-footer text-footer-foreground">
        <div className="mx-auto grid max-w-7xl gap-section px-gutter py-section md:grid-cols-[minmax(0,1fr)_repeat(2,minmax(140px,180px))]">
          <div>
            <p className="font-heading text-lg font-semibold">SKYMSHOP</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-footer-muted">
              {shopDescription}
            </p>
          </div>
          <FooterColumn
            items={['お問い合わせ', '特定商取引法', 'プライバシーポリシー']}
            title="GUIDE"
          />
          <FooterColumn items={['Instagram', 'X', 'LINE']} title="SNS" />
          <p className="text-xs text-footer-muted md:col-span-3 md:justify-self-end">
            Copyright © SKYM, Inc. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}

type Product = (typeof products)[number]

function ProductRailCard({ product }: { product: Product }) {
  const soldOut = product.status === 'SOLD OUT'

  return (
    <a
      className="group grid w-48 shrink-0 gap-3 rounded-lg border bg-card p-3 hover:border-primary/45 hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none sm:w-52"
      href="#all-items"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
        <img
          alt=""
          className="size-full object-cover group-hover:opacity-92"
          src={assetUrl(product.image)}
        />
      </div>
      <div className="grid min-w-0 gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground group-hover:text-foreground/72">
            {product.brand}
          </p>
          <p className="mt-0.5 [display:-webkit-box] overflow-hidden text-sm leading-5 font-medium [-webkit-box-orient:vertical] [-webkit-line-clamp:2] group-hover:text-primary">
            {product.name}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p
            className={
              soldOut
                ? 'text-sm font-semibold text-muted-foreground'
                : 'text-sm font-semibold'
            }
          >
            {product.price}
          </p>
          <Badge
            className={
              product.status === 'NEW'
                ? 'bg-product-new text-product-new-foreground'
                : undefined
            }
            variant={soldOut ? 'outline' : 'secondary'}
          >
            {soldOut ? 'SOLD' : product.status}
          </Badge>
        </div>
      </div>
    </a>
  )
}

function FooterColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-footer-foreground">{title}</p>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item}>
            <a
              className="text-sm text-footer-muted hover:text-footer-foreground"
              href="#"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
