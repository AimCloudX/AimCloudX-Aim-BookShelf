# TODO
* UIの表示内容を平野さんのコードから移植
* ISBNなどの情報を保存する
* 不要なクラスの削除
* マージ

# モデル設計
## book
id: uuid
title: string
thumbnail: string
authors: string[]
content: string
isbn10: string
isbn13: string

## instance
id: uuid // 本のId
購入者: string
購入月: Date
location: string

## 感想
id : uuid // 本のId
読んだ人: string
感想: string

# 本の管理
## SearchBook
キーワードを利用してGoogleBooksAPIから書籍情報を取得して表示
→感想や購入報告があれば、本をDBに追加する(もちろんinstanceや読んだ人の情報も追加)

## MyBooks
本DBにある本を表示する。
購入者や読んだ人でフィルターが可能

## まとめて報告
エクセルをinputとして、購入報告を一気に行う

## ユーザーアクション
### 感想追加
本を選択して、感想入力(感想自体は任意)

### 購入報告
instanceの必要事項の入力必要