export const companyName = '株式会社SKYM'
export const companyUrl = 'https://skym.co.jp/'

export const shopDescription = `${companyName} が運営するフィッシングタックル オンラインストア。トラウトを中心に、フィールドを愛するアングラーへ確かな道具をお届けします。`

export const newsItems = [
  {
    slug: 'valkein-spoon-restock',
    date: '2026.06.01',
    label: '入荷',
    title: 'ValkeINスプーン 入荷しました',
    content: [
      '人気のValkeINスプーンが各カラー再入荷しました。シーズンを問わず使いやすい定番色を中心に、フィールドでの反応を見ながらローテーションしやすいラインナップを揃えています。',
      '在庫数には限りがあります。気になるカラーがある場合は、商品一覧より在庫状況をご確認ください。',
    ],
  },
  {
    slug: 'rodio-craft-drift-spin-arrival',
    date: '2026.05.28',
    label: '入荷',
    title: 'ロデオクラフト ドリフトスピン 入荷しました',
    content: [
      '高実績のドリフトスピンが入荷しました。スプーンで届かないレンジや、魚の追いが弱い場面のローテーションにおすすめです。',
      '入荷カラーは順次追加予定です。販売開始後は在庫が変動しやすいため、購入前に商品ページをご確認ください。',
    ],
  },
  {
    slug: 'summer-sale-2026',
    date: '2026.05.25',
    label: 'SALE',
    title: 'サマーセール開催中',
    content: [
      '対象のルアーを期間限定価格で販売しています。カラー補充やシーズン前の買い足しにご利用ください。',
      'セール対象商品は予告なく変更となる場合があります。完売後の再入荷や価格変更については、各商品ページでご案内します。',
    ],
  },
  {
    slug: 'shipping-schedule-notice',
    date: '2026.05.18',
    label: 'お知らせ',
    title: '発送スケジュールについて',
    content: [
      'ご注文状況により、発送まで通常よりお時間をいただく場合があります。発送完了後は追跡番号をメールでお送りします。',
      'お急ぎの場合は、購入前に発送予定日をご確認ください。配送方法や地域によって到着までの日数が異なります。',
    ],
  },
  {
    slug: 'original-color-release',
    date: '2026.05.10',
    label: 'NEW',
    title: 'オリジナルカラー販売開始',
    content: [
      'フィールドでの視認性と食わせを意識したオリジナルカラーを追加しました。晴天時、曇天時、濁りのある水質でも使い分けしやすいカラー展開です。',
      '数量限定のため、在庫がなくなり次第終了です。再販売の予定がある場合は、改めてお知らせします。',
    ],
  },
  {
    slug: 'skym-trout-cup-2026-entry',
    date: '2026.04.30',
    label: 'EVENT',
    title: 'SKYM トラウトカップ 2026 受付開始',
    content: [
      'トラウトアングラー向けイベントの受付を開始しました。参加方法、開催場所、当日のスケジュールは順次ご案内します。',
      '定員に達し次第、受付を終了する場合があります。参加をご希望の方は、最新のお知らせをご確認ください。',
    ],
  },
]

export type NewsItem = (typeof newsItems)[number]

export function getNewsItemPath(item: NewsItem) {
  return `/news/${item.slug}`
}

export const productCategories = [
  'すべて',
  'スプーン',
  'プラグ',
  'ロッド＆リール',
  'フック',
  'SALE',
] as const

export const productBrands = [
  'VELVET ARTS',
  'ValkeIN',
  'RODIO CRAFT',
  '1089工房',
  'SKYM',
] as const

