import {
  AlertTriangleIcon,
  CalendarClockIcon,
  CreditCardIcon,
  MoreHorizontalIcon,
  PlusIcon,
  ReceiptTextIcon,
  ShoppingBagIcon,
  StoreIcon,
  TruckIcon,
  UserPlusIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assetUrl } from '@/lib/asset-url'
import { cn } from '@/lib/utils'

const dashboardStats = [
  {
    label: '本日の売上',
    value: '¥48,600',
    detail: 'Stripe売上 12件',
    trend: '+12.4%',
    icon: CreditCardIcon,
    colorClassName: 'bg-chart-1/12 text-chart-1',
  },
  {
    label: '未処理注文',
    value: '8件',
    detail: '発送待ち 5件 / 確認待ち 3件',
    trend: '要確認',
    icon: ReceiptTextIcon,
    colorClassName: 'bg-chart-5/12 text-chart-5',
  },
  {
    label: '在庫アラート',
    value: '5件',
    detail: '売り切れ 2件 / 残りわずか 3件',
    trend: '更新',
    icon: AlertTriangleIcon,
    colorClassName: 'bg-chart-4/14 text-chart-4',
  },
  {
    label: '公開商品',
    value: '128件',
    detail: '新着 9件 / セール 14件',
    trend: '安定',
    icon: ShoppingBagIcon,
    colorClassName: 'bg-chart-3/12 text-chart-3',
  },
]

const recentOrders = [
  {
    id: '#SKYM-1028',
    customer: 'Mizuki Tanaka',
    summary: 'フォルテ 2.1g ほか2点',
    amount: '¥4,480',
    payment: 'Stripe',
    status: '発送待ち',
  },
  {
    id: '#SKYM-1027',
    customer: 'Haruto Sato',
    summary: 'ドリフトスピン 限定カラー',
    amount: '¥1,280',
    payment: 'Stripe',
    status: '入金確認済',
  },
  {
    id: '#SKYM-1026',
    customer: 'Yui Kobayashi',
    summary: 'さかさにょろ Slim 35FS',
    amount: '¥2,640',
    payment: 'Stripe',
    status: '発送済み',
  },
  {
    id: '#SKYM-1025',
    customer: 'Ren Suzuki',
    summary: 'フック トライアルパック',
    amount: '¥980',
    payment: 'Stripe',
    status: '確認待ち',
  },
]

const inventoryAlerts = [
  {
    name: 'フォルテ 2.1g（シルバー）',
    sku: 'VEL-FOR-21-SLV',
    stock: '残り3',
    action: '補充候補',
    image:
      '/skym-shop-assets/images/products/161b25ac6ba3c56743cad57b38ad7ee5.jpg',
  },
  {
    name: 'さかさにょろ Slim 35FS',
    sku: '1089-NYR-S35',
    stock: '残り2',
    action: '優先確認',
    image:
      '/skym-shop-assets/images/products/02d6f2ac86e6516284eb5680692eabff.jpg',
  },
  {
    name: 'ドリフトスピン 限定カラー',
    sku: 'RDC-DRS-LTD',
    stock: '完売',
    action: '非表示検討',
    image:
      '/skym-shop-assets/images/products/033805811c6e8f5bae5e02633d66741f.jpg',
  },
]

const adminAccounts = [
  {
    name: 'Owner',
    email: 'owner.skym@gmail.com',
    role: 'オーナー',
    status: '有効',
  },
  {
    name: 'Store Manager',
    email: 'manager.skym@gmail.com',
    role: '運用管理',
    status: '招待中',
  },
]

const newsDrafts = [
  {
    title: 'ValkeINスプーン 再入荷',
    date: '2026.06.22',
    state: '下書き',
  },
  {
    title: '発送スケジュールのお知らせ',
    date: '2026.06.24',
    state: '予約済み',
  },
]

function getOrderStatusClassName(status: string) {
  if (status === '発送済み') {
    return 'bg-chart-3/12 text-chart-3'
  }

  if (status === '確認待ち') {
    return 'bg-chart-5/12 text-chart-5'
  }

  return 'bg-primary/10 text-primary'
}

export function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader />

      <section
        aria-label="主要指標"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {dashboardStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article
              className="min-w-0 rounded-lg border bg-card p-4"
              key={stat.label}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-heading text-2xl font-semibold">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-lg',
                    stat.colorClassName,
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-xs text-muted-foreground">
                  {stat.detail}
                </p>
                <Badge className="shrink-0" variant="secondary">
                  {stat.trend}
                </Badge>
              </div>
            </article>
          )
        })}
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
        <OrderQueue />

        <div className="grid gap-5">
          <StripeStatusPanel />
          <AdminAccountsPanel />
        </div>
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-2">
        <InventoryPanel />
        <NewsPanel />
      </section>
    </>
  )
}

