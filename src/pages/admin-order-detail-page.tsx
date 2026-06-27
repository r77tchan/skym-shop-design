import {
  ArrowLeftIcon,
  ChevronDownIcon,
  SaveIcon,
  ShoppingCartIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate, useParams, Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { assetUrl } from '@/lib/asset-url'
import {
  findAdminOrderById,
  getAdminOrderStatusClassName,
  type AdminOrder,
  type AdminOrderItem,
  type AdminOrderStatus,
} from '@/lib/admin-orders'
import { products, type Product } from '@/lib/shop-content'
import {
  fieldLabelClassName,
  fieldWrapperClassName,
  selectFieldClassName,
} from '@/lib/ui-styles'
import { cn } from '@/lib/utils'

const adminProductById = new Map<number, Product>(
  products.map((product) => [product.id, product]),
)

const orderStatusOptions: AdminOrderStatus[] = [
  '未対応',
  '対応済み',
  'キャンセル',
]

export function AdminOrderDetailPage() {
  const { orderId } = useParams()
  const order = findAdminOrderById(orderId)

  if (!order) {
    return <OrderNotFound orderId={orderId} />
  }

  return <AdminOrderDetail order={order} />
}

function AdminOrderDetail({ order }: { order: AdminOrder }) {
  const navigate = useNavigate()

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

            <Button className="h-10 px-3" type="button">
              <SaveIcon data-icon="inline-start" />
              保存
            </Button>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary">
                  ID {order.id}
                </Badge>
                <Badge className="bg-secondary text-secondary-foreground">
                  {order.orderNumber}
                </Badge>
                <Badge
                  className={cn(
                    'w-fit',
                    getAdminOrderStatusClassName(order.responseStatus),
                  )}
                >
                  {order.responseStatus}
                </Badge>
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
                注文詳細
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {order.customer} / {order.orderedAt}
              </p>
            </div>
          </div>
        </div>
      </section>

      <form className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">注文商品</h2>
            </div>

            <OrderItemsTable order={order} />
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">注文者</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ReadOnlyField label="氏名" value={order.customer} />
              <ReadOnlyField label="電話番号" value={order.customerPhone} />
              <ReadOnlyField
                className="md:col-span-2"
                label="メールアドレス"
                value={order.customerEmail}
              />
            </div>

            <ReadOnlyField
              label="購入者メモ"
              multiline
              emptyText="購入者からのメモはありません"
              value={order.customerNote}
            />
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">配送先</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ReadOnlyField label="宛名" value={order.shippingName} />
              <ReadOnlyField label="配送方法" value={order.deliveryMethod} />
              <ReadOnlyField
                label="郵便番号"
                value={order.shippingPostalCode}
              />
            </div>

            <ReadOnlyField
              label="住所"
              multiline
              value={order.shippingAddress}
            />
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">支払い</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ReadOnlyField label="支払い方法" value={order.paymentMethod} />
              <ReadOnlyField label="支払い状態" value={order.paymentStatus} />
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">対応</h2>
            </div>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>ステータス</span>
              <SelectField defaultValue={order.responseStatus}>
                {orderStatusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </SelectField>
            </label>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>追跡番号</span>
              <Input
                defaultValue={order.trackingNumber}
                placeholder="未登録"
                type="text"
              />
            </label>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>管理メモ</span>
              <Textarea
                defaultValue={order.adminMemo}
                placeholder="対応内容や確認事項を入力"
              />
            </label>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">金額</h2>
            </div>

            <div className="grid gap-3 text-sm">
              <SummaryRow label="商品合計" value={order.subtotal} />
              <SummaryRow label="送料" value={order.shippingFee} />
              <div className="border-t pt-3">
                <SummaryRow
                  label="合計"
                  value={order.amount}
                  valueClassName="text-lg"
                />
              </div>
            </div>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <ShoppingCartIcon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-heading text-base font-semibold">
                  注文情報
                </h2>
                <div className="mt-3 grid gap-2 text-sm">
                  <InfoRow label="ID" value={String(order.id)} />
                  <InfoRow label="注文番号" value={order.orderNumber} />
                  <InfoRow label="注文日時" value={order.orderedAt} />
                </div>
              </div>
            </div>
          </section>
        </aside>
      </form>
    </>
  )
}

function OrderItemsTable({ order }: { order: AdminOrder }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border">
      <div className="hidden min-w-0 overflow-x-auto md:block">
        <div className="min-w-[780px]">
          <div className="grid grid-cols-[minmax(340px,1fr)_112px_72px_112px] gap-3 border-b bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>商品</span>
            <span>単価</span>
            <span>購入数</span>
            <span>小計</span>
          </div>

          <div className="divide-y">
            {order.items.map((item) => (
              <div
                className="grid grid-cols-[minmax(340px,1fr)_112px_72px_112px] items-center gap-3 px-4 py-3.5"
                key={item.id}
              >
                <OrderItemProductLink item={item} />
                <span className="text-sm font-medium">{item.unitPrice}</span>
                <span className="text-sm tabular-nums">{item.quantity}</span>
                <span className="text-sm font-semibold">{item.subtotal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid divide-y md:hidden">
        {order.items.map((item) => (
          <div className="grid gap-3 p-4" key={item.id}>
            <OrderItemProductLink item={item} variant="mobile" />

            <div className="grid grid-cols-3 gap-3 text-sm">
              <InfoStack label="単価" value={item.unitPrice} />
              <InfoStack label="購入数" value={String(item.quantity)} />
              <InfoStack label="小計" value={item.subtotal} strong />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderItemProductLink({
  item,
  variant = 'desktop',
}: {
  item: AdminOrderItem
  variant?: 'desktop' | 'mobile'
}) {
  const product = item.productId
    ? adminProductById.get(item.productId)
    : undefined
  const imageClassName = variant === 'mobile' ? 'w-16' : 'w-14'
  const content = (
    <>
      {product ? (
        <img
          alt=""
          className={cn(
            'aspect-square shrink-0 rounded-lg bg-muted object-cover',
            imageClassName,
          )}
          src={assetUrl(product.image)}
        />
      ) : (
        <span
          className={cn(
            'grid aspect-square shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground',
            imageClassName,
          )}
        >
          <ShoppingCartIcon aria-hidden="true" className="size-5" />
        </span>
      )}

      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">
          {item.name}
        </span>
        <span className="mt-1 block truncate text-xs text-muted-foreground">
          {item.option}
        </span>
      </span>
    </>
  )
  const className = cn(
    '-m-1 grid min-w-0 items-center gap-3 rounded-lg p-1 text-left',
    variant === 'mobile'
      ? 'grid-cols-[64px_minmax(0,1fr)]'
      : 'grid-cols-[56px_minmax(0,1fr)]',
  )

  if (!product) {
    return <span className={className}>{content}</span>
  }

  return (
    <Link
      aria-label={`${item.name}の商品詳細を開く`}
      className={cn(
        className,
        'cursor-pointer outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
      to={`/admin/products/${product.id}`}
    >
      {content}
    </Link>
  )
}

function SelectField({
  children,
  defaultValue,
}: {
  children: ReactNode
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

function ReadOnlyField({
  className,
  emptyText = '-',
  label,
  multiline,
  value,
}: {
  className?: string
  emptyText?: string
  label: string
  multiline?: boolean
  value: string
}) {
  const isEmpty = !value

  return (
    <div className={cn('grid min-w-0 content-start gap-1.5', className)}>
      <p className={fieldLabelClassName}>{label}</p>
      <p
        className={cn(
          'min-w-0 text-sm leading-6 font-semibold text-foreground',
          multiline ? 'whitespace-pre-wrap' : 'truncate',
          isEmpty && 'font-medium text-muted-foreground',
        )}
      >
        {isEmpty ? emptyText : value}
      </p>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-semibold', valueClassName)}>{value}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate font-medium">{value || '-'}</span>
    </div>
  )
}

function InfoStack({
  label,
  strong,
  value,
}: {
  label: string
  strong?: boolean
  value: string
}) {
  return (
    <span className="min-w-0">
      <span className="block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          'mt-1 block truncate tabular-nums',
          strong ? 'font-semibold' : 'font-medium',
        )}
      >
        {value}
      </span>
    </span>
  )
}

function OrderNotFound({ orderId }: { orderId?: string }) {
  return (
    <>
      <section className="border-b pb-5">
        <div className="flex h-10 items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
              注文が見つかりません
            </h1>
          </div>
        </div>
      </section>

      <section className="grid min-h-[320px] place-items-center rounded-lg border bg-card p-6 text-center">
        <div className="grid max-w-md gap-5">
          <div className="grid gap-2">
            <p className="font-heading text-lg font-semibold">
              注文ID {orderId ?? '-'} は表示できません
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              注文一覧から対象の注文を選択してください。
            </p>
          </div>

          <div className="flex justify-center">
            <Button asChild>
              <Link to="/admin/orders">
                <ArrowLeftIcon data-icon="inline-start" />
                注文一覧へ戻る
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
