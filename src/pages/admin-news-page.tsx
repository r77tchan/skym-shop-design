import {
  ArrowUpDownIcon,
  CalendarClockIcon,
  ChevronDownIcon,
  EyeIcon,
  MoreHorizontalIcon,
  NewspaperIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { NewsLabelBadge } from '@/components/news-label-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getNewsItemPath, newsItems } from '@/lib/shop-content'
import { cn } from '@/lib/utils'

type AdminNewsStatus = '公開中' | '予約済み' | '下書き' | '非公開'

type AdminNewsRow = {
  id: string
  title: string
  label: string
  publishAt: string
  updatedAt: string
  author: string
  status: AdminNewsStatus
  summary: string
  views: string
  path?: string
}

const publishedNewsRows: AdminNewsRow[] = newsItems.map((item, index) => ({
  id: `NEWS-${String(120 - index).padStart(3, '0')}`,
  title: item.title,
  label: item.label,
  publishAt: item.date,
  updatedAt: `2026.06.${String(18 - (index % 6)).padStart(2, '0')}`,
  author: index % 2 === 0 ? 'Owner' : 'Store Manager',
  status: index === newsItems.length - 1 ? '非公開' : '公開中',
  summary: item.content[0],
  views: `${1240 - index * 112}`,
  path: getNewsItemPath(item),
}))

const draftNewsRows: AdminNewsRow[] = [
  {
    id: 'NEWS-121',
    title: 'ValkeINスプーン 再入荷',
    label: '入荷',
    publishAt: '2026.06.22',
    updatedAt: '2026.06.20',
    author: 'Owner',
    status: '下書き',
    summary: '人気カラーを中心に再入荷したValkeINスプーンの販売開始案内です。',
    views: '-',
  },
  {
    id: 'NEWS-122',
    title: '週末の発送スケジュールについて',
    label: 'お知らせ',
    publishAt: '2026.06.24',
    updatedAt: '2026.06.20',
    author: 'Store Manager',
    status: '予約済み',
    summary: '週末の注文集中に伴う発送タイミングと追跡番号連携の案内です。',
    views: '-',
  },
]

const adminNewsRows = [...draftNewsRows, ...publishedNewsRows]

const newsStats = [
  {
    label: '公開中',
    value: `${adminNewsRows.filter((news) => news.status === '公開中').length}件`,
    detail: 'ストアのお知らせに表示',
    icon: NewspaperIcon,
    colorClassName: 'bg-chart-3/12 text-chart-3',
  },
  {
    label: '予約済み',
    value: `${adminNewsRows.filter((news) => news.status === '予約済み').length}件`,
    detail: '公開日時を設定済み',
    icon: CalendarClockIcon,
    colorClassName: 'bg-primary/10 text-primary',
  },
  {
    label: '下書き',
    value: `${adminNewsRows.filter((news) => news.status === '下書き').length}件`,
    detail: '公開前の編集対象',
    icon: PencilIcon,
    colorClassName: 'bg-chart-4/14 text-chart-4',
  },
  {
    label: '今月の閲覧',
    value: '4,920',
    detail: '公開記事の合計表示',
    icon: EyeIcon,
    colorClassName: 'bg-chart-1/12 text-chart-1',
  },
]

const quickFilters = [
  {
    label: '全て',
    count: adminNewsRows.length,
    active: true,
  },
  {
    label: '公開中',
    count: adminNewsRows.filter((news) => news.status === '公開中').length,
  },
  {
    label: '予約済み',
    count: adminNewsRows.filter((news) => news.status === '予約済み').length,
  },
  {
    label: '下書き',
    count: adminNewsRows.filter((news) => news.status === '下書き').length,
  },
  {
    label: '非公開',
    count: adminNewsRows.filter((news) => news.status === '非公開').length,
  },
]

function getNewsStatusClassName(status: AdminNewsStatus) {
  if (status === '公開中') {
    return 'bg-chart-3/12 text-chart-3'
  }

  if (status === '予約済み') {
    return 'bg-primary/10 text-primary'
  }

  if (status === '下書き') {
    return 'bg-chart-4/14 text-chart-4'
  }

  return 'bg-muted text-muted-foreground'
}

export function AdminNewsPage() {
  return (
    <>
      <NewsPageHeader />

      <section
        aria-label="お知らせの主要指標"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {newsStats.map((stat) => {
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

      <section className="grid gap-4 rounded-lg border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="お知らせ検索"
              className="bg-background pr-3 pl-10"
              placeholder="タイトル・ラベル・本文で検索"
              type="search"
            />
          </label>

          <div className="flex items-center gap-2">
            <Button className="h-11 px-3 lg:hidden" variant="outline">
              <SlidersHorizontalIcon data-icon="inline-start" />
              絞り込み
            </Button>
            <Button className="h-11 px-3" variant="outline">
              <ArrowUpDownIcon data-icon="inline-start" />
              公開日順
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>

        <div className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {quickFilters.map((filter) => (
              <button
                aria-pressed={filter.active ? 'true' : 'false'}
                className={cn(
                  'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium whitespace-nowrap',
                  filter.active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-accent/55',
                )}
                key={filter.label}
                type="button"
              >
                <span>{filter.label}</span>
                <span
                  className={cn(
                    'text-xs',
                    filter.active
                      ? 'text-primary-foreground/75'
                      : 'text-muted-foreground',
                  )}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <NewsTable />
    </>
  )
}

function NewsPageHeader() {
  return (
    <section className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
          お知らせ
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-10 px-3" variant="outline">
          <SendIcon data-icon="inline-start" />
          予約公開
        </Button>
        <Button className="h-10 px-3">
          <PlusIcon data-icon="inline-start" />
          新規作成
        </Button>
      </div>
    </section>
  )
}

function NewsTable() {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">お知らせ一覧</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {adminNewsRows.length}件中 {adminNewsRows.length}件を表示
          </p>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <PencilIcon data-icon="inline-start" />
          下書きを確認
        </Button>
      </div>

      <div className="hidden border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground xl:grid xl:grid-cols-[minmax(280px,1.45fr)_86px_96px_112px_104px_92px_36px] xl:items-center xl:gap-3">
        <span>お知らせ</span>
        <span>ラベル</span>
        <span>公開日</span>
        <span>状態</span>
        <span>更新者</span>
        <span>閲覧</span>
        <span aria-hidden="true" />
      </div>

      <div className="hidden divide-y xl:block">
        {adminNewsRows.map((news) => (
          <NewsTableRow key={news.id} news={news} />
        ))}
      </div>

      <div className="grid divide-y xl:hidden">
        {adminNewsRows.map((news) => (
          <NewsMobileCard key={news.id} news={news} />
        ))}
      </div>
    </section>
  )
}

function NewsTableRow({ news }: { news: AdminNewsRow }) {
  return (
    <article className="grid px-4 py-3 xl:grid-cols-[minmax(280px,1.45fr)_86px_96px_112px_104px_92px_36px] xl:items-center xl:gap-3">
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold">{news.title}</p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {news.id}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {news.summary}
        </p>
      </div>

      <NewsLabelBadge label={news.label} />
      <p className="text-xs font-medium text-muted-foreground">
        {news.publishAt}
      </p>
      <Badge className={cn('w-fit', getNewsStatusClassName(news.status))}>
        {news.status}
      </Badge>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{news.author}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {news.updatedAt}
        </p>
      </div>
      <p className="text-sm font-semibold">{news.views}</p>
      <Button aria-label={`${news.title}の操作`} size="icon-sm" variant="ghost">
        <MoreHorizontalIcon aria-hidden="true" />
      </Button>
    </article>
  )
}

function NewsMobileCard({ news }: { news: AdminNewsRow }) {
  return (
    <article className="grid gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <NewsLabelBadge label={news.label} />
            <Badge className={cn(getNewsStatusClassName(news.status))}>
              {news.status}
            </Badge>
          </div>
          <h2 className="mt-2 line-clamp-2 text-base leading-6 font-semibold">
            {news.title}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{news.id}</p>
        </div>
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
        {news.summary}
      </p>

      <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/35 p-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">公開日</p>
          <p className="mt-1 font-medium">{news.publishAt}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">更新者</p>
          <p className="mt-1 truncate font-medium">{news.author}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">更新日</p>
          <p className="mt-1 font-medium">{news.updatedAt}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">閲覧</p>
          <p className="mt-1 font-medium">{news.views}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button className="h-9 px-3" variant="outline">
          <PencilIcon data-icon="inline-start" />
          編集
        </Button>
        {news.path ? (
          <Button asChild className="h-9 px-3" variant="outline">
            <Link to={news.path}>
              <EyeIcon data-icon="inline-start" />
              表示
            </Link>
          </Button>
        ) : (
          <Button className="h-9 px-3" variant="outline">
            <CalendarClockIcon data-icon="inline-start" />
            予約
          </Button>
        )}
      </div>
    </article>
  )
}
