# Daily Lucky

占いAPIから「ラッキー色」「ラッキーアイテム」を取得し、購入用リンクを表示し、毎朝自動通知するアプリです。

## まず使ってもらう（継続の前提）

1. 共有用URL（`GET /api/public-url` または本番ドメイン）をSNS・友だちに渡す
2. 毎日開きたくなる導線: 通知（ntfy）+ 1タップで今日の内容
3. 収益は**ユーザー数のあと**で十分。先に「価値（毎日開く理由）」を固める

## 購入リンクはアフィリエイトか

- **デフォルトはアフィリエイト未設定**です。  
  いま入っているのは `item.rakuten.co.jp` の**商品直リンク**（審査不要の通常遷移）です。
- 手数料を得るには、**楽天アフィリエイト等の審査通過後**、管理画面で支給されたパラメータや中継URLを `.env` に設定します。

| 変数 | 内容 |
|------|------|
| `RAKUTEN_AFF_QUERY` | 商品URL末尾に付けるクエリ（例: `scid=af_...`） |
| `RAKUTEN_AFF_WRAPPER_BASE` | 元URLをエンコードして付与する中継URLの先頭部分 |
| `AMAZON_ASSOCIATE_TAG` | 将来 Amazon リンク利用時用（任意） |

- 各プログラムの利用規約・正しいリンクの作り方は、**必ず公式の発行画面に従ってください**（このリポジトリは「差し込み口」だけ提供します）。

### 再検討のおすすめ順

1. 無料で価値を出す（占い+通知+お気に入り）
2. 導線を測る（クリック/表示の `data/metrics.json`）
3. 審査に出す（楽天 / Amazon / A8 等、媒体に合わせる）
4. `.env` にだけ反映（コード変更不要で切替可）

## 完成機能

- 今日の12星座占い取得（星座フィルタあり）
- ラッキー色・ラッキーアイテムの表示
- Amazon検索リンク自動生成
- `ntfy` への毎朝通知（cron）
- 手動通知テストAPI
- ヘルスチェックAPI
- 外部占いAPI障害時のフォールバック（サービス継続）
- ユニットテスト（Node標準テスト）
- 本番運用ファイル（PM2 / Docker Compose）

## あなたがやること（詳細手順）

### 1) 初回セットアップ

1. ターミナルでプロジェクトへ移動
   ```powershell
   cd C:\Users\cz7\daily-lucky
   ```
2. 依存関係をインストール
   ```powershell
   npm install
   ```
3. `.env` を作成
   ```powershell
   copy .env.example .env
   ```
4. `.env` を編集（最低限 `NTFY_TOPIC` を設定）
   ```env
   PORT=3000
   NOTIFY_CRON=0 7 * * *
   NOTIFY_TIMEZONE=Asia/Tokyo
   NTFY_TOPIC=cz7-lucky
   DEFAULT_SIGN=
   ```

### 2) スマホ通知の受信設定（5分）

1. スマホに `ntfy` アプリをインストール
2. アプリでトピック `cz7-lucky`（`.env` と同じ）を購読
3. 受信許可（通知ON）を有効化

### 3) 動作確認（必須）

1. 開発起動
   ```powershell
   npm run dev
   ```
2. ブラウザで `http://localhost:3000` を開く
3. 「今すぐ通知テスト」を押す
4. スマホに通知が届くことを確認
5. API健全性を確認
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET
   ```

### 4) テスト実行（必須）

```powershell
npm test
```

### 5) 本番運用を選ぶ（どちらか）

#### A. PM2運用（Windowsで簡単）

1. PM2をインストール
   ```powershell
   npm i -g pm2
   ```
2. アプリ起動
   ```powershell
   npm run start:pm2
   ```
3. ログ確認
   ```powershell
   pm2 logs daily-lucky
   ```
4. 停止（必要時）
   ```powershell
   npm run stop:pm2
   ```

### 公開URL運用（このPCを公開サーバー化）

`.env` で以下を設定:

```env
ENABLE_PUBLIC_TUNNEL=true
PUBLIC_SUBDOMAIN=
PUBLIC_TUNNEL_PORT=3000
```

PM2を再起動:

```powershell
pm2 restart daily-lucky --update-env
```

公開URL確認:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/public-url" -Method GET
```

`ready: true` と `url` が返れば公開中です。

#### B. Docker運用（再現性重視）

1. Docker Desktopを起動
2. コンテナ起動
   ```powershell
   docker compose up -d --build
   ```
3. ログ確認
   ```powershell
   docker compose logs -f
   ```
4. 停止
   ```powershell
   docker compose down
   ```

### 6) Windowsログオン時に自動起動したい場合

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows-task.ps1
```

登録確認:

```powershell
Get-ScheduledTask -TaskName "DailyLuckyApp"
```

## API

- `GET /api/today` : 全星座
- `GET /api/today?sign=牡羊座` : 星座指定
- `GET /api/signs` : 星座一覧
- `POST /api/notify-now` : 手動通知テスト
- `GET /api/health` : 生存監視
- `GET /api/notify-target` : 通知先の確認（topic / endpoint）
- `GET /api/public-url` : 現在の公開URL確認
- `POST /api/click` : 商品リンククリック計測
- `GET /api/metrics` : クリック集計確認

## 占い情報元

- 第1ソース: JugemKey Horoscope API
- 第2ソース: アプリ内の補助スコアモデル（毎日の変動を計算）
- 上記2つを統合して最終ランクを生成

## ntfy の安全性と匿名化

- `ntfy` は通知配信サービスで、トピック名を知っている人は通知を読める設計です
- 個人名を含むトピックは避け、推測されにくいランダム文字列を推奨
  - 例: `lucky-8f3k2q9m`
- このアプリUIではトピックをマスク表示します

## セキュリティ強化（実装済み）

- `helmet` でHTTPヘッダ保護
- `express-rate-limit` でAPIレート制限
- `x-powered-by` 無効化
- `.env` は git 管理外

## 無料で長期運用する方法

1. PM2で常駐（実施済み）
2. `ENABLE_PUBLIC_TUNNEL=true` + `PUBLIC_TUNNEL_PROVIDER=cloudflared`
3. `GET /api/public-url` で現行公開URLを確認
4. タスクスケジューラでPCログオン時自動起動（管理者権限で1回）

## 購入されやすくする自動運用

- 商品ページクリックを自動計測（`data/metrics.json`）
- 商品表示（impression）も自動計測
- どの商品が押されているかを `GET /api/metrics` で確認
- 毎朝 00:10 にクリック実績ベースで商品候補を自動最適化
- 最適化は CTR（クリック率）をベイズ平滑化して判定
- `/api/today` は最適化済み候補を優先して表示

## 運用メモ

- 占いAPIが落ちてもフォールバックで通知継続
- 初期リリースは `NTFY_TOPIC` 設定だけで十分
- 本番ではPM2かDockerを必ず利用

## 通知先が分からない場合

1. `http://localhost:3000` を開く
2. 画面上部の「通知先トピック / 送信先URL」を確認
3. 同じトピックを `ntfy` アプリで購読
4. 「今すぐ通知テスト」を押して受信確認

## リリース最終チェック

1. `npm test`
2. `GET /api/health` が `ok: true`
3. `GET /api/notify-target` で `configured: true`
4. `POST /api/notify-now` が `ok: true`
5. PM2が `online` (`pm2 status`)
