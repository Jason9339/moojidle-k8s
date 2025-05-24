# 🎯 團隊測試能力驗證步驟

> **確保所有團隊成員都能掌握我們的測試流程和工具**

## 📋 驗證目標

通過三個逐步遞進的任務，確保每位團隊成員都能：
- ✅ 理解現有測試環境
- ✅ 執行標準測試流程  
- ✅ 獨立編寫高質量測試

---

## 🚀 任務一：環境驗證 (15 分鐘)

### 📝 任務描述
驗證你的開發環境能正常運行現有測試

### 💡 **重要提醒：資料庫自動處理**
> **✅ 好消息**：你**不需要**手動啟動 MongoDB 或任何資料庫服務！  
> 測試環境使用 **MongoDB Memory Server**，會自動在測試時創建臨時資料庫，測試結束後自動清理。

### 🗄️ **Schema 和 Seed 數據說明**

#### **📋 兩種測試模式選擇**

**模式一：簡化測試（推薦新手）**
- 使用 MongoDB Memory Server
- 最小化測試數據
- 快速執行
- 無需額外設置

**模式二：完整測試（進階用戶）**
- 使用正式的 Schema 和 Seed 數據
- 完整的資料庫驗證
- 更接近生產環境
- 需要 MongoDB 實例

#### **Schema（資料庫結構）來源**

| 項目 | 簡化測試 | 完整測試 |
|------|----------|----------|
| **Schema** | 動態創建，無驗證器 | `project/database/Schema.js` |
| **Seed 數據** | `tests/setup.js` | `project/database/Seed.js` |
| **數據量** | 2 個用戶，最小數據 | 50+ 用戶，完整假數據 |
| **資料庫** | 臨時內存資料庫 | 獨立測試資料庫 |
| **執行速度** | 快（10-30秒） | 慢（1-3分鐘） |
| **適用場景** | 快速開發測試 | 完整功能驗證 |

### 🎯 執行步驟

#### **🚀 標準測試（推薦）**

1. **進入後端目錄**
   ```bash
   cd project/backend
   ```

2. **安裝依賴（如果尚未安裝）**
   ```bash
   npm install
   ```

3. **執行所有現有測試**
   ```bash
   npm run test
   ```

4. **重點檢查 user 相關測試**
   ```bash
   npm test user
   ```

#### **🔧 完整測試（進階選項）**

如果你想使用正式的 Schema 和 Seed 數據：

1. **確保 MongoDB 服務運行**
   ```bash
   # Ubuntu/WSL
   sudo systemctl start mongod
   
   # macOS
   brew services start mongodb-community@8.0
   ```

2. **設置環境變量**
   ```bash
   # 在 .env 文件中添加
   DATA_BASE_URL=mongodb://localhost:27017/moojidle
   TEST_DB_NAME=moojidle_test
   ```

3. **執行完整測試**
   ```bash
   npm run test:real-db
   ```

4. **檢查完整的 user 測試**
   ```bash
   npm run test:real-db -- user
   ```

### ✅ 成功標準

**標準測試**：
- [ ] 所有 user 相關測試通過
- [ ] 測試執行時間合理（< 30 秒）
- [ ] 沒有環境錯誤或依賴問題
- [ ] 看到綠色的測試通過信息

**完整測試**：
- [ ] 所有 user 相關測試通過
- [ ] 使用完整的 Schema 驗證
- [ ] 測試資料庫有 50+ 用戶數據
- [ ] 測試執行時間 < 3 分鐘
- [ ] Schema 驗證器正常工作

### 📊 預期輸出示例

**標準測試輸出**：
```bash
✓ tests/services/user.service.test.js (13 tests) 1352ms
✓ tests/controllers/user.controller.test.js (15 tests) 1359ms
✓ tests/routes/user.routes.test.js (16 tests) 1281ms

Test Files  3 passed (3)
     Tests  44 passed (44)
Duration  4.5s
```

