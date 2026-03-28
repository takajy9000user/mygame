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

- 移動: 矢印キー
- 攻撃: スペースキー
- リスタート: Enter
