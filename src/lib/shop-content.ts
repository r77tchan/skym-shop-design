export const companyName = '株式会社SKYM'
export const companyUrl = 'https://skym.co.jp/'

export const shopDescription = `${companyName} が運営するフィッシングタックル オンラインストア。トラウトを中心に、フィールドを愛するアングラーへ確かな道具をお届けします。`

// お知らせタグのマスタ（/admin/settings/news-tags で管理する想定）。
export const newsTags = ['お知らせ', '入荷', 'NEW', 'SALE', 'EVENT'] as const

export type NewsItem = {
  id: number
  publishedOn: string
  tag: string | null
  mainImageUrl: string | null
  title: string
  body: string
}

export const newsItems: readonly NewsItem[] = [
  {
    id: 6,
    publishedOn: '2026.06.01',
    tag: '入荷',
    mainImageUrl:
      '/skym-shop-assets/images/products/valkein-astrar-2-4g-front.jpg',
    title: 'ValkeINスプーン 入荷しました',
    body: [
      '人気のValkeINスプーンが各カラー再入荷しました。シーズンを問わず使いやすい定番色を中心に、フィールドでの反応を見ながらローテーションしやすいラインナップを揃えています。',
      '![入荷したValkeINスプーン](/skym-shop-assets/images/products/valkein-astrar-2-4g-back.jpg)',
      '在庫数には限りがあります。気になるカラーがある場合は、商品一覧より在庫状況をご確認ください。',
    ].join('\n\n'),
  },
  {
    id: 5,
    publishedOn: '2026.05.28',
    tag: '入荷',
    mainImageUrl:
      '/skym-shop-assets/images/products/rodio-drift-spin-37-chart-front.jpg',
    title: 'ロデオクラフト ドリフトスピン 入荷しました',
    body: [
      '高実績のドリフトスピンが入荷しました。スプーンで届かないレンジや、魚の追いが弱い場面のローテーションにおすすめです。',
      '入荷カラーは順次追加予定です。販売開始後は在庫が変動しやすいため、購入前に商品ページをご確認ください。',
    ].join('\n\n'),
  },
  {
    id: 4,
    publishedOn: '2026.05.25',
    tag: 'SALE',
    mainImageUrl: null,
    title: 'サマーセール開催中',
    body: [
      '対象のルアーを期間限定価格で販売しています。カラー補充やシーズン前の買い足しにご利用ください。',
      'セール対象商品は予告なく変更となる場合があります。完売後の再入荷や価格変更については、各商品ページでご案内します。',
    ].join('\n\n'),
  },
  {
    id: 3,
    publishedOn: '2026.05.18',
    tag: 'お知らせ',
    mainImageUrl: null,
    title: '発送スケジュールについて',
    body: [
      'ご注文状況により、発送まで通常よりお時間をいただく場合があります。発送完了後は追跡番号をメールでお送りします。',
      'お急ぎの場合は、購入前に発送予定日をご確認ください。配送方法や地域によって到着までの日数が異なります。',
    ].join('\n\n'),
  },
  {
    id: 2,
    publishedOn: '2026.05.10',
    tag: 'NEW',
    mainImageUrl:
      '/skym-shop-assets/images/products/rodio-noa-b-2-2g-front.jpg',
    title: 'オリジナルカラー販売開始',
    body: [
      'フィールドでの視認性と食わせを意識したオリジナルカラーを追加しました。晴天時、曇天時、濁りのある水質でも使い分けしやすいカラー展開です。',
      '数量限定のため、在庫がなくなり次第終了です。再販売の予定がある場合は、改めてお知らせします。',
    ].join('\n\n'),
  },
  {
    id: 1,
    publishedOn: '2026.04.30',
    tag: 'EVENT',
    mainImageUrl:
      '/skym-shop-assets/images/products/jackall-tapdancer-daigo-front.jpg',
    title: 'SKYM トラウトカップ 2026 受付開始',
    body: [
      'トラウトアングラー向けイベントの受付を開始しました。参加方法、開催場所、当日のスケジュールは順次ご案内します。',
      '定員に達し次第、受付を終了する場合があります。参加をご希望の方は、最新のお知らせをご確認ください。',
    ].join('\n\n'),
  },
]

export function getNewsItemPath(item: NewsItem) {
  return `/news/${item.id}`
}

export const productCategories = [
  '全て',
  'スプーン',
  'プラグ',
  'ロッド＆リール',
  'フック',
] as const

export type ProductCategory = Exclude<
  (typeof productCategories)[number],
  '全て'
>

export type ProductSpecInputType = 'text' | 'select' | 'number'

export type ProductCategorySpec = {
  aliases?: readonly string[]
  key: string
  label: string
  inputType: ProductSpecInputType
  filterable?: boolean
  options?: readonly string[]
  required?: boolean
  unit?: string
}

export const productCategoryItems = [
  {
    id: 1,
    label: 'スプーン',
    slug: 'spoons',
    specs: [
      {
        key: 'weight',
        label: 'ウエイト',
        inputType: 'text',
        filterable: true,
        required: true,
      },
    ],
  },
  {
    id: 2,
    label: 'プラグ',
    slug: 'plugs',
    specs: [
      {
        aliases: ['サイズ'],
        key: 'length',
        label: 'レングス',
        inputType: 'text',
        filterable: true,
      },
      {
        key: 'weight',
        label: 'ウエイト',
        inputType: 'text',
        filterable: true,
      },
    ],
  },
  {
    id: 3,
    label: 'ロッド＆リール',
    slug: 'rods-reels',
    specs: [],
  },
  {
    id: 4,
    label: 'フック',
    slug: 'hooks',
    specs: [],
  },
] as const satisfies ReadonlyArray<{
  id: number
  label: ProductCategory
  specs: readonly ProductCategorySpec[]
  slug: string
}>

