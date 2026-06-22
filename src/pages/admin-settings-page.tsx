import {
  BellIcon,
  CreditCardIcon,
  GlobeIcon,
  KeyRoundIcon,
  MailIcon,
  SaveIcon,
  SettingsIcon,
  ShieldCheckIcon,
  StoreIcon,
} from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SettingState = '有効' | '未接続' | '要確認' | '下書き'

type SettingRow = {
  label: string
  value: string
  detail: string
  state?: SettingState
}

const settingStats = [
  {
    label: 'ストア公開',
    value: '公開中',
    detail: '商品・お知らせを表示',
    icon: StoreIcon,
    colorClassName: 'bg-chart-3/12 text-chart-3',
  },
  {
    label: '決済',
    value: 'Stripe',
    detail: 'テスト環境で接続中',
    icon: CreditCardIcon,
    colorClassName: 'bg-primary/10 text-primary',
  },
  {
    label: '認証',
    value: 'Google',
    detail: 'Gmail許可リスト',
    icon: ShieldCheckIcon,
    colorClassName: 'bg-chart-1/12 text-chart-1',
  },
  {
    label: '通知',
    value: '2件',
    detail: '未接続の通知設定',
    icon: BellIcon,
    colorClassName: 'bg-chart-4/14 text-chart-4',
  },
]

const storeSettings: SettingRow[] = [
  {
    label: 'ストア名',
    value: 'SKYMSHOP',
    detail: 'ヘッダー、通知メールで使用',
    state: '有効',
  },
  {
    label: '運営会社',
    value: '株式会社SKYM',
    detail: '特定商取引法ページとフッターに表示',
    state: '有効',
  },
  {
    label: '公開URL',
    value: 'https://skymtackle.base.shop/',
    detail: 'リニューアル前の現行ストアURL',
    state: '要確認',
  },
]

const paymentSettings: SettingRow[] = [
  {
    label: '決済プロバイダー',
    value: 'Stripe',
    detail: 'カード決済を想定',
    state: '有効',
  },
  {
    label: '環境',
    value: 'テスト環境',
    detail: '本番公開前に live mode へ切り替え',
    state: '要確認',
  },
  {
    label: 'Webhook',
    value: '未接続',
    detail: '決済完了、返金、支払い失敗の通知を受け取る設定',
    state: '未接続',
  },
]

const authSettings: SettingRow[] = [
  {
    label: '認証方式',
    value: 'Supabase Auth / Google',
    detail: '許可されたGmailアカウントのみ入れる想定',
    state: '有効',
  },
  {
    label: 'オーナー',
    value: 'owner.skym@gmail.com',
    detail: '全設定を変更できる権限',
    state: '有効',
  },
  {
    label: '運用',
    value: 'manager.skym@gmail.com',
    detail: '商品、注文、問い合わせを操作できる権限',
    state: '下書き',
  },
]

const notificationSettings: SettingRow[] = [
  {
    label: '問い合わせ通知',
    value: 'support@skym.co.jp',
    detail: 'フォーム送信時に通知メールを送る宛先',
    state: '要確認',
  },
  {
    label: '注文通知',
    value: 'orders@skym.co.jp',
    detail: 'Stripe決済完了後の注文通知',
    state: '要確認',
  },
  {
    label: '送信元',
    value: 'SKYMSHOP <no-reply@skym.co.jp>',
    detail: '顧客向けメールのFrom表示',
    state: '未接続',
  },
]

function getSettingStateClassName(state: SettingState) {
  if (state === '有効') {
    return 'bg-chart-3/12 text-chart-3'
  }

  if (state === '要確認') {
    return 'bg-chart-4/14 text-chart-4'
  }

  if (state === '下書き') {
    return 'bg-primary/10 text-primary'
  }

  return 'bg-chart-5/12 text-chart-5'
}

