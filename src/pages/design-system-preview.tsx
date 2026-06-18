import {
  ArrowRightIcon,
  HeartIcon,
  SearchIcon,
  ShoppingBagIcon,
  SlidersHorizontalIcon,
  StarIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { assetUrl } from '@/lib/asset-url'

const colorTokens = [
  {
    name: 'Background',
    className: 'bg-background text-foreground',
    cssVar: '--background',
    text: 'Page shell',
  },
  {
    name: 'Card',
    className: 'bg-card text-card-foreground',
    cssVar: '--card',
    text: 'Product surface',
  },
  {
    name: 'Primary',
    className: 'bg-primary text-primary-foreground',
    cssVar: '--primary',
    text: 'Main action',
  },
  {
    name: 'Accent',
    className: 'bg-accent text-accent-foreground',
    cssVar: '--accent',
    text: 'Hover / selected',
  },
  {
    name: 'Muted',
    className: 'bg-muted text-muted-foreground',
    cssVar: '--muted',
    text: 'Subtle area',
  },
  {
    name: 'New',
    className: 'bg-product-new text-product-new-foreground',
    cssVar: '--product-new',
    text: 'Arrival badge',
  },
  {
    name: 'Sale',
    className: 'bg-product-sale text-product-sale-foreground',
    cssVar: '--product-sale',
    text: 'Campaign badge',
  },
]

const spacingTokens = [
  { name: 'gutter', value: 'var(--gutter)', label: 'Page padding' },
  { name: 'card-pad', value: 'var(--card-pad)', label: 'Card padding' },
  { name: 'cluster', value: 'var(--cluster)', label: 'Group gap' },
  { name: 'section', value: 'var(--section)', label: 'Section gap' },
]

const categories = [
  'All',
  'Trout Spoon',
  'Minnow',
  'Hook',
  'Storage',
  'Accessory',
]

const products = [
  {
    name: 'Velvet Arts forte 2.1g',
    category: 'Trout Spoon',
    price: '¥638',
    badge: 'NEW',
    badgeClassName: 'bg-product-new text-product-new-foreground',
    image:
      '/skym-shop-assets/images/items/009a5cdcca1badfeec38fad4838bbb11.jpg',
  },
  {
    name: '1089工房 さかさにょろ Slim 35FS',
    category: 'Minnow',
    price: '¥1,980',
    badge: 'LIMITED',
    badgeClassName: 'bg-primary text-primary-foreground',
    image:
      '/skym-shop-assets/images/items/02d6f2ac86e6516284eb5680692eabff.jpg',
  },
  {
    name: 'SKYM original hook set',
    category: 'Hook',
    price: '¥880',
    badge: 'SALE',
    badgeClassName: 'bg-product-sale text-product-sale-foreground',
    image:
      '/skym-shop-assets/images/items/04ac9a0e6908849f3cf8a5d496c1f898.jpg',
  },
]

const stats = [
  { value: '784', label: 'Asset images' },
  { value: '2', label: 'Color modes' },
  { value: '4', label: 'Spacing tokens' },
]

export function DesignSystemPreview() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-gutter py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <p className="shrink-0 font-heading text-base font-semibold">
              SKYMSHOP
            </p>
            <Separator className="hidden h-5 sm:block" orientation="vertical" />
            <p className="truncate text-sm font-medium text-muted-foreground">
              Design system preview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/">Home</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="relative isolate flex min-h-[430px] items-end overflow-hidden">
        <img
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover"
          src={assetUrl('/skym-shop-assets/images/site/skym-hero.jpg')}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,oklch(0.14_0.025_245_/_.86),oklch(0.14_0.025_245_/_.34)_56%,transparent)]" />
        <div className="mx-auto grid w-full max-w-7xl gap-cluster px-gutter py-section text-white lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/15 text-white ring-1 ring-white/20">
              SKYM SHOP
            </Badge>
            <h1 className="font-heading text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
              Design System Preview
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              商品写真、余白、角丸、ボタン、バッジを同じトークンで並べて確認するための画面です。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg">
                Product list
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button
                className="border-white/35 bg-white/10 text-white hover:bg-white/18"
                size="lg"
                variant="outline"
              >
                <SlidersHorizontalIcon data-icon="inline-start" />
                Tokens
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/16 bg-white/10 p-2 text-white backdrop-blur">
            {stats.map((stat) => (
              <div
                className="min-w-0 rounded-lg bg-white/10 p-3"
                key={stat.label}
              >
                <p className="text-2xl leading-none font-semibold">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs leading-4 text-white/72">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-section px-gutter py-section">
        <section className="grid gap-cluster lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid content-start gap-5">
            <SectionHeader
              description="背景、カード、CTA、状態表示の基本色です。ライト/ダーク切替で同じUIのコントラストを確認できます。"
              title="Color Tokens"
            />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {colorTokens.map((token) => (
                <div
                  className="overflow-hidden rounded-lg border bg-card"
                  key={token.name}
                >
                  <div className={`flex h-24 items-end p-3 ${token.className}`}>
                    <span className="text-sm font-medium">{token.text}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <p className="text-sm font-medium">{token.name}</p>
                    <code className="text-xs text-muted-foreground">
                      {token.cssVar}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid content-start gap-5">
            <SectionHeader
              description="画面幅に合わせて変わる余白と、shadcnの角丸スケールです。"
              title="Spacing / Radius"
            />
            <Card>
              <CardContent className="grid gap-5">
                {spacingTokens.map((token) => (
                  <div className="grid gap-2" key={token.name}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">{token.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {token.label}
                        </p>
                      </div>
                      <code className="text-xs text-muted-foreground">
                        {token.value}
                      </code>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: token.value }}
                      />
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="grid grid-cols-4 gap-3">
                  {['sm', 'md', 'lg', 'xl'].map((radius) => (
                    <div className="grid gap-2" key={radius}>
                      <div
                        className={`h-14 border bg-accent ${
                          radius === 'sm'
                            ? 'rounded-sm'
                            : radius === 'md'
                              ? 'rounded-md'
                              : radius === 'lg'
                                ? 'rounded-lg'
                                : 'rounded-xl'
                        }`}
                      />
                      <p className="text-center text-xs text-muted-foreground">
                        {radius}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-cluster">
          <SectionHeader
            description="商品一覧、カテゴリ選択、購入導線の最小単位です。"
            title="Shop Components"
          />

          <div className="flex flex-col gap-3 rounded-xl border bg-card p-card-pad sm:flex-row sm:items-center">
            <div className="flex min-h-10 flex-1 items-center gap-2 rounded-lg border bg-background px-3 text-muted-foreground">
              <SearchIcon aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate text-sm">
                Search lures, hooks, cases
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  size="sm"
                  variant={index === 0 ? 'secondary' : 'ghost'}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>

        <section className="grid gap-cluster lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid content-start gap-5">
            <SectionHeader
              description="shadcnのButtonとBadgeが、現在のトークンでどう見えるかをまとめています。"
              title="Actions / States"
            />
            <div className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button size="icon" variant="outline">
                <HeartIcon aria-hidden="true" />
                <span className="sr-only">Favorite</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge className="bg-product-new text-product-new-foreground">
                NEW
              </Badge>
              <Badge className="bg-product-sale text-product-sale-foreground">
                SALE
              </Badge>
              <Badge variant="outline">OUTLINE</Badge>
            </div>
          </div>

          <Card className="bg-brand text-brand-foreground">
            <CardHeader>
              <CardTitle>Featured Surface</CardTitle>
              <CardDescription className="text-brand-foreground/72">
                ブランド面の見え方をCTA込みで確認します。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    aria-hidden="true"
                    className="size-4 fill-current"
                    key={index}
                  />
                ))}
              </div>
              <p className="text-sm leading-6 text-brand-foreground/78">
                濃色面では写真を置きすぎず、価格や購入ボタンの視認性を優先します。
              </p>
            </CardContent>
            <CardFooter className="border-white/15 bg-white/10">
              <Button className="w-full bg-white text-slate-950 hover:bg-white/90">
                Add to cart
                <ShoppingBagIcon data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  )
}

type Product = (typeof products)[number]

function SectionHeader({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="gap-0 py-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          alt=""
          className="size-full object-cover"
          src={assetUrl(product.image)}
        />
        <div className="absolute top-3 left-3">
          <Badge className={product.badgeClassName}>{product.badge}</Badge>
        </div>
        <Button
          className="absolute top-3 right-3 bg-background/90 backdrop-blur"
          size="icon-sm"
          variant="outline"
        >
          <HeartIcon aria-hidden="true" />
          <span className="sr-only">Favorite</span>
        </Button>
      </div>
      <CardHeader>
        <CardDescription>{product.category}</CardDescription>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <p className="text-xl font-semibold">{product.price}</p>
          <Badge variant="outline">Stock</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Add to cart
          <ShoppingBagIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
