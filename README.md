# shuffle-lunch

事前に予約したメンバーがランダムにシャッフルされて、二人でランチを食べられるシステム。

## Description

## Usage
(GAS側)
1. Googleフォームの回答結果を表示するスプレッドシートに、answersシート（フォームの回答を入れる）とmembersシート（フォームの登録名とSlackのIDとの対応表）を作成する。
2. １のスプレッドシートのスクリプトにshufflelunch.gsを設定。
3. GASのトリガーを設定。

(Slack側)
1. Slack Appを作成。権限を適切に設定し、トークンをGASの環境変数に登録。

## Development
SlackのAPIを上手く使うことでUXを全てSlack上で完結させることも可能。

- Event APIのReaction addedで参加表明を受け付ける。
など

マッチングシステムも検討の余地あり。
- 性別などを考慮する。
など