export const products = [
  {
    id: 'velvet-arts-forte-masuou',
    name: '〖VELVET ARTS〗フォルテ 2.1g（二代目鱒王）',
    brand: 'VELVET ARTS',
    category: 'スプーン',
    price: 'SOLD OUT',
    status: 'SOLD OUT',
    summary:
      '強めの明滅で魚に気づかせやすい、放流直後からサーチまで使いやすい2.1gスプーン。',
    description: [
      'フォルテ 2.1gは、管理釣り場でのテンポのよいサーチに向いたスプーンです。水をつかみやすいボディで、巻き速度を落としても姿勢が崩れにくく、手前まで丁寧に探れます。',
      '二代目鱒王は視認性とアピール力のバランスが取りやすいカラーです。魚の反応を見ながら、強い色から食わせ寄りの色へ展開するローテーションの起点に使えます。',
    ],
    specs: [
      { label: 'ウエイト', value: '2.1g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    tags: ['定番', '2.1g'],
    image:
      '/skym-shop-assets/images/products/009a5cdcca1badfeec38fad4838bbb11.jpg',
  },
  {
    id: 'velvet-arts-forte-kick-on-the-festa',
    name: '〖VELVET ARTS〗フォルテ 2.1g（キックオンザフェスタ）',
    brand: 'VELVET ARTS',
    category: 'スプーン',
    price: 'SOLD OUT',
    status: 'SOLD OUT',
    summary:
      'イベント感のある強めカラー。魚の目線を集めたい朝夕や濁りのある状況に。',
    description: [
      'フォルテ 2.1gの安定した泳ぎを活かしながら、カラーでしっかり存在感を出せるモデルです。放流直後や魚が散っている時間帯に、広い範囲を手早く探る使い方に向いています。',
      'キックオンザフェスタは、明るい水色でも暗い水色でも見失いにくい配色です。反応が落ちたら、同じウエイトの落ち着いたカラーへつなげるとローテーションしやすくなります。',
    ],
    specs: [
      { label: 'ウエイト', value: '2.1g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    tags: ['限定色', '2.1g'],
    image:
      '/skym-shop-assets/images/products/0f3609149d944d478f4f2004dcf8842a.jpg',
  },
  {
    id: 'velvet-arts-forte-silver',
    name: '〖VELVET ARTS〗フォルテ 2.1g（シルバー）',
    brand: 'VELVET ARTS',
    category: 'スプーン',
    price: '¥500',
    status: 'NEW',
    summary:
      'クリアウォーターで使いやすいシルバー。自然なフラッシングでスレたトラウトにも合わせやすい一枚。',
    description: [
      'フォルテ 2.1gは、渓流の清流から管理釣り場のスレたトラウトまで幅広く使える軽量スプーンです。水流を受けた時の細かなウォブリングで、低活性時でも魚に気づかせやすい設計です。',
      'シルバーは派手すぎない明滅で、晴天時やクリアな水質と相性がよいカラーです。表層から中層を一定速度で引き、追い切らない時は少しレンジを下げて反応を見てください。',
    ],
    specs: [
      { label: 'ウエイト', value: '2.1g' },
      { label: 'タイプ', value: 'スプーン' },
      {
        label: '推奨ライン',
        value: 'ナイロン・フロロ 2〜4lb / エステル 0.3〜0.5号',
      },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    tags: ['新着', '2.1g'],
    image:
      '/skym-shop-assets/images/products/161b25ac6ba3c56743cad57b38ad7ee5.jpg',
  },
  {
    id: '1089-sakasa-nyoro-slim',
    name: '1089工房 さかさにょろ Slim 35FS',
    brand: '1089工房',
    category: 'プラグ',
    price: '¥1,980',
    status: 'LIMITED',
    summary:
      'ゆっくり巻いて誘えるニョロ系プラグ。スプーンで追い切らない魚への次の一手に。',
    description: [
      'さかさにょろ Slim 35FSは、低速域での揺らぎとレンジキープを活かして食わせに持ち込むニョロ系プラグです。プレッシャーの高い時間帯や、スプーンへの反応が弱い場面で投入しやすいモデルです。',
      '35mmのコンパクトなシルエットで、管理釣り場の小規模ポンドでも扱いやすいサイズ感です。一定速度のスローリトリーブを基準に、魚の反応を見ながらレンジを調整してください。',
    ],
    specs: [
      { label: 'サイズ', value: '35mm' },
      { label: 'タイプ', value: 'プラグ / FS' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    tags: ['ニョロ系', '35FS'],
    image:
      '/skym-shop-assets/images/products/02d6f2ac86e6516284eb5680692eabff.jpg',
  },
  {
    id: 'valkein-hi-burst-uv-flash',
    name: '〖ValkeIN〗HI BURST 1.6g(UVフラッシュ)',
    brand: 'ValkeIN',
    category: 'スプーン',
    price: '¥400',
    status: 'RESTOCK',
    summary:
      '定番HI BURSTの1.6g。UVフラッシュで魚に気づかせつつ、テンポよくレンジを刻めます。',
    description: [
      'HI BURST 1.6gは、軽快な巻き感と扱いやすいウエイトで、放流後から通常ローテーションまで幅広く使えるスプーンです。一定速度で巻きやすく、レンジの再現性を取りやすいところが魅力です。',
      'UVフラッシュは光量変化のある状況で使いやすいカラーです。曇天や日陰、濁りが入った水質でも魚に気づかせやすく、カラーの強弱を見たい時の基準になります。',
    ],
    specs: [
      { label: 'ウエイト', value: '1.6g' },
      { label: 'タイプ', value: 'スプーン' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '表層〜中層' },
    ],
    tags: ['再入荷', '1.6g'],
    image:
      '/skym-shop-assets/images/products/01ffb9bb455cb67ba79e0f8049e3c6e0.jpg',
  },
  {
    id: 'rodio-craft-drift-spin',
    name: '〖RODIO CRAFT〗ドリフトスピン',
    brand: 'RODIO CRAFT',
    category: 'プラグ',
    price: '¥500',
    status: 'NEW',
    summary:
      'スプーンで届かない魚に入れやすいサーチ系プラグ。レンジ変化をつけたい時に。',
    description: [
      'ドリフトスピンは、スプーンの巻きでは反応が薄い魚に対して、別軸の波動で探りを入れやすいアイテムです。魚の追いが弱い時や、一定層に魚が溜まっている時のローテーションに向いています。',
      '小刻みなレンジ調整とスローな誘いを組み合わせることで、スプーンからプラグへ自然に展開できます。新着カラーの補充として、手持ちのスプーンと合わせて選びやすい一つです。',
    ],
    specs: [
      { label: 'タイプ', value: 'プラグ' },
      { label: '用途', value: 'サーチ / フォロー' },
      { label: '推奨ライン', value: 'ナイロン・フロロ 2〜4lb' },
      { label: 'レンジ', value: '中層〜ボトム付近' },
    ],
    tags: ['新着', 'サーチ'],
    image:
      '/skym-shop-assets/images/products/033805811c6e8f5bae5e02633d66741f.jpg',
  },
  {
    id: 'skym-original-hook-set',
    name: 'SKYM オリジナル フックセット',
    brand: 'SKYM',
    category: 'フック',
    price: '¥880',
    status: 'SALE',
    summary:
      '日々の交換用にストックしやすいフックセット。針先の管理をしやすい消耗品パック。',
    description: [
      'SKYMオリジナルのフックセットは、針先の甘さを感じた時にすぐ交換できるよう、使用頻度の高いサイズをまとめた消耗品パックです。大会前や釣行前の補充にも向いています。',
      'フックはルアー本来の動きと掛かりに直結するパーツです。魚に触れる回数が多い日ほど、こまめなチェックと交換でチャンスを逃しにくくなります。',
    ],
    specs: [
      { label: 'タイプ', value: '交換フック' },
      { label: '内容', value: '複数サイズセット' },
      { label: '用途', value: 'スプーン / 小型プラグ' },
      { label: '状態', value: 'SALE対象' },
    ],
    tags: ['消耗品', 'セット'],
    image:
      '/skym-shop-assets/images/products/04ac9a0e6908849f3cf8a5d496c1f898.jpg',
  },
] as const

export type Product = (typeof products)[number]

export function getProductPath(product: Product) {
  return `/items/${product.id}`
}
