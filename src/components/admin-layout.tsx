import {
  CheckCircle2Icon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  NewspaperIcon,
  PackageIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PinIcon,
  PinOffIcon,
  ReceiptTextIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  StoreIcon,
  UsersIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { assetUrl } from '@/lib/asset-url'
import { cn } from '@/lib/utils'

const adminNavItems = [
  {
    label: 'ダッシュボード',
    path: '/admin',
    icon: LayoutDashboardIcon,
    enabled: true,
  },
  {
    label: '商品管理',
    path: '/admin/products',
    icon: PackageIcon,
    enabled: true,
  },
  {
    label: '注文管理',
    path: '/admin/orders',
    icon: ReceiptTextIcon,
    enabled: true,
  },
  {
    label: 'お知らせ',
    path: '/admin/news',
    icon: NewspaperIcon,
    enabled: true,
  },
  {
    label: 'お問い合わせ',
    path: '/admin/inquiries',
    icon: MailIcon,
    enabled: true,
  },
  {
    label: '顧客',
    path: '/admin/customers',
    icon: UsersIcon,
    enabled: true,
  },
  {
    label: '設定',
    path: '/admin/settings',
    icon: SettingsIcon,
    enabled: true,
  },
]

export function AdminLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isTopbarPinned, setIsTopbarPinned] = useState(false)

  return (
    <main
      className={cn(
        'min-h-svh bg-muted/35 text-foreground',
        isTopbarPinned && 'flex h-svh flex-col overflow-hidden',
      )}
    >
      {isSidebarVisible ? <AdminSidebar /> : null}

      <div
        className={cn(
          'min-w-0',
          isTopbarPinned && 'flex min-h-0 flex-1 flex-col overflow-hidden',
          isSidebarVisible && 'lg:pl-[272px]',
        )}
      >
        <AdminTopbar
          isSidebarVisible={isSidebarVisible}
          isTopbarPinned={isTopbarPinned}
          onToggleSidebar={() => setIsSidebarVisible((current) => !current)}
          onToggleTopbarPinned={() => setIsTopbarPinned((current) => !current)}
        />

        <div
          className={cn(
            isTopbarPinned &&
              'min-h-0 flex-1 overflow-y-auto overscroll-y-none',
          )}
        >
          <div
            className={cn(
              'mx-auto grid gap-5 px-gutter py-5 sm:gap-6 sm:py-6',
              isSidebarVisible ? 'max-w-[1440px]' : 'max-w-[1760px]',
            )}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  )
}

function AdminSidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="min-w-0 overflow-hidden border-b bg-card lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:h-svh lg:w-[272px] lg:border-r lg:border-b-0">
      <div className="flex h-full min-h-0 flex-col">
        <div className="admin-layout-header-row flex items-center justify-between gap-3 border-b px-gutter py-4 lg:px-4 lg:py-0">
          <Link
            className="inline-flex min-w-0 items-center gap-2 rounded-lg font-heading text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            to="/admin"
          >
            <img
              alt=""
              aria-hidden="true"
              className="size-8 rounded-lg"
              src={assetUrl(
                '/skym-shop-assets/images/theme/skymshop-favicon.png',
              )}
            />
            <span className="min-w-0 truncate">SKYMSHOP Admin</span>
          </Link>
        </div>

        <div className="min-w-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:overscroll-contain">
          <nav
            aria-label="管理画面"
            className="flex min-w-0 [scrollbar-width:none] gap-2 overflow-x-auto px-gutter py-3 lg:grid lg:gap-1 lg:overflow-visible lg:px-3 lg:py-4 [&::-webkit-scrollbar]:hidden"
          >
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.path === '/admin'
                  ? pathname === item.path
                  : pathname === item.path ||
                    pathname.startsWith(`${item.path}/`)
              const className = cn(
                'inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-full lg:justify-start',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                !item.enabled &&
                  'hover:bg-transparent hover:text-muted-foreground',
              )

              if (item.enabled) {
                return (
                  <Link className={className} key={item.path} to={item.path}>
                    <Icon aria-hidden="true" className="size-4" />
                    {item.label}
                  </Link>
                )
              }

              return (
                <button className={className} key={item.path} type="button">
                  <Icon aria-hidden="true" className="size-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-auto hidden border-t p-4 lg:block">
            <div className="rounded-lg border bg-muted/35 p-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheckIcon aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">管理者認証</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Supabase Auth / Google
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2Icon
                  aria-hidden="true"
                  className="size-3.5 text-chart-3"
                />
                owner.skym@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function AdminTopbar({
  isSidebarVisible,
  isTopbarPinned,
  onToggleSidebar,
  onToggleTopbarPinned,
}: {
  isSidebarVisible: boolean
  isTopbarPinned: boolean
  onToggleSidebar: () => void
  onToggleTopbarPinned: () => void
}) {
  const SidebarToggleIcon = isSidebarVisible
    ? PanelLeftCloseIcon
    : PanelLeftOpenIcon
  const TopbarToggleIcon = isTopbarPinned ? PinOffIcon : PinIcon

  return (
    <header
      className={cn(
        'admin-layout-header-row border-b bg-background',
        isTopbarPinned && 'shrink-0',
      )}
    >
      <div
        className={cn(
          'admin-layout-topbar-inner mx-auto flex flex-col gap-3 px-gutter py-3 sm:flex-row sm:items-center sm:justify-between',
          isSidebarVisible ? 'max-w-[1440px]' : 'max-w-[1760px]',
        )}
      >
        <label className="relative block min-w-0 sm:max-w-md sm:flex-1">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label="管理画面検索"
            className="bg-card pr-3 pl-10"
            placeholder="注文番号・商品名・顧客名で検索"
            type="search"
          />
        </label>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <div className="flex items-center gap-2">
            <Button
              aria-label={
                isSidebarVisible ? 'サイドバーを非表示' : 'サイドバーを表示'
              }
              aria-pressed={isSidebarVisible}
              onClick={onToggleSidebar}
              size="icon"
              title={
                isSidebarVisible ? 'サイドバーを非表示' : 'サイドバーを表示'
              }
              type="button"
              variant="outline"
            >
              <SidebarToggleIcon aria-hidden="true" />
            </Button>
            <Button
              aria-label={
                isTopbarPinned ? 'ヘッダー固定を解除' : 'ヘッダーを固定'
              }
              aria-pressed={isTopbarPinned}
              onClick={onToggleTopbarPinned}
              size="icon"
              title={isTopbarPinned ? 'ヘッダー固定を解除' : 'ヘッダーを固定'}
              type="button"
              variant="outline"
            >
              <TopbarToggleIcon aria-hidden="true" />
            </Button>
            <Button asChild className="h-9 px-3" variant="outline">
              <Link to="/">
                <StoreIcon data-icon="inline-start" />
                ストア
              </Link>
            </Button>
            <ThemeToggle className="bg-card" />
            <Button aria-label="ログアウト" size="icon" variant="outline">
              <LogOutIcon aria-hidden="true" />
            </Button>
          </div>

          <div className="hidden min-w-0 items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 sm:flex">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              SK
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">
                owner.skym@gmail.com
              </p>
              <p className="truncate text-[0.7rem] text-muted-foreground">
                オーナー
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
