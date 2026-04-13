# TextKat

テキスト内の改行をつなげたうえで、**指定した文字数ごとに改行**して整形する Web アプリです。整形結果をワンクリックでコピーできます。

## 公開 URL

[Vercel](https://vercel.com/) でホスティングしています。

**[https://text-kat.vercel.app/](https://text-kat.vercel.app/)**

## できること

- **折り返し文字数**を指定（数値入力または ± で調整）
- 入力欄の改行は無視してから、指定文字数で区切って改行
- **整形結果のコピー**（コピー完了時はアイコンが一時的にチェック表示）
- **入力のクリア**

## 技術スタック

- [Next.js](https://nextjs.org/) 14（App Router）
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)

## 実装メモ

整形ロジックは `lib/formatText.ts` の `formatTextByLength` で実装しています。
JavaScript の文字列インデックスに基づく文字数で分割します。

## 必要環境

- [Node.js](https://nodejs.org/) 18 以上を推奨

## セットアップと実行

```bash
npm install
```

開発サーバー:

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

本番ビルドと起動:

```bash
npm run build
npm start
```

Lint:

```bash
npm run lint
```

## ディレクトリ構成（抜粋）

| パス | 内容 |
|------|------|
| `app/` | ルートレイアウト・ページ・グローバル CSS |
| `components/TextFormatter.tsx` | メイン UI |
| `lib/formatText.ts` | 文字数ベースの整形 |
| `public/images/` | ロゴ・アイコン画像 |

## ライセンス

All rights reserved.
