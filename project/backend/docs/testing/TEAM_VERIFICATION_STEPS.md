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
| **測試數據** | 動態插入，最小數據 | 動態插入，按需創建 |
| **數據量** | 2 個用戶，最小數據 | 按測試需求動態插入 |
| **資料庫** | 臨時內存資料庫 | 獨立測試資料庫 |
| **執行速度** | 快 | 慢一點 |
| **適用場景** | 快速開發測試 | 完整功能驗證 |

### 🎯 執行步驟

#### **🚀 標準測試**

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

#### **🔧 完整測試（實際DB）**

如果你想使用真實的 MongoDB 實例和完整的 Schema 驗證：

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
- [ ] Schema 驗證器正常工作
- [ ] 動態插入測試數據成功
- [ ] 測試執行時間 < 3 分鐘

### 📊 預期輸出示例

**標準測試輸出**：
```bash

```

**完整測試輸出**：
```bash

```

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

**問題：測試資料庫污染**
```bash
# 手動清理測試資料庫
mongosh
use moojidle_test
db.dropDatabase()
```

## 🧪 任務二：範例測試創建

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

##### 📊 預期輸出示例
```bash
Test Files  1 failed (1)
      Tests  2 failed | 5 passed (7)
```


#### 第三步：創建 Controller 層測試  
1. **創建文件** `tests/controllers/course.controller.test.js`
2. **複製代碼**：從 [`TESTING_EXAMPLE.md` Controller 層部分](./TESTING_EXAMPLE.md#🎮-controller-層測試) 完整複製代碼
3. **執行測試**：
   ```bash
   npm test course.controller.test.js
   ```

##### 📊 預期輸出示例
```bash
Test Files  1 failed (1)
     Tests  2 failed | 6 passed (8)
```

#### 第四步：創建 Routes 層測試
1. **創建文件** `tests/routes/course.routes.test.js`  
2. **複製代碼**：從 [`TESTING_EXAMPLE.md` Routes 層部分](./TESTING_EXAMPLE.md#🌐-routes-層測試適應現有路由) 完整複製代碼
3. **執行測試**：
   ```bash
   npm test course.routes.test.js
   ```

##### 📊 預期輸出示例
```bash
Test Files  1 failed (1)
      Tests  3 failed | 8 passed (11)
```

#### 第五步：執行完整測試
```bash
npm test course
```

##### 📊 預期輸出示例
```bash
Test Files  3 failed (3)
     Tests  7 failed | 19 passed (26)
```

### ✅ 成功標準

- [ ] 成功創建三個測試文件
- [ ] 與預期輸出相同 (注意 : 有 fail 是正常的)
- [ ] 理解三層測試架構的區別


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

---

## ✍️ 任務三：獨立編寫測試 

### 📝 任務描述
選擇一個現有功能模組，獨立編寫完整的三層測試，各一個 function

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

#### 第一步：選擇一個模組和功能函數
1. **選擇模組**：從上述三個模組中選擇一個
2. **選擇函數**：為每一層選擇一個函數進行測試
   ```bash
   # 查看模組文件，選擇要測試的函數
   cat src/services/announcement_service.js  # 例如選擇 CreateAnnouncement
   cat src/controllers/announcement_controller.js  # 例如選擇 createAnnouncement
   cat src/routes/announcement_route.js  # 例如選擇 POST /announcement/create
   ```

#### 第二步：創建三個測試文件

**Service 層測試**：創建 `tests/services/[module].service.test.js`
```javascript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { YourChosenFunction } from '#src/services/your_service.js';

describe('Your Service', () => {
  beforeAll(global.beforeAll);
  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  describe('YourChosenFunction', () => {
    it('應該成功執行基本功能', async () => {
      // Arrange - 準備測試數據
      const testData = { /* 根據函數需求準備數據 */ };
      
      // Act - 執行函數
      const result = await YourChosenFunction(testData);
      
      // Assert - 驗證結果
      expect(result).toBeDefined();
      // 根據函數預期結果添加更多斷言
    });
  });
});
```

**Controller 層測試**：創建 `tests/controllers/[module].controller.test.js`
```javascript
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { yourChosenController } from '#src/controllers/your_controller.js';

describe('Your Controller', () => {
  beforeAll(global.beforeAll);
  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  const createMockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  describe('yourChosenController', () => {
    it('應該正確處理 HTTP 請求', async () => {
      // Arrange
      const req = { body: { /* 請求數據 */ } };
      const res = createMockRes();

      // Act
      await yourChosenController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(/* 預期狀態碼 */);
      expect(res.send || res.json).toHaveBeenCalled();
    });
  });
});
```

**Routes 層測試**：創建 `tests/routes/[module].routes.test.js`
```javascript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '#src/app.js';

describe('Your Routes', () => {
  beforeAll(global.beforeAll);
  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  describe('POST /your-endpoint', () => {
    it('應該成功處理端到端請求', async () => {
      // Arrange
      const testData = { /* API 請求數據 */ };

      // Act & Assert
      const response = await request(app)
        .post('/your-endpoint')  // 替換為實際端點
        .send(testData)
        .expect(/* 預期狀態碼 */);

      // 驗證響應內容
      expect(response.body).toHaveProperty(/* 預期屬性 */);
    });
  });
});
```

#### 第三步：執行測試 (5 分鐘)
```bash
npm test [your-module]
```

### ✅ 成功標準

- [ ] 創建 3 個測試文件（service, controller, routes 各一個）
- [ ] 每個文件包含 1 個測試函數
- [ ] 所有 3 個測試都能通過
- [ ] 測試代碼遵循 AAA 模式（Arrange, Act, Assert）
- [ ] 測試描述清晰易懂

### 💡 實作技巧

1. **參考現有測試**：查看 `user` 和 `course` 的測試範例
2. **簡化測試**：專注於一個核心功能，不需要複雜的邊界測試
3. **理解架構**：重點在於理解三層測試的不同目的
4. **漸進實作**：一次創建一個文件，確保每個都能運行

## 📚 完成驗證

### 🎖️ 驗證通過標準

完成所有三個任務並滿足：
- ✅ **任務一**：環境測試通過（user 測試全部成功）
- ✅ **任務二**：範例測試創建成功（course 測試理解並通過）
- ✅ **任務三**：獨立測試編寫合格（3 個測試文件，各包含 1 個測試函數，全部通過）

### 🏆 認證流程

1. **自我檢查**：確認所有任務完成
2. **提交材料**：
   ```
   📧 發送郵件給技術 Lead，包含：
   - 任務一：截圖顯示 user 測試通過
   - 任務二：截圖顯示 course 測試通過  
   - 任務三：截圖顯示你編寫的 3 個測試文件連結
   ```

3. **代碼審查**：技術 Lead 會審查你的測試代碼

### 🔄 持續學習

**進階資源**：
- [⚡ 快速開始指南](./TESTING_QUICKSTART.md) - 快速參考
- [📝 測試模板](../tests/template.test.js) - 完整的測試模板
- [🔍 測試示例](./TESTING_EXAMPLE.md) - Course 功能完整示例