export type ProductCategoryId = (typeof productCategoryItems)[number]['id']

export const productBrandItems = [
  { id: 1, label: 'VELVET ARTS', slug: 'velvet-arts' },
  { id: 2, label: 'ValkeIN', slug: 'valkein' },
  { id: 3, label: 'RODIO CRAFT', slug: 'rodio-craft' },
  { id: 4, label: '1089工房', slug: '1089-koubou' },
  { id: 5, label: 'YARIE', slug: 'yarie' },
  { id: 6, label: 'sauribu', slug: 'sauribu' },
  { id: 7, label: 'JACKALL', slug: 'jackall' },
  { id: 8, label: 'DAYSPROUT', slug: 'daysprout' },
  { id: 9, label: 'SKYM', slug: 'skym' },
] as const

export type ProductBrand = (typeof productBrandItems)[number]['label']
export type ProductBrandId = (typeof productBrandItems)[number]['id']
export type ProductBrandSlug = (typeof productBrandItems)[number]['slug']

export const productBrands = productBrandItems.map(
  (brand) => brand.label,
) as readonly ProductBrand[]
export type ProductSpecValueType = 'text' | 'number' | 'option'

export type ProductCategorySpecOption = {
  label: string
  slug?: string
}

export type ProductCategorySpecDefinition = {
  aliases?: readonly string[]
  label: string
  slug: string
  valueType: ProductSpecValueType
  isFilterable?: boolean
  isRequired?: boolean
  options?: readonly ProductCategorySpecOption[]
  unit?: string
}

export type ProductCategoryMaster = {
  brands: readonly ProductBrand[]
  id: number
  label: ProductCategory
  slug: string
  specs: readonly ProductCategorySpecDefinition[]
}

export const productCategoryMasters = [
  {
    id: 1,
    label: 'スプーン',
    slug: 'spoons',
    brands: [
      'VELVET ARTS',
      'ValkeIN',
      'RODIO CRAFT',
      '1089工房',
      'YARIE',
      'sauribu',
    ],
    specs: [
      {
        label: 'ウエイト',
        slug: 'weight',
        valueType: 'option',
        isFilterable: true,
        isRequired: true,
        options: [
          { label: '0.6g', slug: '0-6g' },
          { label: '1.1g', slug: '1-1g' },
          { label: '1.6g', slug: '1-6g' },
          { label: '1.8g', slug: '1-8g' },
          { label: '2.1g', slug: '2-1g' },
          { label: '2.3g', slug: '2-3g' },
          { label: '2.4g', slug: '2-4g' },
          { label: '2.5g', slug: '2-5g' },
        ],
      },
      {
        label: 'カラー',
        slug: 'color',
        valueType: 'text',
      },
    ],
  },
  {
    id: 2,
    label: 'プラグ',
    slug: 'plugs',
    brands: ['1089工房', 'RODIO CRAFT', 'JACKALL', 'DAYSPROUT'],
    specs: [
      {
        aliases: ['サイズ'],
        label: 'レングス',
        slug: 'length',
        valueType: 'number',
        unit: 'mm',
      },
      {
        label: 'ウエイト',
        slug: 'weight',
        valueType: 'option',
        isFilterable: true,
        options: [
          { label: '2.0g', slug: '2-0g' },
          { label: '2.4g', slug: '2-4g' },
          { label: '3.7g', slug: '3-7g' },
        ],
      },
      {
        label: 'レンジ',
        slug: 'range',
        valueType: 'option',
        isFilterable: true,
        options: [
          { label: '表層', slug: 'surface' },
          { label: '中層', slug: 'middle' },
          { label: 'ボトム', slug: 'bottom' },
        ],
      },
    ],
  },
  {
    id: 3,
    label: 'ロッド＆リール',
    slug: 'rods-reels',
    brands: ['SKYM'],
    specs: [],
  },
  {
    id: 4,
    label: 'フック',
    slug: 'hooks',
    brands: ['SKYM'],
    specs: [
      {
        label: 'タイプ',
        slug: 'type',
        valueType: 'option',
        options: [{ label: '交換フック' }, { label: 'セット' }],
      },
    ],
  },
] as const satisfies readonly ProductCategoryMaster[]

export type ProductStatus = 'SOLD OUT' | 'SALE' | 'NEW'
export type ProductNewBadgeMode = 'auto' | 'show' | 'hide'

export type Product = {
  id: number
  name: string
  productBrandId: ProductBrandId | null
  productCategoryId: ProductCategoryId | null
  catchPhrase: string
  description: string
  sku: string
  janCode: string
  regularPrice: number
  salePrice?: number
  stockQuantity: number
  newBadgeMode: ProductNewBadgeMode
  isPublished: boolean
  specs: readonly {
    key?: string
    label: string
    value: string
  }[]
  image: string
  images: readonly string[]
}

