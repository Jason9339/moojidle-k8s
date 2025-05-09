## 團隊協定與標準

### 團隊協定

1. Jira 管理 sprint 的 story 和 task
2. 每 2 周 meeting 一次，每次不得超過 1 小時
   - bug report
   - possible bottleneck tasks
   - advices
3. Gitlab 上的 PR 每個人都要看過，理解 code 本身在幹嘛，comment 有空就要回
4. 逕行決策時，透過 Discord 投票
5. 有無法解決的問題，跟Scrum Master回報
6. 每週六21:00 ~ 22:00 為 office time，在這段時間，code 共同協作的優先權要排最高。

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
       - 多從 develop 分出，常有 hotfix 出沒
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

6. Express後端

   1. 檔案為**PascalCase**
   2. 資料夾為**caterpillar_case**
   3. Router-Controller-Service架構
      - Router: API的路徑
      - Controller: 處理Request、Response，並呼叫Service取得資料
      - Service: 和資料庫溝通、處理業務邏輯
   4. Service File Structure
      - 假設路徑`~/service/user/post_api.js`，代表**前端處理User時取得Post資料的API**

7. 前端

   1. 檔案為**caterpillar_case**
   2. 資料夾為**caterpillar_case**
   3. 如果有全域變數，用Context來存([Context介紹](https://ithelp.ithome.com.tw/articles/10252123))
   4. JSX Page 的單位是**一個URL對應一個Page**

8. MongoDB新增一筆資料後，要把counter加一
9. Figma設計做完請上傳給**林子齊**驗收
