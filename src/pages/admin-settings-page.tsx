import {
  CalendarRangeIcon,
  ChevronRightIcon,
  NewspaperIcon,
  PackageIcon,
  ShieldCheckIcon,
  TagsIcon,
} from 'lucide-react'
import { Link } from 'react-router'

const settingsNavItems = [
  {
    title: '認証設定',
    description: 'Googleログインとログイン許可メール',
    path: '/admin/settings/auth',
    icon: ShieldCheckIcon,
  },
  {
    title: 'ブランド',
    description: '商品に設定するブランド',
    path: '/admin/settings/brands',
    icon: TagsIcon,
  },
  {
    title: 'カテゴリ',
    description: '商品カテゴリとURLスラッグ',
    path: '/admin/settings/categories',
    icon: PackageIcon,
  },
  {
    title: 'お知らせタグ',
    description: 'お知らせに設定するタグ',
    path: '/admin/settings/news-tags',
    icon: NewspaperIcon,
  },
  {
    title: '取得範囲',
    description: '注文・お問い合わせ・顧客の一時取得範囲',
    path: '/admin/settings/fetch-range',
    icon: CalendarRangeIcon,
  },
]

export function AdminSettingsPage() {
  return (
    <>
      <SettingsPageHeader />

      <section className="grid min-w-0 gap-4 md:grid-cols-2">
        {settingsNavItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-lg border bg-card p-4 outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              key={item.path}
              to={item.path}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-base font-semibold">
                  {item.title}
                </span>
                <span className="mt-1 block truncate text-sm text-muted-foreground">
                  {item.description}
                </span>
              </span>
              <ChevronRightIcon
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </Link>
          )
        })}
      </section>
    </>
  )
}

function SettingsPageHeader() {
  return (
    <section className="border-b pb-5">
      <div className="flex h-10 items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
            設定
          </h1>
        </div>
      </div>
    </section>
  )
}
