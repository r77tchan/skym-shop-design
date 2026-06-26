## URL

```txt
/
/items
/items/<category_slug>
/item/<product_id>
/news
/news/<news_id>
/contact
/law
/privacy
/checkout/success?session_id={CHECKOUT_SESSION_ID}
/checkout/cancel
```

未定義のURLはショップ側の404を表示する。

## URLクエリ

`/items` では以下のクエリを使用できる。組み合わせも可能。

```txt
?page=
?keyword=
?brand=
?sale=
```

`/items/<category_slug>` では以下のクエリを使用できる。組み合わせも可能。

```txt
?page=
?keyword=
?brand=
?sale=
?<spec_slug>=
```

`<spec_slug>` は、対象カテゴリで商品一覧フィルタ対象になっているカテゴリスペックのみ有効にする。
