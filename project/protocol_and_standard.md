## 團隊協定與標準

### 團隊協定 (對人)

1. Jira 管理 sprint 的 story 和 task
2. 每 2 周 meeting 一次，每次不得超過 1 小時
    - bug report
    - possible bottleneck tasks
    - advices
3. Gitlab 上的 PR 每個人都要看過，理解 code 本身在幹嘛，comment 有空就要回
4. 逕行決策時，透過 Discord 投票
5. 有無法解決的問題，跟Scrum Master回報
6. 每週六 21:00 ~ 22:00 為 office time，在這段時間，code 共同協作的優先權要排最高。

### 團隊標準 (對事)

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
2. Branch type: (全部以 `-` 分隔)
    - 主系分支
        - main branch
    - 旁系分支
        - feature 系列
        - hotfix 系列
            - 用來做及時錯誤修正，優先權高於其他旁系分支
            - file restructure 也屬於這類
3. codying style 的一致性
    - [variable] camelCase
    - [function] PascalCase
    - [class] PascalCase
    - [global] UPPER_CASE
    - 禁止簡體中文註解
    - if use JS, only async / await
4. PR 文的清楚撰寫，模板請看[gitlab](https://gitlab.com/jingxiang0405/moojidle/-/blob/main/.gitlab/merge_request_templates/merge.md?ref_type=heads)
5. PR 須經過至少一人的 Approve，若是有特定功能相關的開發者，請 assign 給他
6. Express 後端
    1. 檔案為 **caterpillar_case**
    2. 資料夾為 **caterpillar_case**
    3. Router, Controller, Service 之間的架構關係
        - Router: API 的路徑
        - Controller: 處理 Request、Response 的邏輯，並呼叫 Service 取得資料
        - Service: 和資料庫溝通，service 的更詳細解釋可以看[這裡](https://discord.com/channels/1342382586583842826/1342386906545131521/1373563681362939915)
    4. File Definition
        - 假設路徑 `#src/routes/user/user_routes.js`，代表**前端要拿 User 相關 data 時的路徑**
        - 假設路徑 `#src/controllers/user/user_controllers.js`，代表**後端有關 User 的 routes 時，會用的邏輯處理**
        - 假設路徑 `#src/services/user/user_services.js`，代表**回傳 DB 裡 User 相關資料的 API**
7. 前端
    1. 檔案為 **PascalCase**
    2. 一般資料夾為 **caterpillar_case**，包著一個 page 或 component 的資料夾則為 **PascalCase**
    3. 如果有全域變數，用 Context 來存([Context介紹](https://ithelp.ithome.com.tw/articles/10252123))
    4. 一個 URL 對應一個 Page
    5. service, pages, components 之間的關係
        - service: 定義著向後端打 request 的 function，會去訪問後端的 URL
        - pages: 透過 service 抓取資料，只負責做 data fetching 和分配接下來 components 如何 render 網頁，所有 `useEffect` 都"只"該出現在此
        - components: 接收來自 page 的資料 (props)，負責做網頁渲染，是 css styling 的集中地
    4. File Definition
        - 假設路徑 `@/services/user_api/`，代表**回傳後端 User 相關資料的 API**
        - 假設路徑 `@/pages/user_pages/`，代表**前端 User 相關的 pages**
        - 假設路徑 `@/components/user_components/`，代表 **user_pages 裡有用到的自訂 components**
8. MongoDB 新增一筆資料後，要把 counter 這個 document 相對應的欄位加 1
9. Figma 設計做完請上傳給**林子齊**驗收，若被退件，不是林子齊要幫你重畫，是你要重新繳交