# Mini Shooter

Phaser と Vite で作った最小構成の 2D ブラウザシューティングゲームです。

## セットアップ

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

`dist/` が生成されるので、そのまま Cloudflare Pages の配信対象にできます。

## Cloudflare Pages で公開

1. GitHub にこのリポジトリを push
2. Cloudflare Pages で `mygame` リポジトリを接続
3. Build command を `npm run build`
4. Build output directory を `dist`
5. Node.js のバージョンは Cloudflare のデフォルトで問題ありません

## 操作

- 敵画像の差し替え: 画面左の URL 入力欄または画像ファイル選択
- 開始前の敵選択: 左右キー
- ゲーム開始: Enter
- 移動: 矢印キー
- 攻撃: スペースキー
- リスタート: Enter

## 敵画像を任意画像にする方法

1. いちばん簡単なのは、画面左の `Local Image File` で画像を選んで `Save File`
2. または、公開URLを `Enemy Image URL` に貼って `Save URL`
3. 再読み込み後、開始前の敵選択に `CUSTOM` が追加されます

ローカル画像ファイル保存ならアップロード先は不要です。URL利用時は CORS 制限のない公開画像URLを使ってください。
