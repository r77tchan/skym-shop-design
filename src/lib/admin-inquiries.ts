export type AdminInquiryStatus = '未対応' | '対応中' | '対応済み'

export type AdminInquiry = {
  id: number
  status: AdminInquiryStatus
  name: string
  email: string
  category: string
  subject: string
  body: string
  receivedAt: string
}

export type AdminInquiryRow = {
  displayNo: number
  inquiry: AdminInquiry
}

export const adminInquiryStatusOptions: readonly AdminInquiryStatus[] = [
  '未対応',
  '対応中',
  '対応済み',
]

export const adminInquiries: readonly AdminInquiry[] = [
  {
    id: 6,
    status: '未対応',
    name: '田中 瑞希',
    email: 'mizuki.tanaka@gmail.com',
    category: '注文・配送',
    subject: '発送予定日の確認',
    body: '本日注文したフォルテ 2.1g ほか2点の発送予定と追跡番号の反映タイミングを確認したい。',
    receivedAt: '2026/06/20 11:24',
  },
  {
    id: 5,
    status: '対応中',
    name: '佐藤 陽翔',
    email: 'haruto.sato@gmail.com',
    category: '商品',
    subject: '限定カラーの再入荷予定',
    body: 'ドリフトスピン限定カラーの別カラー再入荷があるか、入荷通知を受け取れるか確認したい。',
    receivedAt: '2026/06/20 10:08',
  },
  {
    id: 4,
    status: '未対応',
    name: '中村 葵',
    email: 'aoi.nakamura@gmail.com',
    category: '返品・交換',
    subject: '返金処理の進行状況',
    body: '返金処理中の注文について、返金反映予定日と担当者確認の状況を知りたい。',
    receivedAt: '2026/06/19 18:52',
  },
  {
    id: 3,
    status: '対応済み',
    name: '小林 結衣',
    email: 'yui.kobayashi@gmail.com',
    category: '注文・配送',
    subject: 'ネコポス追跡番号について',
    body: '発送済みメールに記載された追跡番号が配送会社側でまだ反映されていない。',
    receivedAt: '2026/06/19 15:31',
  },
  {
    id: 2,
    status: '対応中',
    name: '鈴木 蓮',
    email: 'ren.suzuki@gmail.com',
    category: '決済',
    subject: '決済完了メールが届かない',
    body: 'フック トライアルパックの注文後、決済完了メールが届いていないため状況を確認したい。',
    receivedAt: '2026/06/18 12:10',
  },
  {
    id: 1,
    status: '対応済み',
    name: '伊藤 空',
    email: 'sora.ito@gmail.com',
    category: 'イベント',
    subject: 'イベント販売商品の取り置き',
    body: 'SKYM トラウトカップで販売予定の商品について、オンラインでの事前取り置きが可能か知りたい。',
    receivedAt: '2026/06/17 09:42',
  },
]

export function getAdminInquiryRows(
  inquiries: ReadonlyArray<AdminInquiry> = adminInquiries,
): AdminInquiryRow[] {
  return inquiries.map((inquiry, index) => ({
    displayNo: index + 1,
    inquiry,
  }))
}

export function findAdminInquiryById(inquiryId?: string) {
  return adminInquiries.find((inquiry) => String(inquiry.id) === inquiryId)
}

export function getAdminInquiryStatusClassName(status: AdminInquiryStatus) {
  if (status === '未対応') {
    return 'bg-chart-4/14 text-chart-4'
  }

  if (status === '対応中') {
    return 'bg-primary/10 text-primary'
  }

  return 'bg-muted text-muted-foreground'
}
