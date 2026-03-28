# さんすうシューティング

Phaser + Vite で作った、小学4年生〜5年生向けのブラウザ算数シューティングです。  
足し算・引き算・掛け算を、遊びながら反復できる MVP を実装しています。

## できること

- タイトル画面
- 算数問題つきのシューティング本編
- 3つの答え候補から選んで弾を撃つゲームループ
- 正解・不正解・時間切れのフィードバック
- ミスした問題タイプの再出題をしやすい設計
- 結果画面での正答数、ミス数、正答率、苦手カテゴリ表示
- 将来の `localStorage` 学習履歴保存やランキングAPI拡張を見据えた責務分離

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで表示されたローカルURLを開くと遊べます。

## ビルド

```bash
npm run build
```

`dist/` が生成され、Cloudflare Pages にそのまま配置できます。

## 操作

### PC

- 移動: `←` `→` または `A` `D`
- 答えを撃つ: `1` `2` `3`
- 選んだ答えで撃つ: `Space`

### スマートフォン / タブレット

- 移動: 画面下以外をドラッグ
- 答えを撃つ: 下の数字ボタンをタップ

## ディレクトリ構成

```text
src/
  assets/
  components/
  config/
  logic/
    game/
    questions/
  scenes/
  styles/
  ui/
```

## Cloudflare Pages で公開

Cloudflare Pages の設定は次で動きます。

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

## 注意点

- このプロジェクトはフロントエンドのみで完結します
- Node.js は Cloudflare Pages の標準環境で問題ありません
- 将来的にランキングAPIを追加する場合は Cloudflare Workers を別途追加しやすい構成です

## 今後の拡張候補

- 割り算や文章題の追加
- `localStorage` を使った苦手分野の継続保存
- SE / BGM の実装
- Cloudflare Workers によるランキング機能