export function AdminSettingsPage() {
  return (
    <>
      <SettingsPageHeader />

      <section
        aria-label="設定の主要指標"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {settingStats.map((stat) => {
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
              <p className="mt-4 truncate text-xs text-muted-foreground">
                {stat.detail}
              </p>
            </article>
          )
        })}
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div className="grid gap-5">
          <StoreSettingsPanel />
          <PaymentSettingsPanel />
          <SettingsGuidePanel />
        </div>

        <div className="grid gap-5">
          <AuthSettingsPanel />
          <NotificationSettingsPanel />
        </div>
      </section>
    </>
  )
}

function SettingsPageHeader() {
  return (
    <section className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
          設定
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-10 px-3" variant="outline">
          <SettingsIcon data-icon="inline-start" />
          変更履歴
        </Button>
        <Button className="h-10 px-3">
          <SaveIcon data-icon="inline-start" />
          保存
        </Button>
      </div>
    </section>
  )
}

function StoreSettingsPanel() {
  return (
    <SettingsPanel
      action="基本情報を編集"
      description="公開ストアと通知メールで共通して使う情報"
      icon={StoreIcon}
      rows={storeSettings}
      title="ストア基本情報"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            ストア名
          </span>
          <Input defaultValue="SKYMSHOP" />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            運営会社
          </span>
          <Input defaultValue="株式会社SKYM" />
        </label>
      </div>
    </SettingsPanel>
  )
}

function PaymentSettingsPanel() {
  return (
    <SettingsPanel
      action="Stripe設定"
      description="カード決済、Webhook、返金権限の接続状態"
      icon={CreditCardIcon}
      rows={paymentSettings}
      title="決済"
    />
  )
}

function AuthSettingsPanel() {
  return (
    <SettingsPanel
      action="ユーザーを追加"
      description="Googleログインを許可するGmailアカウント"
      icon={KeyRoundIcon}
      rows={authSettings}
      title="認証"
    >
      <div className="grid gap-3 rounded-lg border bg-muted/35 p-3">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheckIcon aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Googleアカウントでログイン</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              許可リストに追加したGmailだけを許可する想定です。
            </p>
          </div>
        </div>
      </div>
    </SettingsPanel>
  )
}

function NotificationSettingsPanel() {
  return (
    <SettingsPanel
      action="通知を編集"
      description="注文、問い合わせ、顧客向けメールの受信先"
      icon={BellIcon}
      rows={notificationSettings}
      title="通知・メール"
    >
      <div className="grid gap-3 rounded-lg border bg-muted/35 p-3">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-chart-1/12 text-chart-1">
            <MailIcon aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              問い合わせはDB保存 + メール通知
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              この画面で履歴を残しつつ、店舗用メールにも通知する想定です。
            </p>
          </div>
        </div>
      </div>
    </SettingsPanel>
  )
}

function SettingsPanel({
  action,
  children,
  description,
  icon: Icon,
  rows,
  title,
}: {
  action: string
  children?: ReactNode
  description: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  rows: SettingRow[]
  title: string
}) {
  return (
    <section className="rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Icon aria-hidden={true} className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          {action}
        </Button>
      </div>

      {children ? <div className="border-t p-4">{children}</div> : null}

      <div className="divide-y border-t">
        {rows.map((row) => (
          <div
            className="grid gap-3 p-4 sm:grid-cols-[minmax(140px,0.45fr)_minmax(0,1fr)_auto] sm:items-center"
            key={row.label}
          >
            <p className="text-sm font-medium">{row.label}</p>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{row.value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {row.detail}
              </p>
            </div>
            {row.state ? (
              <Badge
                className={cn('w-fit', getSettingStateClassName(row.state))}
              >
                {row.state}
              </Badge>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

function SettingsGuidePanel() {
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
          <GlobeIcon aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">
            公開前チェック
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            本番公開前に、ドメイン、Stripe本番環境、通知メール、認証アカウントを確認します。
          </p>
        </div>
      </div>
    </section>
  )
}