function AdminPageHeader() {
  return (
    <section className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
          管理ダッシュボード
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-10 px-3" variant="outline">
          <CreditCardIcon data-icon="inline-start" />
          Stripe
        </Button>
        <Button className="h-10 px-3">
          <PlusIcon data-icon="inline-start" />
          商品登録
        </Button>
      </div>
    </section>
  )
}

function OrderQueue() {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">注文キュー</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Stripe決済後の注文ステータス
          </p>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <TruckIcon data-icon="inline-start" />
          発送処理
        </Button>
      </div>

      <div className="hidden border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground md:grid md:grid-cols-[minmax(120px,0.75fr)_minmax(0,1.4fr)_96px_86px_96px_36px] md:items-center md:gap-3">
        <span>注文</span>
        <span>内容</span>
        <span>金額</span>
        <span>決済</span>
        <span>状態</span>
        <span aria-hidden="true" />
      </div>

      <div className="divide-y">
        {recentOrders.map((order) => (
          <article
            className="grid gap-3 p-4 md:grid-cols-[minmax(120px,0.75fr)_minmax(0,1.4fr)_96px_86px_96px_36px] md:items-center md:gap-3"
            key={order.id}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{order.id}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {order.customer}
              </p>
            </div>
            <p className="min-w-0 truncate text-sm">{order.summary}</p>
            <p className="text-sm font-semibold">{order.amount}</p>
            <Badge className="w-fit" variant="outline">
              {order.payment}
            </Badge>
            <Badge
              className={cn('w-fit', getOrderStatusClassName(order.status))}
            >
              {order.status}
            </Badge>
            <Button
              aria-label={`${order.id}の詳細`}
              className="hidden md:inline-flex"
              size="icon-sm"
              variant="ghost"
            >
              <MoreHorizontalIcon aria-hidden="true" />
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}

function StripeStatusPanel() {
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">決済</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Stripe テスト環境
          </p>
        </div>
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <CreditCardIcon aria-hidden="true" className="size-4" />
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/35 px-3 py-2.5">
          <span className="text-sm font-medium">カード決済</span>
          <Badge className="bg-chart-3/12 text-chart-3">有効</Badge>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/35 px-3 py-2.5">
          <span className="text-sm font-medium">Webhook</span>
          <Badge variant="secondary">未接続</Badge>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/35 px-3 py-2.5">
          <span className="text-sm font-medium">返金処理</span>
          <Badge variant="outline">管理者のみ</Badge>
        </div>
      </div>
    </section>
  )
}

function AdminAccountsPanel() {
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">
            管理アカウント
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Gmail許可リスト</p>
        </div>
        <Button size="sm" variant="outline">
          <UserPlusIcon data-icon="inline-start" />
          追加
        </Button>
      </div>

      <div className="mt-4 grid gap-3">
        {adminAccounts.map((account) => (
          <div
            className="flex min-w-0 items-center justify-between gap-3 rounded-lg border bg-muted/35 px-3 py-2.5"
            key={account.email}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{account.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {account.email}
              </p>
            </div>
            <div className="grid shrink-0 justify-items-end gap-1">
              <Badge
                variant={account.status === '有効' ? 'secondary' : 'outline'}
              >
                {account.status}
              </Badge>
              <span className="text-[0.7rem] text-muted-foreground">
                {account.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function InventoryPanel() {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">在庫アラート</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            販売状態の見直しが必要な商品
          </p>
        </div>
        <Button asChild className="w-fit" size="sm" variant="outline">
          <Link to="/admin/products">
            <StoreIcon data-icon="inline-start" />
            商品管理
          </Link>
        </Button>
      </div>

      <div className="divide-y">
        {inventoryAlerts.map((item) => (
          <article
            className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 p-4 sm:grid-cols-[56px_minmax(0,1fr)_auto]"
            key={item.sku}
          >
            <img
              alt={item.name}
              className="aspect-square w-14 rounded-lg bg-muted object-cover"
              src={assetUrl(item.image)}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{item.name}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {item.sku}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  className={
                    item.stock === '完売'
                      ? 'bg-chart-5/12 text-chart-5'
                      : 'bg-chart-4/14 text-chart-4'
                  }
                >
                  {item.stock}
                </Badge>
                <Badge variant="outline">{item.action}</Badge>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function NewsPanel() {
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">お知らせ管理</h2>
          <p className="mt-1 text-xs text-muted-foreground">公開予定と下書き</p>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <PlusIcon data-icon="inline-start" />
          新規作成
        </Button>
      </div>

      <div className="mt-4 grid gap-3">
        {newsDrafts.map((item) => (
          <article
            className="grid gap-3 rounded-lg border bg-muted/35 p-3 sm:grid-cols-[minmax(0,1fr)_auto]"
            key={item.title}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{item.title}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarClockIcon aria-hidden="true" className="size-3.5" />
                {item.date}
              </div>
            </div>
            <Badge className="w-fit self-start" variant="secondary">
              {item.state}
            </Badge>
          </article>
        ))}
      </div>
    </section>
  )
}
