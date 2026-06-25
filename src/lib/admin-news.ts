import { newsItems, type NewsItem } from '@/lib/shop-content'

export type AdminNewsItem = NewsItem & {
  published: boolean
}

export type AdminNewsRow = {
  displayNo: number
  item: AdminNewsItem
  publishedAt: string
  summary: string
}

const unpublishedAdminNewsItem: AdminNewsItem = {
  id: 7,
  date: '2026.06.22',
  label: 'お知らせ',
  title: '週末発送スケジュール 下書き',
  content: [
    '週末の発送スケジュールを調整中です。公開前の確認用として非公開にしています。',
  ],
  published: false,
}

export const adminNewsItems: readonly AdminNewsItem[] = [
  unpublishedAdminNewsItem,
  ...newsItems.map((item) => ({
    ...item,
    published: true,
  })),
]

export const adminNewsLabelOptions = Array.from(
  new Set(adminNewsItems.map((item) => item.label)),
)

export function getAdminNewsRows(
  items: ReadonlyArray<AdminNewsItem> = adminNewsItems,
): AdminNewsRow[] {
  return items.map((item, index) => ({
    displayNo: index + 1,
    item,
    publishedAt: getAdminNewsDisplayDate(item.date),
    summary: item.content[0],
  }))
}

export function findAdminNewsById(newsId?: string) {
  return adminNewsItems.find((item) => String(item.id) === newsId)
}

export function getAdminNewsContentValue(item: AdminNewsItem) {
  return item.content.join('\n\n')
}

export function getAdminNewsDateInputValue(date: string) {
  return date.replace(/\./g, '-')
}

export function getAdminNewsDisplayDate(date: string) {
  return date.replace(/\./g, '/')
}

export function getAdminNewsPublicPath(item: AdminNewsItem) {
  return `/news/${item.id}`
}
