import {
  ArrowLeftIcon,
  ChevronDownIcon,
  EyeIcon,
  ImageIcon,
  SaveIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'

import { ProductStatusBadges } from '@/components/product-status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { assetUrl } from '@/lib/asset-url'
import { getProductStock } from '@/lib/product-stock'
import {
  productBrands,
  productCategories,
  products,
  type Product,
} from '@/lib/shop-content'

const fieldWrapperClassName = 'grid min-w-0 content-start gap-1.5'
const fieldLabelClassName = 'text-xs font-medium text-muted-foreground'
const selectFieldClassName =
  'h-11 w-full min-w-0 cursor-pointer appearance-none rounded-lg border border-input bg-background py-0 pr-10 pl-3 text-base font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm'
const editableProductCategories = productCategories.filter(
  (category) => category !== '全て',
)

function getPriceInputValue(price?: string) {
  return price?.replace(/[^\d]/g, '')
}

export function AdminProductNewPage() {
  return <AdminProductFormPage mode="new" />
}

export function AdminProductDetailPage() {
  const { productId } = useParams()
  const product = products.find((item) => String(item.id) === productId)

  if (!product) {
    return <ProductNotFound productId={productId} />
  }

  return <AdminProductFormPage mode="detail" product={product} />
}

function AdminProductFormPage({
  mode,
  product,
}: {
  mode: 'detail' | 'new'
  product?: Product
}) {
  const isNew = mode === 'new'
  const stock = product ? getProductStock(product) : 0
  const regularPrice = getPriceInputValue(
    product?.sale?.originalPrice ?? product?.price,
  )
  const salePrice = product?.sale ? getPriceInputValue(product.price) : ''
  const description = product?.description.join('\n\n') ?? ''
  const imageUrls = product?.images ?? []
  const firstSpec = product?.specs[0]
  const secondSpec = product?.specs[1]
  const pageTitle = isNew ? '商品登録' : (product?.name ?? '商品詳細')

  return (
    <>
      <section className="border-b pb-5">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="outline">
              <Link to="/admin/products">
                <ArrowLeftIcon data-icon="inline-start" />
                商品一覧
              </Link>
            </Button>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {!isNew && product ? (
                <Button asChild variant="outline">
                  <Link to={`/items/${product.id}`}>
                    <EyeIcon data-icon="inline-start" />
                    ストア表示
                  </Link>
                </Button>
              ) : null}
              <Button type="button">
                <SaveIcon data-icon="inline-start" />
                保存
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary">
                  {isNew ? '新規' : `ID ${product?.id}`}
                </Badge>
                {product ? (
                  <ProductStatusBadges statuses={product.statuses} />
                ) : null}
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
                {pageTitle}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <form className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">基本情報</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 admin-top-nav:grid-cols-2">
              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>商品名</span>
                <Input
                  defaultValue={product?.name}
                  placeholder="フォルテ 2.1g（シルバー）"
                  type="text"
                />
              </label>

              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>ブランド</span>
                <SelectField defaultValue={product?.brand}>
                  {productBrands.map((brand) => (
                    <option key={brand}>{brand}</option>
                  ))}
                </SelectField>
              </label>

              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>カテゴリー</span>
                <SelectField defaultValue={product?.category}>
                  {editableProductCategories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </SelectField>
              </label>

              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>公開状態</span>
                <PublishStateToggle defaultPublished={!isNew} />
              </label>
            </div>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>概要</span>
              <Textarea
                className="min-h-28"
                defaultValue={product?.summary}
                placeholder="一覧や商品詳細の冒頭に表示する短い説明"
              />
            </label>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>商品説明</span>
              <Textarea
                defaultValue={description}
                placeholder="商品の特徴、使いどころ、推奨シーンなど"
              />
            </label>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">仕様</h2>
            </div>

            <div className="grid gap-3">
              <SpecFields label={firstSpec?.label} value={firstSpec?.value} />
              <SpecFields label={secondSpec?.label} value={secondSpec?.value} />
              <SpecFields />
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">販売情報</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>通常価格</span>
                <Input
                  defaultValue={regularPrice}
                  min={1}
                  placeholder="500"
                  step={1}
                  type="number"
                />
              </label>

              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>セール価格</span>
                <Input
                  defaultValue={salePrice}
                  placeholder="任意"
                  min={1}
                  step={1}
                  type="number"
                />
              </label>

              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>在庫数</span>
                <Input
                  defaultValue={String(stock)}
                  min={0}
                  step={1}
                  type="number"
                />
              </label>
            </div>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">画像</h2>
            </div>

            <ProductImagesField imageUrls={imageUrls} />
          </section>
        </aside>
      </form>
    </>
  )
}

function ProductImagesField({ imageUrls }: { imageUrls: readonly string[] }) {
  const visibleImageUrls =
    imageUrls.length >= 3
      ? imageUrls
      : [
          ...imageUrls,
          ...Array.from({ length: 3 - imageUrls.length }, () => ''),
        ]

  return (
    <div className="grid min-w-0 gap-3">
      {visibleImageUrls.map((imageUrl, index) => (
        <div
          className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] items-start gap-3 rounded-lg border bg-muted/35 p-3"
          key={index}
        >
          <div className="overflow-hidden rounded-lg border bg-muted">
            {imageUrl ? (
              <img
                alt=""
                className="aspect-square w-full object-cover"
                src={assetUrl(imageUrl)}
              />
            ) : (
              <div className="grid aspect-square place-items-center text-muted-foreground">
                <ImageIcon aria-hidden="true" className="size-5" />
              </div>
            )}
          </div>

          <label className={fieldWrapperClassName}>
            <span className="flex min-w-0 items-center gap-2">
              <span className={fieldLabelClassName}>画像URL {index + 1}</span>
              {index === 0 ? (
                <Badge className="bg-primary/10 text-primary">メイン</Badge>
              ) : null}
            </span>
            <Input
              defaultValue={imageUrl}
              placeholder="/images/product.jpg"
              type="text"
            />
          </label>
        </div>
      ))}
    </div>
  )
}

function PublishStateToggle({
  defaultPublished,
}: {
  defaultPublished: boolean
}) {
  const [isPublished, setIsPublished] = useState(defaultPublished)

  return (
    <button
      aria-checked={isPublished}
      aria-label={isPublished ? '商品を非公開にする' : '商品を公開する'}
      className="inline-flex h-11 w-full items-center justify-between rounded-lg border bg-background px-3 text-sm font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={() => setIsPublished((current) => !current)}
      role="switch"
      type="button"
    >
      <span>{isPublished ? '公開' : '非公開'}</span>
      <span
        aria-hidden="true"
        className={[
          'relative h-6 w-11 rounded-full transition-colors',
          isPublished ? 'bg-primary' : 'bg-muted-foreground/45',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-1 left-1 size-4 rounded-full bg-background transition-transform',
            isPublished ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </span>
    </button>
  )
}

function SelectField({
  children,
  defaultValue,
}: {
  children: React.ReactNode
  defaultValue?: string
}) {
  return (
    <span className="relative">
      <select className={selectFieldClassName} defaultValue={defaultValue}>
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  )
}

function SpecFields({ label, value }: { label?: string; value?: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(160px,0.36fr)_minmax(0,1fr)]">
      <label className={fieldWrapperClassName}>
        <span className={fieldLabelClassName}>項目名</span>
        <Input defaultValue={label} placeholder="ウエイト" type="text" />
      </label>
      <label className={fieldWrapperClassName}>
        <span className={fieldLabelClassName}>内容</span>
        <Input defaultValue={value} placeholder="2.1g" type="text" />
      </label>
    </div>
  )
}

function ProductNotFound({ productId }: { productId?: string }) {
  return (
    <>
      <section className="border-b pb-5">
        <div className="flex h-10 items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
              商品が見つかりません
            </h1>
          </div>
        </div>
      </section>

      <section className="grid min-h-[320px] place-items-center rounded-lg border bg-card p-6 text-center">
        <div className="grid max-w-md gap-5">
          <div className="grid gap-2">
            <p className="font-heading text-lg font-semibold">
              商品ID {productId ?? '-'} は表示できません
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              商品一覧から対象の商品を選択してください。
            </p>
          </div>

          <div className="flex justify-center">
            <Button asChild>
              <Link to="/admin/products">
                <ArrowLeftIcon data-icon="inline-start" />
                商品一覧へ戻る
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