**完整測試輸出**：
```bash
連接到測試資料庫: mongodb://localhost:27017/moojidle_test
開始載入 Schema 和 Seed 數據...
✓ 創建 collection: user
✓ 創建 collection: course
✓ 創建 collection: announcement
... (更多 collections)
✓ 插入 50 筆數據到 user
✓ 插入 5 筆數據到 course
... (更多數據)
Schema 和 Seed 數據載入完成

✓ tests/services/user.service.test.js (13 tests) 2845ms
✓ tests/controllers/user.controller.test.js (15 tests) 3021ms
✓ tests/routes/user.routes.test.js (16 tests) 2756ms

Test Files  3 passed (3)
     Tests  44 passed (44)
Duration  45.2s
```

### 🔧 常見問題排解

**標準測試問題**：

**問題：測試失敗或報錯**
```bash
# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install

# 重新執行測試
npm run test
```

**問題：首次運行很慢**
- ✅ **正常現象**：MongoDB Memory Server 首次下載需要時間
- ✅ **等待即可**：後續運行會快很多
- ✅ **耐心等待**：通常首次需要 1-2 分鐘

**完整測試問題**：

**問題：找不到 Schema.js 或 Seed.js**
```bash
# 檢查文件路徑
ls ../database/Schema.js
ls ../database/Seed.js

# 如果不存在，確認你在正確的目錄
pwd  # 應該在 project/backend
```

**問題：MongoDB 連接失敗**
```bash
# 檢查 MongoDB 服務狀態
sudo systemctl status mongod  # Ubuntu/WSL
brew services list | grep mongodb  # macOS

# 啟動 MongoDB 服務
sudo systemctl start mongod  # Ubuntu/WSL
brew services start mongodb-community@8.0  # macOS
```

**問題：Schema 載入失敗**
- ✅ **檢查語法**：確認 Schema.js 語法正確
- ✅ **權限問題**：確認有讀取 database 目錄的權限
- ✅ **路徑問題**：確認在 project/backend 目錄下執行

**問題：測試資料庫污染**
```bash
# 手動清理測試資料庫
mongosh
use moojidle_test
db.dropDatabase()
```

### 🎯 **選擇建議**

| 使用場景 | 建議模式 |
|----------|----------|
| **初學者** | 標準測試 - 簡單快速 |
| **日常開發** | 標準測試 - 快速反饋 |
| **功能完整性驗證** | 完整測試 - 完整驗證 |
| **Schema 相關開發** | 完整測試 - 驗證器測試 |
| **CI/CD 流水線** | 標準測試 - 快速且穩定 |
| **發布前驗證** | 完整測試 - 生產環境模擬 |

## 🧪 任務二：範例測試創建 (30 分鐘)

### 📝 任務描述
根據 `TESTING_EXAMPLE.md` 的範例代碼，自己動手創建 Course 功能的完整測試

### 🎯 執行步驟

#### 第一步：確認測試文件不存在
檢查以下文件應該**不存在**（如果存在請先刪除）：
- `tests/services/course.service.test.js` ❌ 
- `tests/controllers/course.controller.test.js` ❌
- `tests/routes/course.routes.test.js` ❌

#### 第二步：創建 Service 層測試

