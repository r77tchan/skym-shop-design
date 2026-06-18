import { ArrowRightIcon, PaletteIcon } from 'lucide-react'
import { Link } from 'react-router'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const previewProducts = [
  {
    name: 'Velvet Arts forte',
    image:
      '/skym-shop-assets/images/items/009a5cdcca1badfeec38fad4838bbb11.jpg',
  },
  {
    name: '1089工房 さかさにょろ',
    image:
      '/skym-shop-assets/images/items/02d6f2ac86e6516284eb5680692eabff.jpg',
  },
]

export function HomePage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-gutter py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <p className="shrink-0 font-heading text-base font-semibold">
              SKYM TACKLE
            </p>
            <Separator className="hidden h-5 sm:block" orientation="vertical" />
            <p className="truncate text-sm font-medium text-muted-foreground">
              Renewal design draft
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/design-system">
                <PaletteIcon data-icon="inline-start" />
                Tokens
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-cluster px-gutter py-section lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            SKYM TACKLE ONLINE STORE
          </p>
          <h1 className="font-heading text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
            釣具を選ぶ時間まで、使いやすく。
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            商品写真が主役になる余白と、迷わず探せる導線を前提にしたトップページ案をここから作ります。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg">
              商品を見る
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/design-system">
                デザインシステム
                <PaletteIcon data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {previewProducts.map((product, index) => (
            <div
              className={index === 1 ? 'pt-10' : undefined}
              key={product.name}
            >
              <div className="overflow-hidden rounded-xl border bg-card">
                <img
                  alt=""
                  className="aspect-[4/5] size-full object-cover"
                  src={product.image}
                />
              </div>
              <p className="mt-3 text-sm font-medium">{product.name}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
