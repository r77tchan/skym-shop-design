import {
  ArrowLeftIcon,
  ChevronDownIcon,
  EyeIcon,
  ExternalLinkIcon,
  ImageIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  UploadIcon,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { ProductStatusBadges } from '@/components/product-status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { assetUrl } from '@/lib/asset-url'
import { getProductStatuses } from '@/lib/product-status'
import { getProductStock } from '@/lib/product-stock'
import {
  getEditableProductSpecs,
  getProductPath,
  isProductPublished,
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
  const navigate = useNavigate()
  const isNew = mode === 'new'
  const stock = product ? getProductStock(product) : 0
  const regularPrice = getPriceInputValue(
    product?.sale?.originalPrice ?? product?.price,
  )
  const salePrice = product?.sale ? getPriceInputValue(product.price) : ''
  const description = product?.description.join('\n\n') ?? ''
  const imageUrls = product?.images ?? []
  const specs = product ? getEditableProductSpecs(product) : []
  const isPublished = product ? isProductPublished(product) : false
  const productStatuses = product ? getProductStatuses(product) : []
  const pageTitle = isNew ? '商品登録' : (product?.name ?? '商品詳細')

  return (
    <>
      <section className="border-b pb-5">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              onClick={() => navigate(-1)}
              type="button"
              variant="outline"
            >
              <ArrowLeftIcon data-icon="inline-start" />
              Back
            </Button>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {!isNew && product && isPublished ? (
                <Button asChild className="h-10 px-3" variant="outline">
                  <Link to={getProductPath(product)}>
                    <ExternalLinkIcon data-icon="inline-start" />
                    ストア表示
                  </Link>
                </Button>
              ) : null}

              <Button className="h-10 px-3" type="button" variant="outline">
                <EyeIcon data-icon="inline-start" />
                プレビュー
              </Button>

              <Button className="h-10 px-3" type="button">
                <SaveIcon data-icon="inline-start" />
                {isNew ? '登録' : '保存'}
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
                  <ProductStatusBadges statuses={productStatuses} />
                ) : null}
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
                {pageTitle}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <form className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">基本情報</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 admin-top-nav:grid-cols-2">
              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>商品名</span>
                <Input defaultValue={product?.name} type="text" />
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
                <PublishStateToggle
                  defaultPublished={isPublished}
                  disabled={isNew}
                />
              </label>
            </div>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>キャッチフレーズ</span>
              <Input defaultValue={product?.summary} type="text" />
            </label>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>商品説明</span>
              <Textarea defaultValue={description} />
            </label>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">スペック</h2>
            </div>

            <ProductSpecsField key={product?.id ?? 'new'} specs={specs} />
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
                  step={1}
                  type="number"
                />
              </label>

              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>セール価格</span>
                <Input
                  defaultValue={salePrice}
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

            <ProductImagesField
              key={product?.id ?? 'new'}
              imageUrls={imageUrls}
            />
          </section>
        </aside>
      </form>
    </>
  )
}

type ProductImageSlot = {
  existingUrl: string
  file?: File
  id: string
  previewUrl?: string
}

function createImageSlots(imageUrls: readonly string[]): ProductImageSlot[] {
  const urls = imageUrls.length > 0 ? imageUrls : ['']

  return urls.map((imageUrl, index) => ({
    existingUrl: imageUrl,
    id: `image-${index}`,
  }))
}

function createEmptyImageSlot(index: number): ProductImageSlot {
  return {
    existingUrl: '',
    id: `image-${index}`,
  }
}

