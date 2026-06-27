import { getNewsExcerpt } from '@/lib/news-markdown'
import { newsItems, newsTags, type NewsItem } from '@/lib/shop-content'

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
  publishedOn: '2026.06.22',
  tag: 'お知らせ',
  mainImageUrl: null,
  title: '週末発送スケジュール 下書き',
  body: '週末の発送スケジュールを調整中です。公開前の確認用として非公開にしています。',
  published: false,
}

export const adminNewsItems: readonly AdminNewsItem[] = [
  unpublishedAdminNewsItem,
  ...newsItems.map((item) => ({
    ...item,
    published: true,
  })),
]

export const adminNewsTagOptions = [...newsTags]

export function getAdminNewsRows(
  items: ReadonlyArray<AdminNewsItem> = adminNewsItems,
): AdminNewsRow[] {
  return items.map((item, index) => ({
    displayNo: index + 1,
    item,
    publishedAt: getAdminNewsDisplayDate(item.publishedOn),
    summary: getNewsExcerpt(item.body),
  }))
}

export function findAdminNewsById(newsId?: string) {
  return adminNewsItems.find((item) => String(item.id) === newsId)
}

export function getAdminNewsDateInputValue(publishedOn: string) {
  return publishedOn.replace(/\./g, '-')
}

export function getAdminNewsDisplayDate(publishedOn: string) {
  return publishedOn.replace(/\./g, '/')
}

export function getAdminNewsPublicPath(item: AdminNewsItem) {
  return `/news/${item.id}`
}
