import {
  ArrowLeftIcon,
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react'
import { Dialog } from 'radix-ui'
import { type FormEvent, type ReactNode, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminNewsLabelOptions } from '@/lib/admin-news'
import {
  productCategoryMasters,
  productBrands,
  type ProductBrand,
  type ProductCategorySpecDefinition,
  type ProductCategorySpecOption,
  type ProductSpecValueType,
} from '@/lib/shop-content'

type NameMasterItem = {
  id: number
  name: string
}

type CategoryMasterItem = {
  brands: readonly ProductBrand[]
  id: number
  name: string
  specs: readonly CategoryMasterSpec[]
  slug: string
}

type CategoryMasterSpecOption = Required<
  Pick<ProductCategorySpecOption, 'label'>
> & {
  id: string
  slug: string
}

type CategoryMasterSpec = Omit<
  ProductCategorySpecDefinition,
  'isFilterable' | 'isRequired' | 'options'
> & {
  id: string
  isFilterable: boolean
  isRequired: boolean
  options: readonly CategoryMasterSpecOption[]
  unit: string
}

const brandMasterItems: NameMasterItem[] = productBrands.map((name, index) => ({
  id: index + 1,
  name,
}))

const categoryMasterItems: CategoryMasterItem[] = productCategoryMasters.map(
  (item, index) => ({
    brands: item.brands,
    id: index + 1,
    name: item.label,
    specs: item.specs.map((spec, specIndex) =>
      createCategoryMasterSpec(spec, specIndex),
    ),
    slug: item.slug,
  }),
)

const newsTagMasterItems: NameMasterItem[] = adminNewsLabelOptions.map(
  (name, index) => ({
    id: index + 1,
    name,
  }),
)

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const specValueTypeOptions = [
  { label: 'テキスト', value: 'text' },
  { label: '数値', value: 'number' },
  { label: '選択式', value: 'option' },
] as const satisfies ReadonlyArray<{
  label: string
  value: ProductSpecValueType
}>

export function AdminSettingsBrandsPage() {
  return (
    <NameMasterSettingsPage
      description="商品登録や商品一覧の絞り込みで使うブランドを管理します。"
      initialItems={brandMasterItems}
      inputLabel="ブランド名"
      messageId="brand-master-message"
      title="ブランド"
    />
  )
}

export function AdminSettingsCategoriesPage() {
  return <CategoryMasterSettingsPage initialItems={categoryMasterItems} />
}

export function AdminSettingsCategoryNewPage() {
  const item = createEmptyCategoryMasterItem(
    getNextMasterId(categoryMasterItems),
  )

  return (
    <CategoryMasterFormPage
      item={item}
      items={categoryMasterItems}
      mode="new"
    />
  )
}

export function AdminSettingsCategoryDetailPage() {
  const { categoryId } = useParams()
  const item = categoryMasterItems.find(
    (category) => String(category.id) === categoryId,
  )

  if (!item) {
    return <Navigate replace to="/admin/settings/categories" />
  }

  return (
    <CategoryMasterFormPage
      item={item}
      items={categoryMasterItems}
      mode="edit"
    />
  )
}

export function AdminSettingsNewsTagsPage() {
  return (
    <NameMasterSettingsPage
      description="お知らせ作成時に選択するタグを管理します。"
      initialItems={newsTagMasterItems}
      inputLabel="タグ名"
      messageId="news-tag-master-message"
      title="お知らせタグ"
    />
  )
}

function SettingsDetailHeader({
  action,
  title,
}: {
  action?: ReactNode
  title: string
}) {
  return (
    <section className="border-b pb-5">
      <div className="grid gap-4">
        <div>
          <Button asChild type="button" variant="outline">
            <Link to="/admin/settings">
              <ArrowLeftIcon data-icon="inline-start" />
              Back
            </Link>
          </Button>
        </div>
        <div className="flex h-10 items-end justify-between gap-4">
          <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
            {title}
          </h1>

          {action ? (
            <div className="flex shrink-0 items-center gap-2">{action}</div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function NameMasterSettingsPage({
  description,
  initialItems,
  inputLabel,
  messageId,
  title,
}: {
  description: string
  initialItems: ReadonlyArray<NameMasterItem>
  inputLabel: string
  messageId: string
  title: string
}) {
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<ReadonlyArray<NameMasterItem>>(
    () => initialItems,
  )
  const [editingItem, setEditingItem] = useState<NameMasterItem | null>(null)
  const normalizedName = inputValue.trim()
  const isDuplicateName = items.some(
    (item) =>
      item.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
  )
  const canAdd = normalizedName.length > 0 && !isDuplicateName
  const message =
    normalizedName.length === 0
      ? null
      : isDuplicateName
        ? '同じ名前が登録済みです'
        : null

  const handleAddItem = () => {
    if (!canAdd) {
      return
    }

    setItems((current) => [
      {
        id: getNextMasterId(current),
        name: normalizedName,
      },
      ...current,
    ])
    setInputValue('')
  }

  const handleDeleteItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const handleUpdateItem = (updatedItem: NameMasterItem) => {
    setItems((current) =>
      current.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    )
    setEditingItem(null)
  }

  return (
    <>
      <SettingsDetailHeader title={title} />

      <section className="grid min-w-0 content-start gap-5 rounded-lg border bg-card p-4">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <form
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            handleAddItem()
          }}
        >
          <label className="grid min-w-0 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {inputLabel}
            </span>
            <Input
              aria-describedby={message ? messageId : undefined}
              aria-invalid={message ? 'true' : undefined}
              className="bg-background"
              onChange={(event) => setInputValue(event.currentTarget.value)}
              type="text"
              value={inputValue}
            />
          </label>
          <Button className="h-11 px-3" disabled={!canAdd} type="submit">
            <PlusIcon data-icon="inline-start" />
            追加
          </Button>
        </form>

        {message ? (
          <p className="text-sm font-medium text-destructive" id={messageId}>
            {message}
          </p>
        ) : null}

        <NameMasterList
          items={items}
          onDeleteItem={handleDeleteItem}
          onEditItem={setEditingItem}
        />
      </section>

      <Dialog.Root
        onOpenChange={(open) => {
          if (!open) {
            setEditingItem(null)
          }
        }}
        open={editingItem !== null}
      >
        {editingItem ? (
          <NameMasterEditDialogContent
            displayId={getMasterDisplayId(items, editingItem.id)}
            inputLabel={inputLabel}
            item={editingItem}
            items={items}
            key={editingItem.id}
            onSaveItem={handleUpdateItem}
            title={title}
          />
        ) : null}
      </Dialog.Root>
    </>
  )
}

function CategoryMasterSettingsPage({
  initialItems,
}: {
  initialItems: ReadonlyArray<CategoryMasterItem>
}) {
  return (
    <>
      <SettingsDetailHeader
        action={
          <Button asChild className="h-10 px-3">
            <Link to="/admin/settings/categories/new">
              <PlusIcon data-icon="inline-start" />
              カテゴリ登録
            </Link>
          </Button>
        }
        title="カテゴリ"
      />

      <section className="grid min-w-0 content-start gap-5 rounded-lg border bg-card p-4">
        <h2 className="font-heading text-base font-semibold">
          登録済みカテゴリ
        </h2>

        <CategoryMasterList items={initialItems} />
      </section>
    </>
  )
}

function NameMasterList({
  items,
  onDeleteItem,
  onEditItem,
}: {
  items: ReadonlyArray<NameMasterItem>
  onDeleteItem: (id: number) => void
  onEditItem: (item: NameMasterItem) => void
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border">
      <div className="grid grid-cols-[48px_64px_minmax(0,1fr)_48px_48px] items-center gap-3 border-b bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
        <span>No</span>
        <span>ID</span>
        <span>名称</span>
        <span>編集</span>
        <span>削除</span>
      </div>

      <div className="divide-y">
        {items.map((item, index) => (
          <article
            className="grid grid-cols-[48px_64px_minmax(0,1fr)_48px_48px] items-center gap-3 px-4 py-3"
            key={item.id}
          >
            <span className="text-sm font-medium tabular-nums">
              {index + 1}
            </span>
            <span className="text-sm font-medium tabular-nums">
              {items.length - index}
            </span>
            <span className="truncate text-sm font-semibold">{item.name}</span>
            <Button
              aria-label={`${item.name}を編集`}
              className="justify-self-start"
              onClick={() => onEditItem(item)}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <PencilIcon aria-hidden="true" />
            </Button>
            <Button
              aria-label={`${item.name}を削除`}
              className="justify-self-start"
              onClick={() => onDeleteItem(item.id)}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <Trash2Icon aria-hidden="true" />
            </Button>
          </article>
        ))}
      </div>
    </div>
  )
}

function CategoryMasterList({
  items,
}: {
  items: ReadonlyArray<CategoryMasterItem>
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border">
      <div className="min-w-0 overflow-x-auto">
        <div className="min-w-[960px]">
          <div className="grid grid-cols-[48px_64px_minmax(140px,0.75fr)_minmax(160px,0.75fr)_minmax(220px,1fr)_minmax(240px,1.15fr)] items-center gap-3 border-b bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>No</span>
            <span>ID</span>
            <span>カテゴリ名</span>
            <span>カテゴリスラッグ</span>
            <span>許可ブランド</span>
            <span>スペック</span>
          </div>

          <div className="divide-y">
            {items.map((item, index) => (
              <Link
                aria-label={`${item.name}を編集`}
                className="grid grid-cols-[48px_64px_minmax(140px,0.75fr)_minmax(160px,0.75fr)_minmax(220px,1fr)_minmax(240px,1.15fr)] items-center gap-3 px-4 py-3 outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                key={item.id}
                to={`/admin/settings/categories/${item.id}`}
              >
                <span className="text-sm font-medium tabular-nums">
                  {index + 1}
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {item.id}
                </span>
                <span className="truncate text-sm font-semibold">
                  {item.name}
                </span>
                <span className="truncate text-sm font-medium text-muted-foreground">
                  {item.slug}
                </span>
                <CategoryBrandSummary brands={item.brands} />
                <CategorySpecSummary specs={item.specs} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CategorySpecSummary({
  specs,
}: {
  specs: ReadonlyArray<CategoryMasterSpec>
}) {
  if (specs.length === 0) {
    return (
      <span className="text-sm font-medium text-muted-foreground">
        設定なし
      </span>
    )
  }

  return (
    <span className="flex min-w-0 flex-wrap items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {specs.length}件
      </span>
      {specs.slice(0, 3).map((spec) => (
        <span
          className="inline-flex h-6 max-w-24 items-center rounded-md border bg-background px-2 text-xs font-medium"
          key={spec.id}
        >
          <span className="truncate">{spec.label}</span>
        </span>
      ))}
      {specs.length > 3 ? (
        <span className="text-xs font-medium text-muted-foreground">
          +{specs.length - 3}
        </span>
      ) : null}
    </span>
  )
}

function CategoryBrandSummary({
  brands,
}: {
  brands: ReadonlyArray<ProductBrand>
}) {
  if (brands.length === 0) {
    return (
      <span className="text-sm font-medium text-muted-foreground">
        設定なし
      </span>
    )
  }

  return (
    <span className="flex min-w-0 flex-wrap items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {brands.length}件
      </span>
      {brands.slice(0, 2).map((brand) => (
        <span
          className="inline-flex h-6 max-w-28 items-center rounded-md border bg-background px-2 text-xs font-medium"
          key={brand}
        >
          <span className="truncate">{brand}</span>
        </span>
      ))}
      {brands.length > 2 ? (
        <span className="text-xs font-medium text-muted-foreground">
          +{brands.length - 2}
        </span>
      ) : null}
    </span>
  )
}

function NameMasterEditDialogContent({
  displayId,
  inputLabel,
  item,
  items,
  onSaveItem,
  title,
}: {
  displayId: number
  inputLabel: string
  item: NameMasterItem
  items: ReadonlyArray<NameMasterItem>
  onSaveItem: (item: NameMasterItem) => void
  title: string
}) {
  const [nameInput, setNameInput] = useState(item.name)
  const normalizedName = nameInput.trim()
  const isDuplicateName = items.some(
    (currentItem) =>
      currentItem.id !== item.id &&
      currentItem.name.toLocaleLowerCase() ===
        normalizedName.toLocaleLowerCase(),
  )
  const message =
    normalizedName.length === 0
      ? `${inputLabel}を入力してください`
      : isDuplicateName
        ? '同じ名前が登録済みです'
        : null
  const canSave = message === null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSave) {
      return
    }

    onSaveItem({
      ...item,
      name: normalizedName,
    })
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/45" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-[80] grid max-h-[calc(100svh-2rem)] w-[min(calc(100vw-2rem),34rem)] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-lg border bg-background shadow-2xl outline-none">
        <div className="flex min-w-0 items-start justify-between gap-4 border-b p-5">
          <div className="min-w-0">
            <Dialog.Title className="font-heading text-xl font-semibold">
              {title}を編集
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              ID {displayId} の内容を更新します。
            </Dialog.Description>
          </div>

          <Dialog.Close asChild>
            <Button
              aria-label="閉じる"
              size="icon"
              type="button"
              variant="ghost"
            >
              <XIcon aria-hidden="true" />
            </Button>
          </Dialog.Close>
        </div>

        <form
          className="grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto]"
          onSubmit={handleSubmit}
        >
          <div className="grid min-h-0 min-w-0 content-start gap-4 overflow-y-auto p-5">
            <MasterDisplayField label="ID" value={String(displayId)} />

            <label className="grid min-w-0 gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                {inputLabel}
              </span>
              <Input
                aria-describedby={
                  message ? 'name-master-edit-message' : undefined
                }
                aria-invalid={message ? 'true' : undefined}
                className="bg-background"
                onChange={(event) => setNameInput(event.currentTarget.value)}
                type="text"
                value={nameInput}
              />
            </label>

            {message ? (
              <p
                className="text-sm font-medium text-destructive"
                id="name-master-edit-message"
              >
                {message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t p-5 sm:flex-row sm:items-center sm:justify-end">
            <Dialog.Close asChild>
              <Button type="button" variant="outline">
                キャンセル
              </Button>
            </Dialog.Close>
            <Button disabled={!canSave} type="submit">
              <SaveIcon data-icon="inline-start" />
              保存
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

function CategoryMasterFormPage({
  item,
  items,
  mode,
}: {
  item: CategoryMasterItem
  items: ReadonlyArray<CategoryMasterItem>
  mode: 'edit' | 'new'
}) {
  const navigate = useNavigate()
  const [nameInput, setNameInput] = useState(item.name)
  const [slugInput, setSlugInput] = useState(item.slug)
  const [brands, setBrands] = useState<readonly ProductBrand[]>(item.brands)
  const [specs, setSpecs] = useState<CategoryMasterSpec[]>(() =>
    item.specs.map((spec, index) => createCategoryMasterSpec(spec, index)),
  )
  const normalizedName = nameInput.trim()
  const normalizedSlug = slugInput.trim().toLowerCase()
  const normalizedSpecs = normalizeCategorySpecs(specs)
  const shouldShowBasicMessage =
    mode === 'edit' || normalizedName.length > 0 || normalizedSlug.length > 0
  const isDuplicateName = items.some(
    (currentItem) =>
      currentItem.id !== item.id &&
      currentItem.name.toLocaleLowerCase() ===
        normalizedName.toLocaleLowerCase(),
  )
  const isDuplicateSlug = items.some(
    (currentItem) =>
      currentItem.id !== item.id && currentItem.slug === normalizedSlug,
  )
  const isValidSlug =
    normalizedSlug.length > 0 && slugPattern.test(normalizedSlug)
  const message = !shouldShowBasicMessage
    ? null
    : normalizedName.length === 0 && normalizedSlug.length === 0
      ? 'カテゴリ名とカテゴリスラッグを入力してください'
      : normalizedName.length === 0
        ? 'カテゴリ名を入力してください'
        : !isValidSlug
          ? 'カテゴリスラッグは半角英数字とハイフンで入力してください'
          : isDuplicateName
            ? '同じカテゴリ名が登録済みです'
            : isDuplicateSlug
              ? '同じカテゴリスラッグが登録済みです'
              : null
  const specMessage = getCategorySpecsMessage(normalizedSpecs)
  const hasValidBasicFields =
    normalizedName.length > 0 &&
    isValidSlug &&
    !isDuplicateName &&
    !isDuplicateSlug
  const canSave = hasValidBasicFields && specMessage === null
  const pageTitle = mode === 'new' ? 'カテゴリ登録' : 'カテゴリを編集'
  const submitLabel = mode === 'new' ? '登録' : '保存'
  const formDescription =
    mode === 'new'
      ? 'カテゴリを登録し、選択可能なブランドと商品スペックを設定します。'
      : `ID ${item.id} のカテゴリ設定を更新します。`

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSave) {
      return
    }

    navigate('/admin/settings/categories')
  }

  return (
    <>
      <section className="border-b pb-5">
        <div className="grid gap-4">
          <div>
            <Button asChild type="button" variant="outline">
              <Link to="/admin/settings/categories">
                <ArrowLeftIcon data-icon="inline-start" />
                Back
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
                {pageTitle}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {formDescription}
              </p>
            </div>

            <Button
              className="h-10 px-3"
              disabled={!canSave}
              form="category-master-form"
              type="submit"
            >
              <SaveIcon data-icon="inline-start" />
              {submitLabel}
            </Button>
          </div>
        </div>
      </section>

      <form
        className="grid min-w-0 gap-5"
        id="category-master-form"
        onSubmit={handleSubmit}
      >
        <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold">基本情報</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,1fr)]">
            <MasterDisplayField label="ID" value={String(item.id)} />

            <label className="grid min-w-0 gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                カテゴリ名
              </span>
              <Input
                aria-describedby={
                  message ? 'category-master-edit-message' : undefined
                }
                aria-invalid={message ? 'true' : undefined}
                className="bg-background"
                onChange={(event) => setNameInput(event.currentTarget.value)}
                type="text"
                value={nameInput}
              />
            </label>

            <label className="grid min-w-0 gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                カテゴリスラッグ
              </span>
              <Input
                aria-describedby={
                  message ? 'category-master-edit-message' : undefined
                }
                aria-invalid={message ? 'true' : undefined}
                className="bg-background"
                onChange={(event) => setSlugInput(event.currentTarget.value)}
                type="text"
                value={slugInput}
              />
            </label>
          </div>

          {message ? (
            <p
              className="text-sm font-medium text-destructive"
              id="category-master-edit-message"
            >
              {message}
            </p>
          ) : null}
        </section>

        <CategoryBrandsEditor brands={brands} onChange={setBrands} />

        <CategorySpecsEditor specs={specs} onChange={setSpecs} />

        {specMessage ? (
          <p
            className="text-sm font-medium text-destructive"
            id="category-specs-edit-message"
          >
            {specMessage}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button asChild type="button" variant="outline">
            <Link to="/admin/settings/categories">キャンセル</Link>
          </Button>
          <Button disabled={!canSave} type="submit">
            <SaveIcon data-icon="inline-start" />
            {submitLabel}
          </Button>
        </div>
      </form>
    </>
  )
}

function CategoryBrandsEditor({
  brands,
  onChange,
}: {
  brands: readonly ProductBrand[]
  onChange: (brands: readonly ProductBrand[]) => void
}) {
  function updateBrand(brand: ProductBrand, checked: boolean) {
    if (checked) {
      onChange(
        productBrands.filter((item) => item === brand || brands.includes(item)),
      )
      return
    }

    onChange(brands.filter((item) => item !== brand))
  }

  return (
    <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
      <div className="min-w-0">
        <h3 className="font-heading text-sm font-semibold">許可ブランド</h3>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {productBrands.map((brand) => (
          <label
            className="inline-flex min-h-10 min-w-0 cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium outline-none hover:bg-accent/55 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2"
            key={brand}
          >
            <input
              checked={brands.includes(brand)}
              className="size-4 accent-primary"
              onChange={(event) =>
                updateBrand(brand, event.currentTarget.checked)
              }
              type="checkbox"
            />
            <span className="truncate">{brand}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

function CategorySpecsEditor({
  onChange,
  specs,
}: {
  onChange: (specs: CategoryMasterSpec[]) => void
  specs: CategoryMasterSpec[]
}) {
  const nextSpecIndex = useRef(specs.length)

  function addSpec() {
    const nextIndex = nextSpecIndex.current
    nextSpecIndex.current += 1
    onChange([...specs, createEmptyCategorySpec(nextIndex)])
  }

  function removeSpec(specId: string) {
    onChange(specs.filter((spec) => spec.id !== specId))
  }

  function updateSpec(
    specId: string,
    values: Partial<Omit<CategoryMasterSpec, 'id'>>,
  ) {
    onChange(
      specs.map((spec) => (spec.id === specId ? { ...spec, ...values } : spec)),
    )
  }

  function addOption(specId: string) {
    const spec = specs.find((item) => item.id === specId)

    if (!spec) {
      return
    }

    updateSpec(specId, {
      options: [
        ...spec.options,
        createEmptyCategorySpecOption(getNextOptionIndex(spec.options)),
      ],
    })
  }

  function removeOption(specId: string, optionId: string) {
    const spec = specs.find((item) => item.id === specId)

    if (!spec) {
      return
    }

    updateSpec(specId, {
      options: spec.options.filter((option) => option.id !== optionId),
    })
  }

  function updateOption(
    specId: string,
    optionId: string,
    values: Partial<Omit<CategoryMasterSpecOption, 'id'>>,
  ) {
    const spec = specs.find((item) => item.id === specId)

    if (!spec) {
      return
    }

    updateSpec(specId, {
      options: spec.options.map((option) =>
        option.id === optionId ? { ...option, ...values } : option,
      ),
    })
  }

  return (
    <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
      <div className="min-w-0">
        <h3 className="font-heading text-sm font-semibold">スペック</h3>
      </div>

      {specs.length > 0 ? (
        <div className="divide-y">
          {specs.map((spec, index) => (
            <div
              className="grid min-w-0 gap-4 py-4 first:pt-0 last:pb-0"
              key={spec.id}
            >
              <div className="flex min-w-0 items-center justify-between gap-2">
                <span className="font-heading text-sm font-semibold">
                  スペック {index + 1}
                </span>
                <Button
                  aria-label={`スペック ${index + 1} を削除`}
                  onClick={() => removeSpec(spec.id)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2Icon aria-hidden="true" />
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid min-w-0 gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    ラベルスラッグ
                  </span>
                  <Input
                    className="bg-background disabled:pointer-events-auto disabled:hover:bg-muted/45"
                    disabled={!spec.isFilterable}
                    onChange={(event) =>
                      updateSpec(spec.id, {
                        slug: event.currentTarget.value,
                      })
                    }
                    type="text"
                    value={spec.isFilterable ? spec.slug : ''}
                  />
                </label>

                <label className="grid min-w-0 gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    項目名
                  </span>
                  <Input
                    className="bg-background"
                    onChange={(event) =>
                      updateSpec(spec.id, {
                        label: event.currentTarget.value,
                      })
                    }
                    type="text"
                    value={spec.label}
                  />
                </label>

                <label className="grid min-w-0 gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    値の種類
                  </span>
                  <span className="relative">
                    <select
                      className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onChange={(event) => {
                        const valueType = event.currentTarget
                          .value as ProductSpecValueType

                        updateSpec(spec.id, {
                          options: valueType === 'option' ? spec.options : [],
                          valueType,
                        })
                      }}
                      value={spec.valueType}
                    >
                      {specValueTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                  </span>
                </label>

                <label className="grid min-w-0 gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    単位
                  </span>
                  <Input
                    className="bg-background"
                    onChange={(event) =>
                      updateSpec(spec.id, {
                        unit: event.currentTarget.value,
                      })
                    }
                    type="text"
                    value={spec.unit}
                  />
                </label>
              </div>

              {spec.valueType === 'option' ? (
                <CategorySpecOptionsEditor
                  isFilterable={spec.isFilterable}
                  onAddOption={() => addOption(spec.id)}
                  onRemoveOption={(optionId) => removeOption(spec.id, optionId)}
                  onUpdateOption={(optionId, values) =>
                    updateOption(spec.id, optionId, values)
                  }
                  options={spec.options}
                />
              ) : null}

              <div className="flex flex-wrap gap-3">
                <label className="inline-flex min-h-8 items-center gap-2 text-sm font-medium">
                  <input
                    checked={spec.isFilterable}
                    className="size-4 accent-primary"
                    onChange={(event) => {
                      const isFilterable = event.currentTarget.checked

                      updateSpec(spec.id, {
                        isFilterable,
                        slug: isFilterable ? spec.slug : '',
                        options: isFilterable
                          ? spec.options
                          : spec.options.map((option) => ({
                              ...option,
                              slug: '',
                            })),
                      })
                    }}
                    type="checkbox"
                  />
                  一覧フィルタ
                </label>

                <label className="inline-flex min-h-8 items-center gap-2 text-sm font-medium">
                  <input
                    checked={spec.isRequired}
                    className="size-4 accent-primary"
                    onChange={(event) =>
                      updateSpec(spec.id, {
                        isRequired: event.currentTarget.checked,
                      })
                    }
                    type="checkbox"
                  />
                  必須
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Button
        className="h-10 w-full border-dashed"
        onClick={addSpec}
        type="button"
        variant="outline"
      >
        <PlusIcon data-icon="inline-start" />
        スペックを追加
      </Button>
    </section>
  )
}

function CategorySpecOptionsEditor({
  isFilterable,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  options,
}: {
  isFilterable: boolean
  onAddOption: () => void
  onRemoveOption: (optionId: string) => void
  onUpdateOption: (
    optionId: string,
    values: Partial<Omit<CategoryMasterSpecOption, 'id'>>,
  ) => void
  options: readonly CategoryMasterSpecOption[]
}) {
  return (
    <div className="grid min-w-0 gap-3 border-t pt-4">
      <div className="min-w-0">
        <h4 className="text-xs font-semibold text-muted-foreground">選択肢</h4>
      </div>

      {options.length > 0 ? (
        <div className="grid">
          {options.map((option, index) => (
            <div
              className="grid min-w-0 gap-2 border-b py-3 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
              key={option.id}
            >
              <label className="grid min-w-0 gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  表示名 {index + 1}
                </span>
                <Input
                  className="bg-background"
                  onChange={(event) =>
                    onUpdateOption(option.id, {
                      label: event.currentTarget.value,
                    })
                  }
                  type="text"
                  value={option.label}
                />
              </label>

              <label
                aria-hidden={!isFilterable}
                className={[
                  'grid min-w-0 gap-1.5',
                  !isFilterable ? 'hidden sm:invisible sm:grid' : '',
                ].join(' ')}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  URL値
                </span>
                <Input
                  className="bg-background"
                  disabled={!isFilterable}
                  onChange={(event) =>
                    onUpdateOption(option.id, {
                      slug: event.currentTarget.value,
                    })
                  }
                  tabIndex={isFilterable ? 0 : -1}
                  type="text"
                  value={option.slug}
                />
              </label>

              <Button
                aria-label={`選択肢 ${index + 1} を削除`}
                className="self-end justify-self-start sm:justify-self-center"
                onClick={() => onRemoveOption(option.id)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <Trash2Icon aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <Button
        className="h-10 w-full border-dashed"
        onClick={onAddOption}
        type="button"
        variant="outline"
      >
        <PlusIcon data-icon="inline-start" />
        選択肢を追加
      </Button>
    </div>
  )
}

function MasterDisplayField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex h-11 min-w-0 items-center rounded-lg border bg-muted/35 px-3 text-base font-semibold md:text-sm">
        {value}
      </div>
    </div>
  )
}

function createCategoryMasterSpec(
  spec: ProductCategorySpecDefinition,
  index: number,
): CategoryMasterSpec {
  return {
    ...spec,
    id: `spec-${spec.slug}-${index}`,
    isFilterable: Boolean(spec.isFilterable),
    isRequired: Boolean(spec.isRequired),
    options: (spec.options ?? []).map((option, optionIndex) =>
      createCategoryMasterSpecOption(option, optionIndex),
    ),
    unit: spec.unit ?? '',
  }
}

function createEmptyCategorySpec(index: number): CategoryMasterSpec {
  return {
    id: `spec-${index}`,
    label: '',
    isFilterable: false,
    isRequired: false,
    options: [],
    slug: '',
    unit: '',
    valueType: 'text',
  }
}

function createEmptyCategoryMasterItem(id: number): CategoryMasterItem {
  return {
    brands: [],
    id,
    name: '',
    slug: '',
    specs: [],
  }
}

function createCategoryMasterSpecOption(
  option: ProductCategorySpecOption,
  index: number,
): CategoryMasterSpecOption {
  return {
    id: `option-${index}`,
    label: option.label,
    slug: option.slug ?? '',
  }
}

function createEmptyCategorySpecOption(
  index: number,
): CategoryMasterSpecOption {
  return {
    id: `option-${index}`,
    label: '',
    slug: '',
  }
}

function normalizeCategorySpecs(specs: ReadonlyArray<CategoryMasterSpec>) {
  return specs.flatMap((spec) => {
    const options = spec.options.flatMap((option) => {
      const label = option.label.trim()
      const slug = spec.isFilterable ? option.slug.trim().toLowerCase() : ''

      return label ? [{ ...option, label, slug }] : []
    })
    const normalizedSpec = {
      ...spec,
      isFilterable: Boolean(spec.isFilterable),
      isRequired: Boolean(spec.isRequired),
      label: spec.label.trim(),
      options: spec.valueType === 'option' ? options : [],
      slug: spec.isFilterable ? spec.slug.trim().toLowerCase() : '',
      unit: spec.unit.trim(),
    }
    const hasValue =
      normalizedSpec.slug.length > 0 ||
      normalizedSpec.label.length > 0 ||
      normalizedSpec.unit.length > 0 ||
      normalizedSpec.options.length > 0 ||
      Boolean(normalizedSpec.isFilterable) ||
      Boolean(normalizedSpec.isRequired)

    return hasValue ? [normalizedSpec] : []
  })
}

function getCategorySpecsMessage(specs: ReadonlyArray<CategoryMasterSpec>) {
  const slugCounts = new Map<string, number>()

  for (const spec of specs) {
    if (spec.isFilterable && spec.slug) {
      slugCounts.set(spec.slug, (slugCounts.get(spec.slug) ?? 0) + 1)
    }
  }

  for (const [index, spec] of specs.entries()) {
    const displayNumber = index + 1

    if (!spec.label) {
      return `スペック ${displayNumber} の項目名を入力してください`
    }

    if (spec.isFilterable) {
      if (!spec.slug) {
        return `スペック ${displayNumber} のラベルスラッグを入力してください`
      }

      if (!slugPattern.test(spec.slug)) {
        return `スペック ${displayNumber} のラベルスラッグは半角英数字とハイフンで入力してください`
      }

      if ((slugCounts.get(spec.slug) ?? 0) > 1) {
        return `スペック ${displayNumber} のラベルスラッグが重複しています`
      }
    }

    if (spec.valueType === 'option' && spec.options.length === 0) {
      return `スペック ${displayNumber} の選択肢を入力してください`
    }

    if (spec.valueType !== 'option') {
      continue
    }

    const optionLabelCounts = new Map<string, number>()
    const optionSlugCounts = new Map<string, number>()

    for (const option of spec.options) {
      optionLabelCounts.set(
        option.label.toLocaleLowerCase(),
        (optionLabelCounts.get(option.label.toLocaleLowerCase()) ?? 0) + 1,
      )

      if (option.slug) {
        optionSlugCounts.set(
          option.slug,
          (optionSlugCounts.get(option.slug) ?? 0) + 1,
        )
      }
    }

    for (const [optionIndex, option] of spec.options.entries()) {
      const optionDisplayNumber = optionIndex + 1

      if (!option.label) {
        return `スペック ${displayNumber} の選択肢 ${optionDisplayNumber} の表示名を入力してください`
      }

      if ((optionLabelCounts.get(option.label.toLocaleLowerCase()) ?? 0) > 1) {
        return `スペック ${displayNumber} の選択肢 ${optionDisplayNumber} の表示名が重複しています`
      }

      if (!spec.isFilterable) {
        continue
      }

      if (!option.slug) {
        return `スペック ${displayNumber} の選択肢 ${optionDisplayNumber} のURL値を入力してください`
      }

      if (!slugPattern.test(option.slug)) {
        return `スペック ${displayNumber} の選択肢 ${optionDisplayNumber} のURL値は半角英数字とハイフンで入力してください`
      }

      if ((optionSlugCounts.get(option.slug) ?? 0) > 1) {
        return `スペック ${displayNumber} の選択肢 ${optionDisplayNumber} のURL値が重複しています`
      }
    }
  }

  return null
}

function getNextOptionIndex(options: readonly CategoryMasterSpecOption[]) {
  const indexes = options.map((option) => {
    const index = Number(option.id.split('-').at(-1))

    return Number.isInteger(index) ? index : -1
  })

  return Math.max(-1, ...indexes) + 1
}

function getMasterDisplayId<TItem extends { id: number }>(
  items: ReadonlyArray<TItem>,
  itemId: number,
) {
  const index = items.findIndex((item) => item.id === itemId)

  return index === -1 ? itemId : items.length - index
}

function getNextMasterId<TItem extends { id: number }>(
  items: ReadonlyArray<TItem>,
) {
  return Math.max(0, ...items.map((item) => item.id)) + 1
}