function ProductImagesField({ imageUrls }: { imageUrls: readonly string[] }) {
  const [imageSlots, setImageSlots] = useState(() =>
    createImageSlots(imageUrls),
  )
  const nextSlotIndex = useRef(imageSlots.length)
  const previewUrls = useRef(new Set<string>())

  useEffect(() => {
    const trackedPreviewUrls = previewUrls.current

    return () => {
      trackedPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function addImageSlot() {
    const nextIndex = nextSlotIndex.current
    nextSlotIndex.current += 1

    setImageSlots((current) => [...current, createEmptyImageSlot(nextIndex)])
  }

  function removeImageSlot(slotId: string) {
    const slot = imageSlots.find((item) => item.id === slotId)

    if (slot?.previewUrl) {
      URL.revokeObjectURL(slot.previewUrl)
      previewUrls.current.delete(slot.previewUrl)
    }

    setImageSlots((current) => {
      const nextSlots = current.filter((slot) => slot.id !== slotId)

      return nextSlots.length > 0 ? nextSlots : [createEmptyImageSlot(0)]
    })
  }

  function updateImageFile(slotId: string, file: File) {
    const previewUrl = URL.createObjectURL(file)
    const currentSlot = imageSlots.find((slot) => slot.id === slotId)

    if (currentSlot?.previewUrl) {
      URL.revokeObjectURL(currentSlot.previewUrl)
      previewUrls.current.delete(currentSlot.previewUrl)
    }

    previewUrls.current.add(previewUrl)

    setImageSlots((current) =>
      current.map((slot) =>
        slot.id === slotId ? { ...slot, file, previewUrl } : slot,
      ),
    )
  }

  return (
    <div className="grid min-w-0 gap-3">
      {imageSlots.map((slot, index) => (
        <ProductImageSlotField
          canRemove={
            imageSlots.length > 1 || Boolean(slot.existingUrl || slot.file)
          }
          index={index}
          isPrimary={index === 0}
          key={slot.id}
          onFileChange={(file) => updateImageFile(slot.id, file)}
          onRemove={() => removeImageSlot(slot.id)}
          slot={slot}
        />
      ))}

      <Button
        className="h-10 w-full border-dashed"
        onClick={addImageSlot}
        type="button"
        variant="outline"
      >
        <PlusIcon data-icon="inline-start" />
        画像を追加
      </Button>
    </div>
  )
}

function ProductImageSlotField({
  canRemove,
  index,
  isPrimary,
  onFileChange,
  onRemove,
  slot,
}: {
  canRemove: boolean
  index: number
  isPrimary: boolean
  onFileChange: (file: File) => void
  onRemove: () => void
  slot: ProductImageSlot
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputId = `${slot.id}-file`
  const displayImageUrl =
    slot.previewUrl ??
    (slot.existingUrl ? assetUrl(slot.existingUrl) : undefined)
  const fileName = slot.file?.name ?? getImageFileName(slot.existingUrl)
  const fileInfo = slot.file ? formatFileSize(slot.file.size) : '登録済み画像'

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    if (file) {
      onFileChange(file)
    }

    event.currentTarget.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)

    const file = Array.from(event.dataTransfer.files).find((item) =>
      item.type.startsWith('image/'),
    )

    if (file) {
      onFileChange(file)
    }
  }

  return (
    <div className="grid min-w-0 gap-3 rounded-lg border bg-muted/35 p-3">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className={fieldLabelClassName}>画像 {index + 1}</span>
          {isPrimary ? (
            <Badge className="bg-primary/10 text-primary">メイン</Badge>
          ) : null}
        </span>

        <Button
          aria-hidden={!canRemove}
          aria-label={`画像 ${index + 1} を削除`}
          className={canRemove ? undefined : 'invisible'}
          disabled={!canRemove}
          onClick={onRemove}
          size="icon"
          tabIndex={canRemove ? undefined : -1}
          type="button"
          variant="ghost"
        >
          <Trash2Icon aria-hidden="true" />
        </Button>
      </div>

      <div
        className={[
          'grid aspect-square min-w-0 place-items-center overflow-hidden rounded-lg border bg-background text-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          displayImageUrl ? 'border-input' : 'border-dashed border-input p-4',
          isDragging ? 'border-primary bg-primary/5' : '',
        ].join(' ')}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'copy'
          setIsDragging(true)
        }}
        onDrop={handleDrop}
        tabIndex={0}
      >
        {displayImageUrl ? (
          <img
            alt=""
            className="size-full object-cover"
            src={displayImageUrl}
          />
        ) : (
          <div className="grid justify-items-center gap-3 text-muted-foreground">
            <ImageIcon aria-hidden="true" className="size-8" />
            <div className="grid gap-1">
              <span className="text-sm font-medium text-foreground">
                ドラッグ&ドロップ
              </span>
              <span className="text-xs">またはファイルを選択</span>
            </div>
            <Button asChild className="h-9 px-3">
              <label htmlFor={inputId}>
                <UploadIcon data-icon="inline-start" />
                ファイル選択
              </label>
            </Button>
          </div>
        )}
      </div>

      {displayImageUrl ? (
        <div className="grid min-w-0 gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{fileName}</p>
            <p className="text-xs text-muted-foreground">{fileInfo}</p>
          </div>

          <Button asChild className="h-9 px-3" variant="outline">
            <label htmlFor={inputId}>
              <UploadIcon data-icon="inline-start" />
              ファイル変更
            </label>
          </Button>
        </div>
      ) : null}

      <input
        accept="image/*"
        className="sr-only"
        id={inputId}
        onChange={handleFileChange}
        type="file"
      />
    </div>
  )
}

