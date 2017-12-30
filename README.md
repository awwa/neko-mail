# ネコメール

## 概要
このプロジェクトはScratchX上で動作するネコメールクライアントです。メールの送受信ができます。以下のプログラムを含んでいます。

1. ScratchX上で動作するメールクライアント
2. ScratchXに読み込ませるエクステンションファイル
3. SendGridと連携してメールを送受信するサーバプログラム

## 必要なもの
- SendGridアカウント
- 独自ドメインとそのドメインのDNSの管理権限
- ScratchXにアクセスできる環境
- Node.js
- Git
- ngrok(ローカルPC上でサーバプログラムを実行する場合)

## 環境構築手順
サーバプログラムをローカルPC上で実行して環境構築する手順を示します。

1. プロジェクトファイル一式のダウンロード(git clone)

  プロジェクトのファイル一式をローカルPCの任意の場所に保存（クローン）します。

  ```
  $ git clone https://github.com/awwa/neko-mail
  ```

2. サーバプログラムの設定
  - クローンしたプロジェクトフォルダに移動して、.env.exampleを.envというファイル名でコピーします
  - .envファイルを編集して各変数の設定を行います

  ```
  $ cd neko-mail
  $ cp .env.example .env
  $ vi .env
  SENDGRID_API_KEY="SendGridのAPIキー（Mail Sendパーミッションが必要）"
  FROM="送信元メールアドレス(例：hoge@example.com)"
  ```

3. Node.jsサーバアプリケーションの起動

  - サーバアプリケーションを起動します

  ```
  $ npm install
  $ npm start
  ```

  - ブラウザで`http://localhost:3000/`にアクセスして`Cannot GET /`のメッセージが表示されることを確認します

4. ngrokの起動

  ローカルPCでサーバプログラムを実行する場合、Parse WebhookのPOSTをローカルPC上のサーバプログラムにトンネリングするためにngrokを実行します。この際、トンネリング対象のポート番号はサーバアプリケーションの待ち受けポート番号（この例の場合`3000`）になります。ngrokの概要やセットアップについては[公式サイト](https://ngrok.com/)を参照してください。

  ```
  $ ngrok http 3000
  ngrok by @inconshreveable                                                                                                                                                                                                     (Ctrl+C to quit)

  Session Status                online
  Account                       Wataru Sato (Plan: Free)
  Version                       2.2.8
  Region                        United States (us)
  Web Interface                 http://127.0.0.1:4040
  Forwarding                    http://88dbbd6f.ngrok.io -> localhost:3000
  Forwarding                    https://88dbbd6f.ngrok.io -> localhost:3000

  Connections                   ttl     opn     rt1     rt5     p50     p90
                                0       0       0.00    0.00    0.00    0.00
  ```

5. SendGridの設定
  - SendGridで受信したメールの内容をサーバプログラムに通知するために[Parse Webhookの設定](https://sendgrid.kke.co.jp/docs/Tutorials/E_Receive_Mail/receive_mail.html)を行います
    - Receiving Domain
      - 上述の`FROM`変数に設定したメールアドレスのドメイン（例：example.com）
    - Destination URL
      - [ngrokの待ち受けURL]/inbound（例：`http://88dbbd6f.ngrok.io/inbound`）

6. ScratchXプロジェクトファイル(ネコメール.sbx)の読み込み
  - ブラウザで[ScratchX](http://scratchx.org/#scratch)にアクセスします
  - メニューの[File > Load Project]を選択して、プロジェクトフォルダ配下の`client/ネコメール.sbx`を選択して読み込みます
  - [Replace contents of the current project?]と聞かれるので[OK]を選択します
  - [The extensions on this site are experimental]と聞かれたら[I understand, continue]を選択します

7. エクステンションファイルの読み込み
  - ScratchXの画面上で[Scripts > More Blocks]を選択します
  - [Load experimental extension]ボタンを選択します
  - [Open an Extension URL]に[`http://localhost:3000/extension.js`]と入力して[Open]ボタンを選択してExtensionファイルを読み込みます
  - [The extensions on this site are experimental]と聞かれたら[I understand, continue]を選択します

以上で準備完了です。  

## 操作方法
1. ScratchXの画面で旗ボタンをクリックします。ネコが歩いてきてベッドの上でごろごろし始めたら準備完了です。
2. 適当なメールクライアントからParse Webhookで設定したドメイン宛（例：`hoge@example.com`, ローカルパートは任意）にメールを送信します
3. しばらくするとScratchXに受信したメールの内容が通知されます
4. 受信したメールに返信すると、メールの送信元に返信メールが送信されます

## 動画
[![動作](https://github.com/awwa/neko-mail/raw/master/docs/screenshot.png)](https://youtu.be/5txkX6YfxPk)

## 足りないもの
最低限の実装のみ行っているのでいろいろ足りません。
- メールの新規作成機能
- 受信メールの保存、閲覧、管理機能
- UTF-8以外のエンコード方式への対応