1. **創建文件** `tests/services/course.service.test.js`
2. **複製代碼**：從 [`TESTING_EXAMPLE.md` Service 層部分](./TESTING_EXAMPLE.md#📝-service-層測試) 完整複製代碼
3. **執行測試**：
   ```bash
   npm test course.service.test.js
   ```

#### 第三步：創建 Controller 層測試  
1. **創建文件** `tests/controllers/course.controller.test.js`
2. **複製代碼**：從 [`TESTING_EXAMPLE.md` Controller 層部分](./TESTING_EXAMPLE.md#🎮-controller-層測試) 完整複製代碼
3. **執行測試**：
   ```bash
   npm test course.controller.test.js
   ```

#### 第四步：創建 Routes 層測試
1. **創建文件** `tests/routes/course.routes.test.js`  
2. **複製代碼**：從 [`TESTING_EXAMPLE.md` Routes 層部分](./TESTING_EXAMPLE.md#🌐-routes-層測試適應現有路由) 完整複製代碼
3. **執行測試**：
   ```bash
   npm test course.routes.test.js
   ```

#### 第五步：執行完整測試
```bash
npm test course
```

### ✅ 成功標準

- [ ] 成功創建三個測試文件
- [ ] Service 層測試通過（約 6-8 個測試）
- [ ] Controller 層測試通過（約 8-10 個測試）  
- [ ] Routes 層測試通過（約 12-15 個測試）
- [ ] 所有 course 測試合計通過率 > 95%
- [ ] 理解三層測試架構的區別

### 📊 預期輸出示例
```bash
✓ tests/services/course.service.test.js (6 tests) 1987ms
✓ tests/controllers/course.controller.test.js (8 tests) 2456ms
✓ tests/routes/course.routes.test.js (12 tests) 4123ms

Test Files  3 passed (3)
Tests       26 passed (26)
```

### 🧠 學習重點

**重要**：你需要自己動手創建這些文件，這樣才能真正理解：

**Service 層測試**：
- 測試業務邏輯和數據操作
- 直接調用 service 函數
- 驗證返回值和數據庫狀態

**Controller 層測試**：
- 測試 HTTP 請求處理邏輯
- 使用 Mock Request/Response
- 驗證狀態碼和響應格式

**Routes 層測試**：
- 測試完整的 HTTP 流程
- 使用 supertest 發送真實請求
- 驗證端到端功能

### 🔍 深入理解

**在創建測試時，請特別注意以下概念**：

1. **AAA 模式**（在每個測試中觀察）：
   ```javascript
   // Arrange - 準備測試數據
   const courseData = { name: 'Test Course', userId: 1 };
   
   // Act - 執行測試動作
   const result = await CreateCourse(courseData);
   
   // Assert - 驗證結果
   expect(result).toHaveProperty('course_id');
   ```

2. **Mock 使用**（在 Controller 測試中）：
   ```javascript
   const createMockRes = () => {
     const res = {};
     res.status = vi.fn().mockReturnValue(res);
     res.send = vi.fn().mockReturnValue(res);
     return res;
   };
   ```

3. **端到端測試**（在 Routes 測試中）：
   ```javascript
   const response = await request(app)
     .post('/course/create')
     .send(newCourse)
     .expect(201);
   ```

### 💡 實作技巧

1. **逐步創建**：一次創建一個文件，確保每個都能運行
2. **理解代碼**：不要只是複製貼上，理解每行代碼的作用
3. **調試技能**：如果測試失敗，學會閱讀錯誤信息
4. **代碼對比**：對比三層測試的不同寫法和目的

---

## ✍️ 任務三：獨立編寫測試 (45 分鐘)

### 📝 任務描述
選擇一個現有功能模組，獨立編寫完整的三層測試

### 🎯 可選功能模組

1. **Announcement（公告）** - 推薦新手
   - 文件：`src/services/announcement_service.js`
   - 路由：`src/routes/announcement_route.js`
   - 控制器：`src/controllers/announcement_controller.js`

2. **Material（教材）** - 中等難度
   - 文件：`src/services/material_service.js`  
   - 路由：`src/routes/material_route.js`
   - 控制器：`src/controllers/material_controller.js`

3. **Discussion Board（討論版）** - 高級挑戰
   - 文件：`src/services/discussion_board_service.js`
   - 路由：`src/routes/discussion_board_route.js`
   - 控制器：`src/controllers/discussion_board_controller.js`

### 🎯 執行步驟

#### 第一步：分析功能模組 (10 分鐘)
1. **閱讀源代碼**：了解功能和 API
   ```bash
   # 查看模組文件
   cat src/controllers/[your-module]_controller.js
   cat src/routes/[your-module]_route.js
   cat src/services/[your-module]_service.js
   ```

2. **確認路由設計**：記錄所有端點
3. **理解數據流**：Service → Controller → Routes

#### 第二步：編寫測試計劃 (10 分鐘)
創建 `tests/[your-module].test-plan.md`：
```markdown
# [模組名稱] 測試計劃

## Service 層測試
- [ ] 功能1：建立操作 (如 CreateAnnouncement)
- [ ] 功能2：查詢操作 (如 FindAnnouncement)
- [ ] 功能3：更新操作 (如 UpdateAnnouncement)
- [ ] 功能4：刪除操作 (如 DeleteAnnouncement)
- [ ] 錯誤處理：無效輸入、不存在的資源

## Controller 層測試  
- [ ] 成功情況：正確的請求處理
- [ ] 錯誤情況：400, 404, 500 狀態碼
- [ ] 邊界情況：參數驗證、權限檢查

## Routes 層測試
- [ ] GET 路由測試：獲取資源
- [ ] POST 路由測試：創建資源
- [ ] PUT/PATCH 路由測試：更新資源
- [ ] DELETE 路由測試：刪除資源
- [ ] 完整 CRUD 流程測試
```

#### 第三步：編寫測試代碼 (20 分鐘)
參考現有的 course 測試和 `tests/template.test.js`：

1. **創建** `tests/services/[module].service.test.js`
2. **創建** `tests/controllers/[module].controller.test.js`  
3. **創建** `tests/routes/[module].routes.test.js`

**使用模板結構**：
```javascript
// Service 測試模板
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { YourServiceFunction } from '#src/services/your_service.js';

describe('Your Service', () => {
  beforeAll(global.beforeAll);
  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  describe('YourFunction', () => {
    it('應該成功執行主要功能', async () => {
      // Arrange
      const testData = { /* 測試數據 */ };
      
      // Act
      const result = await YourServiceFunction(testData);
      
      // Assert
      expect(result).toBeDefined();
      // 更多斷言...
    });
  });
});
```

#### 第四步：執行和調試 (5 分鐘)
```bash
npm test [your-module]
```

### ✅ 成功標準

- [ ] 至少編寫 15 個測試案例
- [ ] 覆蓋主要的 CRUD 操作
- [ ] 包含錯誤處理測試
- [ ] 測試通過率 > 90%
- [ ] 代碼遵循 AAA 模式
- [ ] 測試描述清晰易懂

### 🎯 評分標準

| 項目 | 優秀 (90-100) | 良好 (80-89) | 及格 (70-79) | 需改進 (<70) |
|------|---------------|--------------|--------------|---------------|
| **測試覆蓋** | 覆蓋所有主要功能 | 覆蓋大部分功能 | 覆蓋基本功能 | 覆蓋不足 |
| **測試品質** | AAA模式，清晰斷言 | 結構良好 | 基本正確 | 結構混亂 |  
| **錯誤處理** | 全面的邊界測試 | 基本錯誤測試 | 少量錯誤測試 | 缺少錯誤測試 |
| **代碼風格** | 一致性和可讀性 | 大致一致 | 基本可讀 | 風格混亂 |

---

## 📚 完成驗證

### 🎖️ 驗證通過標準

完成所有三個任務並滿足：
- ✅ **任務一**：環境測試通過（user 測試全部成功）
- ✅ **任務二**：範例測試創建成功（course 測試理解並通過）
- ✅ **任務三**：獨立測試編寫合格（至少 15 個測試，90% 通過率）

### 🏆 認證流程

1. **自我檢查**：確認所有任務完成
2. **提交材料**：
   ```
   📧 發送郵件給技術 Lead，包含：
   - 任務一：截圖顯示 user 測試通過
   - 任務二：截圖顯示 course 測試通過  
   - 任務三：你編寫的測試文件連結
   - 簡短說明：你對三層測試架構的理解
   ```

3. **代碼審查**：技術 Lead 會審查你的測試代碼
4. **獲得認證**：通過後獲得 **Testing Certified** 標記

### 🔄 持續學習

**進階資源**：
- [⚡ 快速開始指南](./TESTING_QUICKSTART.md) - 快速參考
- [📝 測試模板](../tests/template.test.js) - 完整的測試模板
- [🔍 測試示例](./TESTING_EXAMPLE.md) - Course 功能完整示例

**團隊支援**：
- 遇到問題時在群組中提問
- 與已認證成員進行配對學習
- 參加每週的測試經驗分享會

---

## 🆘 獲得幫助

### �� 提問技巧

**優質問題範例**：