function getImageFileName(imageUrl: string) {
  const segments = imageUrl.split('/').filter(Boolean)
  return segments[segments.length - 1] ?? '画像未選択'
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function PublishStateToggle({
  defaultPublished,
  disabled = false,
}: {
  defaultPublished: boolean
  disabled?: boolean
}) {
  const [isPublished, setIsPublished] = useState(defaultPublished)

  return (
    <button
      aria-checked={isPublished}
      aria-label={
        disabled
          ? '商品は非公開です'
          : isPublished
            ? '商品を非公開にする'
            : '商品を公開する'
      }
      className={[
        'inline-flex h-11 w-full items-center justify-between rounded-lg border px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        disabled
          ? 'cursor-not-allowed bg-muted/45 text-muted-foreground'
          : 'bg-background hover:bg-accent/55',
      ].join(' ')}
      disabled={disabled}
      onClick={() => setIsPublished((current) => !current)}
      role="switch"
      type="button"
    >
      <span>{isPublished ? '公開' : '非公開'}</span>
      <span
        aria-hidden="true"
        className={[
          'relative h-6 w-11 rounded-full transition-colors',
          disabled
            ? 'bg-muted-foreground/25'
            : isPublished
              ? 'bg-primary'
              : 'bg-muted-foreground/45',
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

type ProductSpecSlot = {
  id: string
  label: string
  value: string
}

function createSpecSlots(specs: Product['specs']): ProductSpecSlot[] {
  const sourceSpecs = specs.length > 0 ? specs : [{ label: '', value: '' }]

  return sourceSpecs.map((spec, index) => ({
    id: `spec-${index}`,
    label: spec.label,
    value: spec.value,
  }))
}

function createEmptySpecSlot(index: number): ProductSpecSlot {
  return {
    id: `spec-${index}`,
    label: '',
    value: '',
  }
}

function ProductSpecsField({ specs }: { specs: Product['specs'] }) {
  const [specSlots, setSpecSlots] = useState(() => createSpecSlots(specs))
  const nextSlotIndex = useRef(specSlots.length)

  function addSpecSlot() {
    const nextIndex = nextSlotIndex.current
    nextSlotIndex.current += 1

    setSpecSlots((current) => [...current, createEmptySpecSlot(nextIndex)])
  }

  function removeSpecSlot(slotId: string) {
    setSpecSlots((current) => {
      const nextSlots = current.filter((slot) => slot.id !== slotId)

      return nextSlots.length > 0 ? nextSlots : [createEmptySpecSlot(0)]
    })
  }

  function updateSpecSlot(
    slotId: string,
    field: 'label' | 'value',
    value: string,
  ) {
    setSpecSlots((current) =>
      current.map((slot) =>
        slot.id === slotId ? { ...slot, [field]: value } : slot,
      ),
    )
  }

  return (
    <div className="grid min-w-0 gap-3">
      {specSlots.map((slot, index) => {
        const canRemove =
          specSlots.length > 1 || Boolean(slot.label || slot.value)

        return (
          <div
            className="grid min-w-0 gap-3 rounded-lg border bg-muted/35 p-3"
            key={slot.id}
          >
            <div className="flex min-w-0 items-center justify-between gap-2">
              <span className={fieldLabelClassName}>スペック {index + 1}</span>

              <Button
                aria-hidden={!canRemove}
                aria-label={`スペック ${index + 1} を削除`}
                className={canRemove ? undefined : 'invisible'}
                disabled={!canRemove}
                onClick={() => removeSpecSlot(slot.id)}
                size="icon"
                tabIndex={canRemove ? undefined : -1}
                type="button"
                variant="ghost"
              >
                <Trash2Icon aria-hidden="true" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(160px,0.36fr)_minmax(0,1fr)]">
              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>項目</span>
                <Input
                  onChange={(event) =>
                    updateSpecSlot(slot.id, 'label', event.currentTarget.value)
                  }
                  type="text"
                  value={slot.label}
                />
              </label>

              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>値</span>
                <Input
                  onChange={(event) =>
                    updateSpecSlot(slot.id, 'value', event.currentTarget.value)
                  }
                  type="text"
                  value={slot.value}
                />
              </label>
            </div>
          </div>
        )
      })}

      <Button
        className="h-10 w-full border-dashed"
        onClick={addSpecSlot}
        type="button"
        variant="outline"
      >
        <PlusIcon data-icon="inline-start" />
        スペックを追加
      </Button>
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
