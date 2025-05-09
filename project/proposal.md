# 專案名稱：Moojidle

## Table of Content

- [專案目標](#專案目標)
   - [願景](#願景-vision)
   - [目標](#目標-goal)
   - [需求](#需求-requirements)
- [專案預計分工](#專案預計分工)
- [專案技術選型](#專案技術選型)
- [團隊協定與標準](#團隊協定與標準)
   - [團隊協定](#團隊協定)
   - [團隊標準](#團隊標準)

## 專案目標

### 願景 Vision

增進學生與教師、助教的互動，打造便捷、人性化的學習環境。

### 目標 Goal

開發一套課程平台，整合基本的功能，和進階的行事曆、討論版等，以提升學習效率。

### 需求 Requirements

1. 課程資料管理
   - 教師可新增、編輯、刪除課程資訊
   - 學生可瀏覽已開課程、查詢詳細資訊
   - 上傳與下載課程教材（如PDF、影片、簡報）
   - 設定公告、各項事件
   - 課程分組與分類管理

2. 行事曆
   - 顯示所有課程相關事件
   - 支援每月、每週與每日檢視模式
   - 設定提醒通知（推播、Email）

3. 討論版
   - 課程專屬的多個討論版
   - 支援貼文 (post)、留言、回覆功能
   - 支援 Markdown、Latex 格式
   - 帖文可置頂與標註
   - 帳號權限控管

4. 使用者管理
   - 使用者註冊、登入、登出
   - 角色分級（學生、教師、管理員）
   - 編輯個人資料（例如大頭貼、聯絡方式）

5. 通知中心
   - 課程異動通知
   - 新留言/公告通知
   - 作業與活動提醒

6. 作業與評分
   - 發布作業、設定繳交期限
   - 學生上傳作業
   - 評分與回饋

## 專案預計分工

<details>
<summary>Sprint 1</summary>

- 課程資料管理: 3人
- 行事曆: 2人
- 討論版: 2人
- 使用者管理: 2人
</details>

## 專案技術選型

- 前端:React
- 後端:Express JS + MongoDB + MySQL

## 指標

- Goal

  建立一個便利的課程平台，協助學生更方便地管理課程學習，提升學習效率與互動性。

- Signal

  1. 學生更活躍參與討論、詢問課程內容
  2. 教學人員更易於管理課程
  3. 資訊傳遞更加便捷

- Metrics
  1. 處理問題時間統計
  2. 行事曆使用率
  3. 使用者滿意度(和現成平台對比)

## 交付模式

- 發布至 AWS
  1. EC2 micro
  2. RDS
  3. elasticache

## 團隊協定與標準

### 團隊協定

1. 使用 Jira 管理 sprint 的 story 和 task
2. 每 2 周 meeting 一次，每次不得超過 1 小時
   - bug report
   - possible bottleneck tasks
   - advices
3. Gitlab 上的 PR 每個人都要看過，理解 code 本身在幹嘛，comment 有空就要回
4. 逕行決策時，透過 Discord 投票
5. 做不完要先講
6. 規定某個禮拜的某兩個小時為 office time，在這段時間，code 共同協作的優先權要排最高。

### 團隊標準

1. commit message 的標準寫法，中括號 + 大寫
   - Mainly Used Commit types:
     - [Feat] introduce / start new feature
     - [Fix] patches a bug or issue
     - [Refactor] code change that is neither feat or fix
     - [Chore] update dependencies / plugins that does not relate to fix or feat and does not modify src or test files
     - [docs] updates the documentation or introduce documentation
     - [Style] updates the formatting of code
     - [Test] add/remove/update tests
     - [Revert] reverts one or many previous commits
     - [Perf] improve performance
2. Branch type:
   - 主系分支
     - main branch
     - release branch
       - 用來發布實際上對外的版本
       - 使用者看到的每個版笨號都記在這上面
       - 多從 develope 分出，常有 hotfix 出沒
   - 旁系分支
     - feature 系列
     - hotfix 系列
       - 用來做及時錯誤修正，優先權高於其他旁系分支
       - file restructure 也屬於這類
     - intergration 系列
       - 整合 feature 分支
     - library 系列
       - 當出現大家要共用的套件，或函式庫時使用
       - 優先權僅次於 hotfix
3. codying style 的一致性
   - [variable] camelCase
   - [class] CamelCase
   - [global] UPPER_CASE
   - 禁止簡體中文註解
   - if use JS, only async / await
4. PR 文的清楚撰寫，須包含: (模板請看[下方連結](#pr-文模板))
   1. feature Outline
   2. 列點說明新增功能，以檔案為單位的 change explanation
   3. 前端，後端，DB，快取間的 workflow（如果有大改動再提即可）
   4. file structure
   5. 新增功能若需安裝新套件，請列出 Instruction Steps
   6. 相關測試步驟
   7. Reminder
5. PR 須經過至少一人的 Approve，若是有特定功能相關的開發者，請 assign 給他
6. 當使用 js 的時候，禁止使用 `var`

#### PR 文模板

```
# PR content

## Feature Outline in 1 sentences

## Features list

## Workflow

## File Structure

## Installation Instructions for New Packages

## Testing Steps

## Reminders and Important Notes

```