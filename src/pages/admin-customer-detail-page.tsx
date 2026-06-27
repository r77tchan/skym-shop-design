import { ArrowLeftIcon, UserIcon } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  findAdminCustomerById,
  getAdminCustomerOrders,
  type AdminCustomer,
} from '@/lib/admin-customers'
import {
  getAdminOrderStatusClassName,
  type AdminOrder,
} from '@/lib/admin-orders'
import { fieldLabelClassName } from '@/lib/ui-styles'
import { cn } from '@/lib/utils'


export function AdminCustomerDetailPage() {
  const { customerId } = useParams()
  const customer = findAdminCustomerById(customerId)

  if (!customer) {
    return <CustomerNotFound customerId={customerId} />
  }

  return <AdminCustomerDetail customer={customer} />
}

function AdminCustomerDetail({ customer }: { customer: AdminCustomer }) {
  const navigate = useNavigate()
  const orders = getAdminCustomerOrders(customer)

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
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary">
                  ID {customer.id}
                </Badge>
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
                {customer.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="grid min-w-0 items-start gap-5">
        <div className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <UserIcon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-heading text-base font-semibold">
                  顧客情報
                </h2>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ReadOnlyField label="氏名" value={customer.name} />
              <ReadOnlyField label="メールアドレス" value={customer.email} />
            </div>

            <div className="grid min-w-0 gap-3 border-t pt-4">
              <h3 className="text-sm font-semibold">購入サマリー</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <ReadOnlyField
                  label="注文数"
                  value={`${customer.orderCount.toLocaleString()}件`}
                />
                <ReadOnlyField label="累計購入" value={customer.totalSpent} />
              </div>
            </div>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">注文履歴</h2>
            </div>

            <CustomerOrdersList customerName={customer.name} orders={orders} />
          </section>
        </div>
      </div>
    </>
  )
}

function CustomerOrdersList({
  customerName,
  orders,
}: {
  customerName: string
  orders: ReadonlyArray<AdminOrder>
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/35 p-6 text-center text-sm text-muted-foreground">
        注文履歴はありません
      </div>
    )
  }

  return (
    <div className="grid min-w-0 gap-3">
      {orders.map((order) => (
        <Link
          aria-label={`注文ID ${order.id} の詳細を開く`}
          className="grid min-w-0 gap-4 rounded-lg border p-4 outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          key={order.id}
          to={`/admin/orders/${order.id}`}
        >
          <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
                <span className="tabular-nums">ID {order.id}</span>
                <span aria-hidden="true">/</span>
                <span className="tabular-nums">{order.orderedAt}</span>
              </div>
              <p className="mt-1 truncate text-sm font-semibold">
                {order.orderNumber}
              </p>
            </div>

            <Badge
              className={cn(
                'shrink-0',
                getAdminOrderStatusClassName(order.responseStatus),
              )}
            >
              {order.responseStatus}
            </Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <ReadOnlyField label="名前" value={customerName} />
            <ReadOnlyField label="電話番号" value={order.customerPhone} />
            <ReadOnlyField label="メールアドレス" value={order.customerEmail} />
            <ReadOnlyField label="注文日時" value={order.orderedAt} />
            <ReadOnlyField label="点数" value={`${order.itemCount}点`} />
            <ReadOnlyField label="金額" value={order.amount} />
            <ReadOnlyField
              label="支払い"
              value={`${order.paymentMethod} / ${order.paymentStatus}`}
            />
            <ReadOnlyField label="配送方法" value={order.deliveryMethod} />
          </div>

          <div className="grid gap-3 border-t pt-4 md:grid-cols-2">
            <ReadOnlyField
              label="配送先"
              multiline
              value={getOrderShippingAddress(order)}
            />
            <ReadOnlyField
              emptyText="購入者メモはありません"
              label="購入者メモ"
              multiline
              value={order.customerNote}
            />
          </div>
        </Link>
      ))}
    </div>
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

function getOrderShippingAddress(order: AdminOrder) {
  return `${order.shippingName}\n${order.shippingPostalCode}\n${order.shippingAddress}`
}

function CustomerNotFound({ customerId }: { customerId?: string }) {
  return (
    <>
      <section className="border-b pb-5">
        <div className="flex h-10 items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
              顧客が見つかりません
            </h1>
          </div>
        </div>
      </section>

      <section className="grid min-h-[320px] place-items-center rounded-lg border bg-card p-6 text-center">
        <div className="grid max-w-md gap-5">
          <div className="grid gap-2">
            <p className="font-heading text-lg font-semibold">
              顧客ID {customerId ?? '-'} は表示できません
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              顧客一覧から対象の顧客を選択してください。
            </p>
          </div>

          <div className="flex justify-center">
            <Button asChild>
              <Link to="/admin/customers">
                <ArrowLeftIcon data-icon="inline-start" />
                顧客一覧へ戻る
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
