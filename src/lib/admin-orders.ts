export type AdminOrderStatus = '未対応' | '対応済み' | 'キャンセル'

export type AdminOrderItem = {
  id: number
  name: string
  option: string
  productId?: number
  unitPrice: string
  quantity: number
  subtotal: string
}

export type AdminOrder = {
  id: number
  amount: string
  customer: string
  customerEmail: string
  customerNote: string
  customerPhone: string
  deliveryMethod: string
  itemCount: number
  items: AdminOrderItem[]
  orderNumber: string
  orderedAt: string
  paymentMethod: string
  paymentStatus: string
  responseStatus: AdminOrderStatus
  shippingAddress: string
  shippingFee: string
  shippingName: string
  shippingPostalCode: string
  subtotal: string
  trackingNumber: string
  adminMemo: string
}

export type AdminOrderRow = {
  displayNo: number
  order: AdminOrder
}

export const adminOrders: AdminOrder[] = [
  {
    id: 6,
    amount: '¥4,480',
    customer: '田中 瑞希',
    customerEmail: 'mizuki.tanaka@gmail.com',
    customerNote: '週末の釣行で使いたいため、可能であれば早めの発送を希望。',
    customerPhone: '090-2184-7741',
    deliveryMethod: 'ネコポス',
    itemCount: 3,
    items: [
      {
        id: 1,
        name: 'ASTRAR 2.4g',
        option: 'メタ・レアル',
        productId: 24,
        unitPrice: '¥400',
        quantity: 1,
        subtotal: '¥400',
      },
      {
        id: 2,
        name: 'フォルテ 2.1g',
        option: 'オレ金',
        productId: 18,
        unitPrice: '¥680',
        quantity: 1,
        subtotal: '¥680',
      },
      {
        id: 3,
        name: 'ドリフトスピン',
        option: '限定カラー',
        productId: 20,
        unitPrice: '¥3,400',
        quantity: 1,
        subtotal: '¥3,400',
      },
    ],
    orderNumber: '20260620-A7K9Q2',
    orderedAt: '2026/06/20 10:42',
    paymentMethod: 'クレジットカード',
    paymentStatus: '支払い済み',
    responseStatus: '対応済み',
    shippingAddress: '東京都世田谷区池尻 1-2-3 SKYマンション 402',
    shippingFee: '¥0',
    shippingName: '田中 瑞希',
    shippingPostalCode: '154-0001',
    subtotal: '¥4,480',
    trackingNumber: '4390-1184-2671',
    adminMemo: '6/20 13:10 発送完了メール送信済み。',
  },
  {
    id: 5,
    amount: '¥1,280',
    customer: '佐藤 陽翔',
    customerEmail: 'haruto.sato@gmail.com',
    customerNote: '',
    customerPhone: '080-3941-6205',
    deliveryMethod: 'ネコポス',
    itemCount: 1,
    items: [
      {
        id: 1,
        name: 'フック トライアルパック',
        option: 'Sサイズ',
        productId: 19,
        unitPrice: '¥1,280',
        quantity: 1,
        subtotal: '¥1,280',
      },
    ],
    orderNumber: '20260620-M4T8XD',
    orderedAt: '2026/06/20 09:18',
    paymentMethod: 'クレジットカード',
    paymentStatus: '支払い済み',
    responseStatus: '未対応',
    shippingAddress: '神奈川県横浜市青葉区美しが丘 4-8-12',
    shippingFee: '¥0',
    shippingName: '佐藤 陽翔',
    shippingPostalCode: '225-0002',
    subtotal: '¥1,280',
    trackingNumber: '',
    adminMemo: '',
  },
  {
    id: 4,
    amount: '¥2,640',
    customer: '小林 結衣',
    customerEmail: 'yui.kobayashi@gmail.com',
    customerNote: '不在が多いのでポスト投函でお願いします。',
    customerPhone: '090-8502-3349',
    deliveryMethod: 'ネコポス',
    itemCount: 1,
    items: [
      {
        id: 1,
        name: 'スプーンセット',
        option: 'クリアウォーター',
        unitPrice: '¥2,640',
        quantity: 1,
        subtotal: '¥2,640',
      },
    ],
    orderNumber: '20260619-Q6H3NP',
    orderedAt: '2026/06/19 18:04',
    paymentMethod: 'クレジットカード',
    paymentStatus: '支払い済み',
    responseStatus: '対応済み',
    shippingAddress: '埼玉県さいたま市浦和区常盤 7-1-5',
    shippingFee: '¥0',
    shippingName: '小林 結衣',
    shippingPostalCode: '330-0061',
    subtotal: '¥2,640',
    trackingNumber: '4390-1184-2618',
    adminMemo: '同梱なし。発送済み。',
  },
  {
    id: 3,
    amount: '¥980',
    customer: '鈴木 蓮',
    customerEmail: 'ren.suzuki@gmail.com',
    customerNote: '',
    customerPhone: '070-7610-1208',
    deliveryMethod: 'ネコポス',
    itemCount: 1,
    items: [
      {
        id: 1,
        name: 'ラインカッター',
        option: 'ブラック',
        unitPrice: '¥980',
        quantity: 1,
        subtotal: '¥980',
      },
    ],
    orderNumber: '20260619-R8C5VY',
    orderedAt: '2026/06/19 16:27',
    paymentMethod: 'クレジットカード',
    paymentStatus: '支払い済み',
    responseStatus: '未対応',
    shippingAddress: '千葉県船橋市本町 2-14-9',
    shippingFee: '¥0',
    shippingName: '鈴木 蓮',
    shippingPostalCode: '273-0005',
    subtotal: '¥980',
    trackingNumber: '',
    adminMemo: '',
  },
  {
    id: 2,
    amount: '¥6,200',
    customer: '中村 葵',
    customerEmail: 'aoi.nakamura@gmail.com',
    customerNote: 'カラーの重複があれば別カラーに変更希望。',
    customerPhone: '080-5501-2840',
    deliveryMethod: '宅急便コンパクト',
    itemCount: 5,
    items: [
      {
        id: 1,
        name: 'SKYM セレクトボックス',
        option: 'エリアトラウト',
        unitPrice: '¥5,000',
        quantity: 1,
        subtotal: '¥5,000',
      },
      {
        id: 2,
        name: 'ステッカー',
        option: 'ロゴ',
        unitPrice: '¥350',
        quantity: 2,
        subtotal: '¥700',
      },
      {
        id: 3,
        name: 'スプリットリング',
        option: '#0',
        unitPrice: '¥250',
        quantity: 2,
        subtotal: '¥500',
      },
    ],
    orderNumber: '20260618-K9D2WJ',
    orderedAt: '2026/06/18 14:11',
    paymentMethod: 'クレジットカード',
    paymentStatus: '返金済み',
    responseStatus: 'キャンセル',
    shippingAddress: '愛知県名古屋市中区栄 3-6-1',
    shippingFee: '¥0',
    shippingName: '中村 葵',
    shippingPostalCode: '460-0008',
    subtotal: '¥6,200',
    trackingNumber: '',
    adminMemo: '在庫欠品によりキャンセル。返金処理済み。',
  },
  {
    id: 1,
    amount: '¥3,760',
    customer: '伊藤 空',
    customerEmail: 'sora.ito@gmail.com',
    customerNote: '',
    customerPhone: '090-6729-4311',
    deliveryMethod: 'ネコポス',
    itemCount: 2,
    items: [
      {
        id: 1,
        name: 'ボトムプラグ',
        option: 'マットブラウン',
        productId: 3,
        unitPrice: '¥1,880',
        quantity: 2,
        subtotal: '¥3,760',
      },
    ],
    orderNumber: '20260618-N5X7LA',
    orderedAt: '2026/06/18 11:35',
    paymentMethod: 'クレジットカード',
    paymentStatus: '支払い済み',
    responseStatus: '対応済み',
    shippingAddress: '大阪府大阪市北区梅田 1-1-3',
    shippingFee: '¥0',
    shippingName: '伊藤 空',
    shippingPostalCode: '530-0001',
    subtotal: '¥3,760',
    trackingNumber: '4390-1184-2551',
    adminMemo: '発送済み。問い合わせなし。',
  },
]

export function getAdminOrderRows(
  orders: ReadonlyArray<AdminOrder> = adminOrders,
): AdminOrderRow[] {
  return orders.map((order, index) => ({
    displayNo: index + 1,
    order,
  }))
}

export function findAdminOrderById(orderId?: string) {
  return adminOrders.find((order) => String(order.id) === orderId)
}

export function getAdminOrderStatusClassName(status: AdminOrderStatus) {
  if (status === '対応済み') {
    return 'bg-muted text-muted-foreground'
  }

  if (status === 'キャンセル') {
    return 'bg-muted text-muted-foreground'
  }

  return 'bg-chart-4/14 text-chart-4'
}
