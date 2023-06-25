# connect-slack-workflow-to-gas
slackワークフローの申請内容をGASでSpread Sheet・Google Calendarに登録するスクリプト。
本番環境への作業申請記録を自動化したものです。

## 事前準備
1. Slackワークフローを作成する  
    1. フォームの作成
    2. メッセージの作成
        メッセージ送信は以下のように設定する必要があります。
        ``` 
        SlackToSpreadSheet
        ,,project::{@可変テキスト},,worker::{@フォーム申請者(Email Address)},,pmo::{@ユーザー(Email Address)},,member::{@ユーザー(Email Address)},,startDate::{@可変テキスト},,endDate::{@可変テキスト},,tasks::{@可変テキスト}
        ```

## 開発方法
以下は、claspを使用した開発方法の手順です。

### 1. claspのインストール

まずは、`npm`コマンドを使用して`clasp`をインストールします。

```
npm install -g @google/clasp
```

### 2. claspのログイン

`clasp`コマンドを使用するためには、Googleアカウントでログインする必要があります。

```
clasp login
```

上記のコマンドを実行すると、ブラウザが起動し、Googleアカウントの認証画面が表示されます。認証を完了すると、コマンドラインに戻ります。


### 3. コードのアップロード

編集したコードをGoogle Apps Scriptにアップロードします。

```
clasp push
```

上記のコマンドを実行すると、編集したコードがGoogle Apps Scriptにアップロードされます。

### 4. デプロイ

デプロイはGoggle App ScriptのGUIで実施してください。

1. 新しいデプロイ > 種類の選択: ウェブアプリ
2. 次のユーザーとして実行: 自分
3. アクセスできるユーザー: 全員
4. デプロイ

以上が、claspを使用したGoogle Apps Scriptの開発方法です。


## 参考
[SOMPO Digital Lab Developer Blog](https://tech.sompo.io/entry/2023/04/25/095916)  
[カルテットコミュニケーションズ開発部ブログ](https://tech.quartetcom.co.jp/2023/05/16/slack-to-mail/#slack-%E3%83%AF%E3%83%BC%E3%82%AF%E3%83%95%E3%83%AD%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90)