export const products: readonly Product[] = [
  {
    id: 24,
    name: 'ASTRAR 2.4g（メタ・レアル）',
    productBrandId: 2,
    productCategoryId: 1,
    regularPrice: 400,
    stockQuantity: 18,
    newBadgeMode: 'auto',
    sku: '',
    janCode: '',
    isPublished: false,
    catchPhrase:
      '強めの波動で広く探れる2.4gスプーン。放流後や魚の位置を早く見つけたい場面に。',
    description: [
      'ASTRAR 2.4gは、しっかり水を押しながらテンポよくサーチできるスプーンです。魚のレンジが絞り切れていない時間帯でも、巻き速度を変えながら反応を確認しやすいモデルです。',
      'メタ・レアルは明滅で気づかせながら、アピールの強さを調整しやすいカラーです。放流直後の強い反応から、少し落ち着いたタイミングのフォローまで幅広く使えます。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.4g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: 'カラー', value: 'メタ・レアル' },
      { label: '用途', value: 'サーチ / 放流後' },
    ],
    image: '/skym-shop-assets/images/products/valkein-astrar-2-4g-front.jpg',
    images: [
      '/skym-shop-assets/images/products/valkein-astrar-2-4g-front.jpg',
      '/skym-shop-assets/images/products/valkein-astrar-2-4g-back.jpg',
    ],
  },
  {
    id: 23,
    name: 'フォルテ 2.1g（シルバー）',
    productBrandId: 1,
    productCategoryId: 1,
    regularPrice: 500,
    stockQuantity: 9,
    sku: '',
    janCode: '',
    newBadgeMode: 'show',
    isPublished: true,
    catchPhrase:
      'クリアウォーターで使いやすいシルバー。自然なフラッシングでスレたトラウトにも合わせやすい一枚。',
    description: [
      'フォルテ 2.1gは、渓流の清流から管理釣り場のスレたトラウトまで幅広く使える軽量スプーンです。水流を受けた時の細かなウォブリングで、低活性時でも魚に気づかせやすい設計です。',
      'シルバーは派手すぎない明滅で、晴天時やクリアな水質と相性がよいカラーです。表層から中層を一定速度で引き、追い切らない時は少しレンジを下げて反応を見てください。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.1g' },
      { label: 'タイプ', value: 'スプーン' },
      {
        label: '推奨ライン',
        value: 'ナイロン・フロロ 2〜4lb / エステル 0.3〜0.5号',
      },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    image:
      '/skym-shop-assets/images/products/161b25ac6ba3c56743cad57b38ad7ee5.jpg',
    images: [
      '/skym-shop-assets/images/products/161b25ac6ba3c56743cad57b38ad7ee5.jpg',
      '/skym-shop-assets/images/products/69a73427456d41f2899fbc9a0d38e7af.jpg',
    ],
  },
  {
    id: 22,
    name: 'さかさにょろ Slim 35FS',
    productBrandId: 4,
    productCategoryId: 2,
    regularPrice: 1980,
    stockQuantity: 7,
    sku: '',
    janCode: '',
    newBadgeMode: 'show',
    isPublished: true,
    catchPhrase:
      'ゆっくり巻いて誘えるニョロ系プラグ。スプーンで追い切らない魚への次の一手に。',
    description: [
      'さかさにょろ Slim 35FSは、低速域での揺らぎとレンジキープを活かして食わせに持ち込むニョロ系プラグです。プレッシャーの高い時間帯や、スプーンへの反応が弱い場面で投入しやすいモデルです。',
      '35mmのコンパクトなシルエットで、管理釣り場の小規模ポンドでも扱いやすいサイズ感です。一定速度のスローリトリーブを基準に、魚の反応を見ながらレンジを調整してください。',
    ].join('\n\n'),
    specs: [
      { label: 'サイズ', value: '35mm' },
      { label: 'タイプ', value: 'プラグ / FS' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    image:
      '/skym-shop-assets/images/products/02d6f2ac86e6516284eb5680692eabff.jpg',
    images: [
      '/skym-shop-assets/images/products/02d6f2ac86e6516284eb5680692eabff.jpg',
      '/skym-shop-assets/images/products/0243fb9faa79d8386e9bd9842da44ad7.jpg',
    ],
  },
  {
    id: 21,
    name: 'フォルテ 2.1g（リミテッドグロー）',
    productBrandId: 1,
    productCategoryId: 1,
    regularPrice: 500,
    stockQuantity: 0,
    sku: '',
    janCode: '',
    newBadgeMode: 'show',
    isPublished: true,
    catchPhrase:
      'グローを効かせた限定カラー。朝夕や濁りのある水質で魚に気づかせたい時に使いやすい一枚。',
    description: [
      'フォルテ 2.1gの扱いやすさはそのままに、視認性と明滅を足した限定カラーです。短時間で魚の反応を見たい場面や、放流後のサーチに向いています。',
      '数量限定入荷分は完売しました。再入荷がある場合は、お知らせや商品一覧で案内します。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.1g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    image:
      '/skym-shop-assets/images/products/161b25ac6ba3c56743cad57b38ad7ee5.jpg',
    images: [
      '/skym-shop-assets/images/products/161b25ac6ba3c56743cad57b38ad7ee5.jpg',
      '/skym-shop-assets/images/products/69a73427456d41f2899fbc9a0d38e7af.jpg',
    ],
  },
  {
    id: 20,
    name: 'ドリフトスピン 限定カラー',
    productBrandId: 3,
    productCategoryId: 2,
    regularPrice: 500,
    salePrice: 400,
    stockQuantity: 4,
    sku: '',
    janCode: '',
    newBadgeMode: 'show',
    isPublished: true,
    catchPhrase:
      'スローに誘えるサーチ系プラグの限定カラー。新着対象をセール価格で選べる一つです。',
    description: [
      'ドリフトスピンは、スプーンで追い切らない魚に対して別軸の波動で探りを入れやすいアイテムです。限定カラーは視認性が高く、レンジ調整の確認にも使いやすい配色です。',
      '新着商品のセール対象です。通常価格から割引した価格で表示しています。',
    ].join('\n\n'),
    specs: [
      { label: 'タイプ', value: 'プラグ' },
      { label: '用途', value: 'サーチ / フォロー' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
    ],
    image:
      '/skym-shop-assets/images/products/033805811c6e8f5bae5e02633d66741f.jpg',
    images: [
      '/skym-shop-assets/images/products/033805811c6e8f5bae5e02633d66741f.jpg',
      '/skym-shop-assets/images/products/19e666848cfebbab385005605c629181.jpg',
    ],
  },
  {
    id: 19,
    name: 'オリジナル フック トライアルパック',
    productBrandId: 9,
    productCategoryId: 4,
    regularPrice: 880,
    salePrice: 700,
    stockQuantity: 0,
    sku: '',
    janCode: '',
    newBadgeMode: 'show',
    isPublished: true,
    catchPhrase:
      'よく使うサイズを試しやすくまとめた新着トライアルパック。セール対象分は完売しました。',
    description: [
      '日々の交換用に使いやすいサイズを組み合わせたトライアルパックです。針先の状態を保ちやすく、スプーンや小型プラグの補修用として持っておきやすい内容です。',
      '新着のセール対象として用意した在庫は完売しました。再販売の予定がある場合は、改めて案内します。',
    ].join('\n\n'),
    specs: [
      { label: 'タイプ', value: '交換フック' },
      { label: '内容', value: '複数サイズセット' },
      { label: '用途', value: 'スプーン / 小型プラグ' },
    ],
    image:
      '/skym-shop-assets/images/products/04ac9a0e6908849f3cf8a5d496c1f898.jpg',
    images: [
      '/skym-shop-assets/images/products/04ac9a0e6908849f3cf8a5d496c1f898.jpg',
      '/skym-shop-assets/images/products/46592f4f09cc5d786f4f5939510113e8.jpg',
    ],
  },
  {
    id: 18,
    name: 'フォルテ 2.1g（二代目鱒王）',
    productBrandId: 1,
    productCategoryId: 1,
    regularPrice: 500,
    stockQuantity: 0,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '強めの明滅で魚に気づかせやすい、放流直後からサーチまで使いやすい2.1gスプーン。',
    description: [
      'フォルテ 2.1gは、管理釣り場でのテンポのよいサーチに向いたスプーンです。水をつかみやすいボディで、巻き速度を落としても姿勢が崩れにくく、手前まで丁寧に探れます。',
      '二代目鱒王は視認性とアピール力のバランスが取りやすいカラーです。魚の反応を見ながら、強い色から食わせ寄りの色へ展開するローテーションの起点に使えます。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.1g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    image:
      '/skym-shop-assets/images/products/009a5cdcca1badfeec38fad4838bbb11.jpg',
    images: [
      '/skym-shop-assets/images/products/009a5cdcca1badfeec38fad4838bbb11.jpg',
      '/skym-shop-assets/images/products/584d25c2afd6e229b5a9e852761016f6.jpg',
    ],
  },
  {
    id: 17,
    name: 'HI BURST 1.6g(UVフラッシュ)',
    productBrandId: 2,
    productCategoryId: 1,
    regularPrice: 400,
    stockQuantity: 11,
    sku: '',
    janCode: '',
    newBadgeMode: 'show',
    isPublished: true,
    catchPhrase:
      '定番HI BURSTの1.6g。UVフラッシュで魚に気づかせつつ、テンポよくレンジを刻めます。',
    description: [
      'HI BURST 1.6gは、軽快な巻き感と扱いやすいウエイトで、放流後から通常ローテーションまで幅広く使えるスプーンです。一定速度で巻きやすく、レンジの再現性を取りやすいところが魅力です。',
      'UVフラッシュは光量変化のある状況で使いやすいカラーです。曇天や日陰、濁りが入った水質でも魚に気づかせやすく、カラーの強弱を見たい時の基準になります。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '1.6g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    image:
      '/skym-shop-assets/images/products/01ffb9bb455cb67ba79e0f8049e3c6e0.jpg',
    images: [
      '/skym-shop-assets/images/products/01ffb9bb455cb67ba79e0f8049e3c6e0.jpg',
      '/skym-shop-assets/images/products/745f95f1b68fd2a62f47f427db72f9b1.jpg',
    ],
  },
  {
    id: 16,
    name: 'フォルテ 2.1g（キックオンザフェスタ）',
    productBrandId: 1,
    productCategoryId: 1,
    regularPrice: 500,
    stockQuantity: 0,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      'イベント感のある強めカラー。魚の目線を集めたい朝夕や濁りのある状況に。',
    description: [
      'フォルテ 2.1gの安定した泳ぎを活かしながら、カラーでしっかり存在感を出せるモデルです。放流直後や魚が散っている時間帯に、広い範囲を手早く探る使い方に向いています。',
      'キックオンザフェスタは、明るい水色でも暗い水色でも見失いにくい配色です。反応が落ちたら、同じウエイトの落ち着いたカラーへつなげるとローテーションしやすくなります。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.1g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    image:
      '/skym-shop-assets/images/products/0f3609149d944d478f4f2004dcf8842a.jpg',
    images: [
      '/skym-shop-assets/images/products/0f3609149d944d478f4f2004dcf8842a.jpg',
      '/skym-shop-assets/images/products/0646814113c352a6df4a9a1ac9416ddc.jpg',
    ],
  },
  {
    id: 15,
    name: 'ドリフトスピン',
    productBrandId: 3,
    productCategoryId: 2,
    regularPrice: 500,
    stockQuantity: 5,
    sku: '',
    janCode: '',
    newBadgeMode: 'show',
    isPublished: true,
    catchPhrase:
      'スプーンで届かない魚に入れやすいサーチ系プラグ。レンジ変化をつけたい時に。',
    description: [
      'ドリフトスピンは、スプーンの巻きでは反応が薄い魚に対して、別軸の波動で探りを入れやすいアイテムです。魚の追いが弱い時や、一定層に魚が溜まっている時のローテーションに向いています。',
      '小刻みなレンジ調整とスローな誘いを組み合わせることで、スプーンからプラグへ自然に展開できます。新着カラーの補充として、手持ちのスプーンと合わせて選びやすい一つです。',
    ].join('\n\n'),
    specs: [
      { label: 'タイプ', value: 'プラグ' },
      { label: '用途', value: 'サーチ / フォロー' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '中層〜ボトム付近' },
    ],
    image:
      '/skym-shop-assets/images/products/033805811c6e8f5bae5e02633d66741f.jpg',
    images: [
      '/skym-shop-assets/images/products/033805811c6e8f5bae5e02633d66741f.jpg',
      '/skym-shop-assets/images/products/19e666848cfebbab385005605c629181.jpg',
    ],
  },
  {
    id: 14,
    name: 'HI BURST 1.6g セールカラー',
    productBrandId: 2,
    productCategoryId: 1,
    regularPrice: 400,
    salePrice: 320,
    stockQuantity: 0,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '定番HI BURSTのセール対象カラー。使いやすい1.6gですが、対象在庫は完売しています。',
    description: [
      'HI BURST 1.6gは、巻き速度の調整がしやすく、表層から中層までテンポよく探れるスプーンです。セール対象カラーとして用意した在庫は完売しました。',
      '通常価格から割引したセール価格を表示しています。再入荷時の価格は変更となる場合があります。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '1.6g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
    ],
    image:
      '/skym-shop-assets/images/products/01ffb9bb455cb67ba79e0f8049e3c6e0.jpg',
    images: [
      '/skym-shop-assets/images/products/01ffb9bb455cb67ba79e0f8049e3c6e0.jpg',
      '/skym-shop-assets/images/products/745f95f1b68fd2a62f47f427db72f9b1.jpg',
    ],
  },
  {
    id: 13,
    name: 'デイジー 2.5g(027 マッディメタグリグロー)',
    productBrandId: 1,
    productCategoryId: 1,
    regularPrice: 500,
    stockQuantity: 9,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '軽量2.5gで繊細に誘えるデイジー。警戒心の強い魚にも使いやすい定番スプーン。',
    description: [
      'デイジー 2.5gは、軽い巻き感とフォール時のアピールを活かして、スレたトラウトにも入れやすいスプーンです。管理釣り場のクリアな水質や、魚が追い切らない時間帯のローテーションに向いています。',
      '027 マッディメタグリグローは、視認性と明滅のバランスを取りやすいカラーです。スローリトリーブを基準に、反応が弱い時はフォールを混ぜて魚の目線に合わせられます。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.5g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: '推奨ライン', value: 'ナイロン 2〜4lb' },
      { label: 'フック', value: 'シングルバーブレス' },
    ],
    image:
      '/skym-shop-assets/images/products/c7c55330eb58143c249ffd4119a08195.jpg',
    images: [
      '/skym-shop-assets/images/products/c7c55330eb58143c249ffd4119a08195.jpg',
      '/skym-shop-assets/images/products/b6425b9beb2be5ee9113f1f8b0ff0f5d.jpg',
    ],
  },
  {
    id: 12,
    name: 'オリジナル フックセット',
    productBrandId: 9,
    productCategoryId: 4,
    regularPrice: 1100,
    salePrice: 880,
    stockQuantity: 7,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '日々の交換用にストックしやすいフックセット。針先の管理をしやすい消耗品パック。',
    description: [
      'SKYMオリジナルのフックセットは、針先の甘さを感じた時にすぐ交換できるよう、使用頻度の高いサイズをまとめた消耗品パックです。大会前や釣行前の補充にも向いています。',
      'フックはルアー本来の動きと掛かりに直結するパーツです。魚に触れる回数が多い日ほど、こまめなチェックと交換でチャンスを逃しにくくなります。',
    ].join('\n\n'),
    specs: [
      { label: 'タイプ', value: '交換フック' },
      { label: '内容', value: '複数サイズセット' },
      { label: '用途', value: 'スプーン / 小型プラグ' },
    ],
    image:
      '/skym-shop-assets/images/products/04ac9a0e6908849f3cf8a5d496c1f898.jpg',
    images: [
      '/skym-shop-assets/images/products/04ac9a0e6908849f3cf8a5d496c1f898.jpg',
      '/skym-shop-assets/images/products/46592f4f09cc5d786f4f5939510113e8.jpg',
    ],
  },
  {
    id: 11,
    name: 'ASTRAR 2.4g（P.P.O）',
    productBrandId: 2,
    productCategoryId: 1,
    regularPrice: 500,
    stockQuantity: 14,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '強めの波動で広く探れる2.4gスプーン。放流後や魚の位置を早く見つけたい場面に。',
    description: [
      'ASTRAR 2.4gは、しっかり水を押しながらテンポよくサーチできるスプーンです。魚のレンジが絞り切れていない時間帯でも、巻き速度を変えながら反応を確認しやすいモデルです。',
      'P.P.Oは視認性と明滅を両立しやすいカラーです。放流直後の強い反応から、少し落ち着いたタイミングのフォローまで幅広く使えます。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.4g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: 'カラー', value: 'P.P.O' },
      { label: '用途', value: 'サーチ / 放流後' },
    ],
    image: '/skym-shop-assets/images/products/valkein-astrar-2-4g-front.jpg',
    images: [
      '/skym-shop-assets/images/products/valkein-astrar-2-4g-front.jpg',
      '/skym-shop-assets/images/products/valkein-astrar-2-4g-back.jpg',
    ],
  },
  {
    id: 10,
    name: 'Servant Spear 1.1g（074 ゴールデンブラウン）',
    productBrandId: 2,
    productCategoryId: 1,
    regularPrice: 400,
    stockQuantity: 4,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '軽量1.1gでスローに誘えるスプーン。食い渋りのタイミングでも丁寧に通しやすい一枚。',
    description: [
      'Servant Spear 1.1gは、軽量スプーンらしい繊細な誘いを入れやすく、表層から中層をゆっくり引きたい時に使いやすいモデルです。',
      '074 ゴールデンブラウンは派手すぎない明滅で、クリアな水質やプレッシャーの高い状況にも合わせやすいカラーです。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '1.1g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: 'カラー', value: '074 ゴールデンブラウン' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    image:
      '/skym-shop-assets/images/products/valkein-servant-spear-1-1g-front.jpg',
    images: [
      '/skym-shop-assets/images/products/valkein-servant-spear-1-1g-front.jpg',
      '/skym-shop-assets/images/products/valkein-servant-spear-1-1g-back.jpg',
    ],
  },
  {
    id: 9,
    name: 'Black Blast 1.8g（ズブロッカグリーン）',
    productBrandId: 2,
    productCategoryId: 1,
    regularPrice: 400,
    stockQuantity: 6,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '1.8gの扱いやすいサーチ系スプーン。カラーの強さで魚の反応を探りたい時に。',
    description: [
      'Black Blast 1.8gは、放流後から通常ローテーションまで使いやすいウエイト感のスプーンです。テンポよく巻いて魚の反応を見たい場面に向いています。',
      'ズブロッカグリーンは視認性のあるグリーン系カラーです。濁りやローライト時にも存在感を出しやすく、サーチの起点に使えます。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '1.8g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: 'カラー', value: 'ズブロッカグリーン' },
      { label: '用途', value: 'サーチ / ローテーション' },
    ],
    image:
      '/skym-shop-assets/images/products/valkein-black-blast-1-8g-front.jpg',
    images: [
      '/skym-shop-assets/images/products/valkein-black-blast-1-8g-front.jpg',
      '/skym-shop-assets/images/products/valkein-black-blast-1-8g-back.jpg',
    ],
  },
  {
    id: 8,
    name: 'JEKYLL-L 0.6g（安塚リクエスト）',
    productBrandId: 3,
    productCategoryId: 1,
    regularPrice: 400,
    stockQuantity: 21,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      'マイクロスプーンで丁寧に食わせる0.6g。スロー展開や表層攻略に入れやすい一枚。',
    description: [
      'JEKYLL-L 0.6gは、軽量スプーンならではの弱い波動で、プレッシャーの高い魚に口を使わせたい時に向いています。',
      '安塚リクエストは落ち着いたトーンで、派手なカラーへの反応が落ちた後のフォローにも使いやすいカラーです。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '0.6g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: 'カラー', value: '安塚リクエスト' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    image: '/skym-shop-assets/images/products/rodio-jekyll-l-0-6g-front.jpg',
    images: [
      '/skym-shop-assets/images/products/rodio-jekyll-l-0-6g-front.jpg',
      '/skym-shop-assets/images/products/rodio-jekyll-l-0-6g-back.jpg',
    ],
  },
  {
    id: 7,
    name: 'NOA-B 2.2g（2014ノブカラー）',
    productBrandId: 3,
    productCategoryId: 1,
    regularPrice: 500,
    stockQuantity: 11,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      'しっかり投げて広範囲を探れる2.2g。放流後や深めのレンジ確認にも使いやすいモデル。',
    description: [
      'NOA-B 2.2gは、飛距離を出しながらレンジを刻みやすいスプーンです。魚の位置が遠い時や、風のある状況でもテンポよく探れます。',
      '2014ノブカラーはアピールと食わせのバランスを取りやすく、反応の強弱を見ながらローテーションに組み込みやすいカラーです。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.2g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: 'カラー', value: '2014ノブカラー' },
      { label: '用途', value: 'サーチ / 遠投' },
    ],
    image: '/skym-shop-assets/images/products/rodio-noa-b-2-2g-front.jpg',
    images: [
      '/skym-shop-assets/images/products/rodio-noa-b-2-2g-front.jpg',
      '/skym-shop-assets/images/products/rodio-noa-b-2-2g-back.jpg',
    ],
  },
  {
    id: 6,
    name: 'RCドリフトスピン37 2.0g（092 透過チャート/裏グロー）',
    productBrandId: 3,
    productCategoryId: 2,
    regularPrice: 500,
    stockQuantity: 3,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '透過チャートと裏グローで存在感を出せるドリフトスピン。スプーン後のフォローにも。',
    description: [
      'RCドリフトスピン37 2.0gは、スプーンと違う波動で魚に見せたい時に使いやすいアイテムです。一定層を丁寧に通しながら反応を探れます。',
      '092 透過チャート/裏グローは、ローライトや濁りのある状況でも魚に気づかせやすいカラーです。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.0g' },
      { label: 'タイプ', value: 'プラグ' },
      { label: 'カラー', value: '092 透過チャート/裏グロー' },
      { label: '用途', value: 'サーチ / フォロー' },
    ],
    image:
      '/skym-shop-assets/images/products/rodio-drift-spin-37-chart-front.jpg',
    images: [
      '/skym-shop-assets/images/products/rodio-drift-spin-37-chart-front.jpg',
      '/skym-shop-assets/images/products/rodio-drift-spin-37-chart-back.jpg',
    ],
  },
  {
    id: 5,
    name: 'T-Fresh EVO 1.1g（スプリットオレンジ）',
    productBrandId: 5,
    productCategoryId: 1,
    regularPrice: 350,
    stockQuantity: 5,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '軽量1.1gで表層を丁寧に探れるスプーン。弱めの展開で魚に口を使わせたい時に。',
    description: [
      'T-Fresh EVO 1.1gは、軽い巻き感で表層から中層をスローに通しやすいスプーンです。魚が浮いている時や、強いアピールに反応しない場面に入れやすいモデルです。',
      'スプリットオレンジは視認性がありながら強すぎないカラーです。ローテーションの中盤から終盤に、魚の追い方を見ながら投入できます。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '1.1g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: 'カラー', value: 'スプリットオレンジ' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    image: '/skym-shop-assets/images/products/yarie-t-fresh-evo-1-1g-front.jpg',
    images: [
      '/skym-shop-assets/images/products/yarie-t-fresh-evo-1-1g-front.jpg',
      '/skym-shop-assets/images/products/yarie-t-fresh-evo-1-1g-back.jpg',
    ],
  },
  {
    id: 4,
    name: 'Shaath 2.3g（サイムダンゴールド）',
    productBrandId: 6,
    productCategoryId: 1,
    regularPrice: 400,
    stockQuantity: 18,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '2.3gでレンジを刻みやすいスプーン。オリカラらしい配色で反応を変えたい時に。',
    description: [
      'Shaath 2.3gは、巻きでレンジを合わせながら広く探れるスプーンです。放流後の強い反応が落ち着いた後にも、カラー変化で魚の目線を変えられます。',
      'サイムダンゴールドは、ゴールド系の明滅を活かして魚に気づかせやすいカラーです。水質や光量を見ながら、食わせ寄りの色と使い分けできます。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.3g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: 'カラー', value: 'サイムダンゴールド' },
      { label: '用途', value: 'サーチ / ローテーション' },
    ],
    image: '/skym-shop-assets/images/products/sauribu-shaath-2-3g-front.jpg',
    images: [
      '/skym-shop-assets/images/products/sauribu-shaath-2-3g-front.jpg',
      '/skym-shop-assets/images/products/sauribu-shaath-2-3g-alt.jpg',
    ],
  },
  {
    id: 3,
    name: 'TAPDANCER 3.7g（ダイゴチアシード）',
    productBrandId: 7,
    productCategoryId: 2,
    regularPrice: 900,
    stockQuantity: 9,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      'ボトム攻略に使いやすいタップダンサー。スプーンで反応が出にくい魚への切り替えに。',
    description: [
      'TAPDANCER 3.7gは、ボトム付近の魚に見せやすいプラグです。スプーンの巻きで反応が薄い時に、誘い方を変えるための選択肢になります。',
      'ダイゴチアシードは視認性のあるカラーで、ボトムでの位置確認もしやすい配色です。小さなアクションを入れながら反応を見てください。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '3.7g' },
      { label: 'タイプ', value: 'プラグ' },
      { label: 'カラー', value: 'ダイゴチアシード' },
      { label: 'レンジ', value: 'ボトム' },
    ],
    image:
      '/skym-shop-assets/images/products/jackall-tapdancer-daigo-front.jpg',
    images: [
      '/skym-shop-assets/images/products/jackall-tapdancer-daigo-front.jpg',
      '/skym-shop-assets/images/products/jackall-tapdancer-daigo-back.jpg',
    ],
  },
  {
    id: 2,
    name: 'TAPDANCER 3.7g（ショボクレほうじ茶ラテ）',
    productBrandId: 7,
    productCategoryId: 2,
    regularPrice: 900,
    stockQuantity: 7,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '落ち着いた色味でボトムを丁寧に探れるプラグ。食わせ寄りの展開に合わせやすいカラー。',
    description: [
      'TAPDANCER 3.7gは、ボトムでの細かな誘いを入れやすいプラグです。巻きの釣りから反応を変えたい時に、ルアーの存在感を抑えて見せられます。',
      'ショボクレほうじ茶ラテは派手すぎないトーンで、プレッシャーの高い魚にも合わせやすいカラーです。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '3.7g' },
      { label: 'タイプ', value: 'プラグ' },
      { label: 'カラー', value: 'ショボクレほうじ茶ラテ' },
      { label: 'レンジ', value: 'ボトム' },
    ],
    image:
      '/skym-shop-assets/images/products/jackall-tapdancer-hojicha-front.jpg',
    images: [
      '/skym-shop-assets/images/products/jackall-tapdancer-hojicha-front.jpg',
      '/skym-shop-assets/images/products/jackall-tapdancer-hojicha-back.jpg',
    ],
  },
  {
    id: 1,
    name: 'ピコ・チャタクラMD-SS 2.4g（ターンオーバーゴールド）',
    productBrandId: 8,
    productCategoryId: 2,
    regularPrice: 1100,
    stockQuantity: 14,
    newBadgeMode: 'auto',
    isPublished: true,
    sku: '',
    janCode: '',
    catchPhrase:
      '中層を丁寧に探れるクランク系プラグ。スローに見せたい場面のローテーションに。',
    description: [
      'ピコ・チャタクラMD-SS 2.4gは、スローに巻きながらレンジを合わせやすいプラグです。魚の追いが弱い時や、一定層に反応が集中する場面で使いやすいモデルです。',
      'ターンオーバーゴールドは明滅で気づかせながら、強すぎない見せ方をしやすいカラーです。スプーンからプラグへ展開する時のつなぎにも向いています。',
    ].join('\n\n'),
    specs: [
      { label: 'ウエイト', value: '2.4g' },
      { label: 'タイプ', value: 'プラグ' },
      { label: 'カラー', value: 'ターンオーバーゴールド' },
      { label: 'レンジ', value: '中層' },
    ],
    image:
      '/skym-shop-assets/images/products/daysprout-pico-chatakura-md-ss-front.jpg',
    images: [
      '/skym-shop-assets/images/products/daysprout-pico-chatakura-md-ss-front.jpg',
      '/skym-shop-assets/images/products/daysprout-pico-chatakura-md-ss-back.jpg',
    ],
  },
]

const productBrandItemById = new Map(
  productBrandItems.map((brand) => [brand.id, brand]),
)
const productCategoryItemById = new Map(
  productCategoryItems.map((category) => [category.id, category]),
)
const productCategoryMasterById = new Map(
  productCategoryMasters.map((category) => [category.id, category]),
)
const productSpecCollator = new Intl.Collator('ja-JP', { numeric: true })

export function formatProductPriceValue(value: number) {
  return `¥${value.toLocaleString('ja-JP')}`
}

export function getProductBrandItemById(brandId?: ProductBrandId | null) {
  return brandId ? productBrandItemById.get(brandId) : undefined
}

export function getProductCategoryItemById(
  categoryId?: ProductCategoryId | null,
) {
  return categoryId ? productCategoryItemById.get(categoryId) : undefined
}

export function getProductCategoryMasterById(
  categoryId?: ProductCategoryId | null,
) {
  return categoryId ? productCategoryMasterById.get(categoryId) : undefined
}

export function getProductBrand(product: Product) {
  return getProductBrandItemById(product.productBrandId)?.label ?? ''
}

export function getProductCategory(product: Product) {
  return getProductCategoryItemById(product.productCategoryId)?.label ?? ''
}

export function getProductBrandId(brand?: ProductBrand | '') {
  return productBrandItems.find((item) => item.label === brand)?.id ?? null
}

export function getProductCategoryId(category?: ProductCategory | '') {
  return (
    productCategoryItems.find((item) => item.label === category)?.id ?? null
  )
}

export function getProductPriceNumber(product: Product) {
  return product.salePrice ?? product.regularPrice
}

export function getProductPrice(product: Product) {
  return formatProductPriceValue(getProductPriceNumber(product))
}

export function getProductRegularPrice(product: Product) {
  return formatProductPriceValue(product.regularPrice)
}

export function getProductDiscountRate(product: Product) {
  if (typeof product.salePrice !== 'number') {
    return undefined
  }

  return `${Math.round(
    ((product.regularPrice - product.salePrice) / product.regularPrice) * 100,
  )}%`
}

export function getProductDescriptionParagraphs(product: Product) {
  return product.description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function isProductPublished(product: Product) {
  return product.isPublished
}

export const storefrontProducts = products.filter(isProductPublished)

export function getProductCategorySpecs(category?: ProductCategory | '') {
  if (!category) {
    return []
  }

  return (getProductCategoryItem(category)?.specs ??
    []) as readonly ProductCategorySpec[]
}

export function getProductCategorySpec(
  category: ProductCategory,
  specKey: string,
) {
  return getProductCategorySpecs(category).find((spec) => spec.key === specKey)
}

export function getFilterableProductCategorySpecs(category?: ProductCategory) {
  return getProductCategorySpecs(category).filter((spec) => spec.filterable)
}

export function getProductSpecValue(
  product: Product,
  specDefinition: ProductCategorySpec,
) {
  const specLabels = new Set([
    specDefinition.label,
    ...(specDefinition.aliases ?? []),
  ])

  return (
    product.specs.find(
      (spec) => spec.key === specDefinition.key || specLabels.has(spec.label),
    )?.value ?? ''
  )
}

export function getProductCategorySpecRows(product: Product) {
  return getProductCategorySpecs(getProductCategory(product)).flatMap(
    (specDefinition) => {
      const value = getProductSpecValue(product, specDefinition)

      return value ? [{ ...specDefinition, value }] : []
    },
  )
}

export function getProductSpecFilterOptions(
  category: ProductCategory,
  specDefinition: ProductCategorySpec,
) {
  const values = new Set<string>()

  for (const product of storefrontProducts) {
    if (getProductCategory(product) !== category) {
      continue
    }

    const value = getProductSpecValue(product, specDefinition)

    if (value) {
      values.add(value)
    }
  }

  return [...values].sort(productSpecCollator.compare)
}

export function getProductSpecRows(product: Product) {
  const categorySpecRows = getProductCategorySpecRows(product)
  const category = getProductCategory(product)
  const brand = getProductBrand(product)

  return [
    ...(category ? [{ label: 'カテゴリ', value: category }] : []),
    ...(brand ? [{ label: 'ブランド', value: brand }] : []),
    ...categorySpecRows,
  ]
}

export function getProductCategoryMaster(
  category: ProductCategory,
): ProductCategoryMaster | undefined {
  return productCategoryMasters.find((item) => item.label === category)
}

export function getProductCategorySpecDefinitions(
  category?: ProductCategory | '',
): readonly ProductCategorySpecDefinition[] {
  if (!category) {
    return []
  }

  return getProductCategoryMaster(category)?.specs ?? []
}

export function getProductCategoryBrands(
  category?: ProductCategory,
): readonly ProductBrand[] {
  if (!category) {
    return []
  }

  return getProductCategoryMaster(category)?.brands ?? []
}

export function getProductSpecDefinitionValue(
  product: Product,
  specDefinition: ProductCategorySpecDefinition,
) {
  const specLabels = new Set([
    specDefinition.label,
    ...(specDefinition.aliases ?? []),
  ])

  return (
    product.specs.find(
      (spec) => spec.key === specDefinition.slug || specLabels.has(spec.label),
    )?.value ?? ''
  )
}

export function getProductCategoryItem(category: ProductCategory) {
  return productCategoryItems.find((item) => item.label === category)
}

export function getProductCategoryItemBySlug(slug: string) {
  return productCategoryItems.find((item) => item.slug === slug)
}

export function getProductCategoryPath(category?: ProductCategory) {
  const categoryItem = category ? getProductCategoryItem(category) : undefined

  return categoryItem ? `/items/${categoryItem.slug}` : '/items'
}

export function getProductPath(product: Product) {
  return `/item/${product.id}`
}
