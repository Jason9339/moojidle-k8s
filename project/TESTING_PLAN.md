# 學生作業提交與顯示功能測試計劃

## 測試目標
確保學生提交作業後，前端能立即顯示「已繳交」狀態，並正確分離教師上傳的作業檔案和學生提交的檔案。

## 已完成的改進

### 後端改進
1. **API 端點實作** (`assignment_controller.js`)
   - `SubmitAssignment`: 處理學生作業提交，包含完整的日誌記錄
   - `GetAssignmentSubmission`: 根據 assignmentId 和 user_id 查詢學生提交記錄
   - 確保必要欄位 (`submit_user_course_tag`, `submit_date`) 總是被設定
   - `attachments` 欄位總是為陣列格式

2. **路由註冊** (`assignment_route.js`)
   - 註冊 `GET /assignment/:assignmentId/submission` 端點
   - 註冊 `POST /assignment/:assignmentId/submit` 端點

3. **資料庫邏輯** 
   - 自動產生 `s_ass_id`
   - 正確設定 `submit_user_course_tag` 格式
   - 儲存檔案資訊到 `attachments` 陣列

### 前端改進
1. **API 修正** (`AssignmentApi.js`)
   - 修正 `GetAssignmentSubmission` 從 localStorage 正確取得 user_id
   - 統一 user_id 取得方式，避免不一致問題

2. **重新整理邏輯** (`AssignmentsStudentsTab.jsx`)
   - 轉換 `refreshAssignments` 為 async 函數
   - 新增 `refreshSubmissionMapWithAssignments` 函數
   - 簡化 `onSuccess` 回調，呼叫單一 async 重新整理函數
   - 確保作業列表和提交狀態同步更新

3. **UI 顯示邏輯**
   - 明確分離教師檔案 (`assignment.attachments`) 和學生提交 (`submissionMap`)
   - 顯示提交時間和檔案清單
   - 提供「已繳交」狀態指示

## 測試步驟

### 環境準備
1. 啟動 MongoDB 資料庫
2. 啟動後端伺服器：`cd backend && npm start`
3. 啟動前端開發伺服器：`cd frontend && npm run dev`

### 功能測試
1. **登入學生帳號**
   - 確保 localStorage 中有正確的 user 物件

2. **進入課程頁面**
   - 檢查作業列表是否正確載入
   - 確認未提交作業顯示「提交作業」按鈕

3. **提交作業**
   - 點擊「提交作業」按鈕
   - 上傳檔案並提交
   - 觀察後端日誌輸出：
     ```
     [SubmitAssignment] 開始處理學生作業提交: assignmentId=X, submitByUserId=Y
     [SubmitAssignment] 檔案已儲存: {...}
     [SubmitAssignment] 準備寫入資料庫的submission: {...}
     [SubmitAssignment] 作業繳交成功，s_ass_id: Z
     ```

4. **檢查即時更新**
   - 提交成功後，前端應立即顯示「已繳交」狀態
   - 不需要手動重新整理頁面
   - 觀察前端控制台是否有錯誤

5. **驗證資料分離**
   - 教師上傳的作業檔案顯示在「附件」區塊
   - 學生提交的檔案顯示在「已繳交」區塊
   - 兩者不會混淆

### 後端日誌驗證
觀察以下日誌輸出，確保數據流正確：

**提交作業時：**
```
[SubmitAssignment] 開始處理學生作業提交: assignmentId=1, submitByUserId=123
[SubmitAssignment] 檔案已儲存: {originalName: "report.pdf", relativeUrl: "/uploads/..."}
[SubmitAssignment] 準備寫入資料庫的submission: {s_ass_id: 1, ass_id: 1, ...}
[SubmitAssignment] 作業繳交成功，s_ass_id: 1
```

**查詢提交記錄時：**
```
[GetAssignmentSubmission] 查詢參數: assignmentId=1, user_id=123
[GetAssignmentSubmission] 查詢結果: {s_ass_id: 1, ass_id: 1, submit_by_user_id: 123, ...}
```

### 問題排查
1. **如果提交後狀態未更新**
   - 檢查 localStorage 中的 user_id 格式
   - 確認後端 API 回應正確
   - 檢查前端錯誤訊息

2. **如果顯示錯誤檔案**
   - 確認 `submissionMap` 和 `assignment.attachments` 分離邏輯
   - 檢查資料庫中的 attachments 格式

3. **如果 API 調用失敗**
   - 確認路由是否正確註冊
   - 檢查參數傳遞格式
   - 驗證資料庫連接狀態

## 成功標準
- ✅ 學生能成功提交作業
- ✅ 提交後立即顯示「已繳交」狀態（無需重新整理）
- ✅ 教師檔案和學生檔案正確分離顯示
- ✅ 後端日誌顯示完整的數據流追蹤
- ✅ 前端無 JavaScript 錯誤
- ✅ 重新整理頁面後狀態保持正確

## 備註
所有改進都專注於確保前端立即反映提交狀態變化，並提供調試能力來追蹤完整的數據流程。
