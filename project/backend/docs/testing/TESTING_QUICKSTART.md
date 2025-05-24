# ⚡ 5 分鐘測試快速開始

> **最精簡的測試指南 - 讓你快速上手**

## 🎯 核心 5 步驟

### 1️⃣ 分析功能 (30秒)
```javascript
// 我要測試什麼？
const 功能 = "創建課程";
const 輸入 = { name: "課程名稱", userId: 1 };
const 預期輸出 = { course_id: 數字, name: "課程名稱" };
```

### 2️⃣ 寫測試描述 (30秒)
```javascript
describe('CreateCourse', () => {
  it('應該成功創建課程', async () => {
    // 測試邏輯
  });
  
  it('應該拒絕空的課程數據', async () => {
    // 錯誤測試
  });
});
```

### 3️⃣ AAA 模式編寫 (2分鐘)
```javascript
it('應該成功創建課程', async () => {
  // Arrange - 準備
  const courseData = { name: 'Test Course', userId: 1 };
  
  // Act - 執行
  const result = await CreateCourse(courseData);
  
  // Assert - 驗證
  expect(result).toHaveProperty('course_id');
  expect(result.name).toBe('Test Course');
});
```

### 4️⃣ 執行測試 (30秒)
```bash
npm test [your-test-file]
```

### 5️⃣ 調整優化 (1分鐘)
- 測試失敗？檢查期望值
- 測試太慢？減少數據量
- 測試不穩定？檢查數據隔離

---

## 🧪 expect 語法速查

### 基本斷言
```javascript
expect(value).toBe(4);                    // 嚴格相等
expect(value).toEqual({name: 'test'});    // 深度相等
expect(value).toBeDefined();              // 已定義
expect(value).toBeNull();                 // 是 null
expect(value).toBeTruthy();               // 真值
expect(value).toBeFalsy();                // 假值
```

### 數字比較
```javascript
expect(value).toBeGreaterThan(3);         // > 3
expect(value).toBeGreaterThanOrEqual(3);  // >= 3
expect(value).toBeLessThan(5);            // < 5
expect(value).toBeCloseTo(0.3);           // 浮點數比較
```

### 字符串匹配
```javascript
expect('hello world').toContain('world'); // 包含子串
expect('hello').toMatch(/ell/);           // 正則匹配
expect('hello').toHaveLength(5);          // 長度檢查
```

### 數組/對象檢查
```javascript
expect(['a', 'b']).toContain('a');        // 包含元素
expect(obj).toHaveProperty('name');       // 有屬性
expect(obj).toHaveProperty('age', 25);    // 屬性值
expect(array).toHaveLength(3);            // 數組長度
```

### 異步測試
```javascript
await expect(promise).resolves.toBe(value);     // Promise 成功
await expect(promise).rejects.toThrow('error'); // Promise 失敗
await expect(asyncFn()).resolves.toHaveProperty('id');
```

### Mock 檢查
```javascript
expect(mockFn).toHaveBeenCalled();              // 被調用
expect(mockFn).toHaveBeenCalledWith('arg');     // 調用參數
expect(mockFn).toHaveBeenCalledTimes(2);        // 調用次數
```

---

## 📝 三層測試模板

### Service 層 (數據邏輯)
```javascript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { YourService } from '#src/services/your_service.js';

describe('Your Service', () => {
  beforeAll(global.beforeAll);
  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  it('應該成功執行主要功能', async () => {
    const result = await YourService(testData);
    expect(result).toBeDefined();
  });
});
```

### Controller 層 (請求處理)
```javascript
import { vi } from 'vitest';
import { YourController } from '#src/controllers/your_controller.js';

const createMockReq = (body = {}, params = {}) => ({ body, params });
const createMockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

it('應該返回正確的狀態碼', async () => {
  const req = createMockReq({ data: 'test' });
  const res = createMockRes();
  
  await YourController(req, res);
  
  expect(res.status).toHaveBeenCalledWith(200);
});
```

### Routes 層 (HTTP 端點)
```javascript
import request from 'supertest';
import express from 'express';

let app;
beforeAll(() => {
  app = express();
  app.use('/api', yourRoute);
});

it('應該返回正確的響應', async () => {
  const response = await request(app)
    .post('/api/endpoint')
    .send({ data: 'test' })
    .expect(200);
    
  expect(response.body).toHaveProperty('id');
});
```

---

## ✅ 開發檢查清單

### 編寫測試前
- [ ] 理解功能需求
- [ ] 確認輸入輸出格式  
- [ ] 識別錯誤情況

### 編寫測試時
- [ ] 使用清晰的測試描述
- [ ] 遵循 AAA 模式
- [ ] 包含成功和失敗情況
- [ ] 每個測試只驗證一件事

### 測試完成後
- [ ] 所有測試通過
- [ ] 測試覆蓋主要功能
- [ ] 測試執行速度合理
- [ ] 代碼風格一致

---

## 🚀 常用命令

```bash
# 執行所有測試
npm test

# 執行特定測試
npm test user                    # 所有 user 相關測試
npm test course.service.test.js  # 特定文件

# 監視模式 (開發時使用)
npm run test:watch

# 查看覆蓋率
npm run test:coverage

# 安靜模式 (減少輸出)
npm test -- --reporter=dot
```

---

## 💡 測試技巧

### ✅ 好的做法
```javascript
// 清晰的測試描述
it('應該在用戶名為空時返回 400 錯誤', async () => {

// 明確的期望
expect(response.status).toBe(400);
expect(response.body.message).toContain('用戶名不能為空');

// 獨立的測試數據
const testUser = { name: 'Test User' + Date.now() };
```

### ❌ 避免的做法
```javascript
// 模糊的描述
it('測試用戶功能', async () => {

// 不明確的期望  
expect(response).toBeTruthy();

// 依賴其他測試的數據
const testUser = globalTestUser; // ❌ 可能導致測試相互影響
```

---

## 📚 進階學習

**當你掌握基礎後**：
- **完整範例**: [📖 測試範例](./TESTING_EXAMPLE.md)
- **團隊驗證**: [✅ 驗證步驟](./TEAM_VERIFICATION_STEPS.md)
- **測試模板**: [📝 測試模板](../tests/template.test.js)

**參考資源**：
- **主目錄**: [📚 文檔導覽](./README.md)
- **環境設置**: [🔧 環境設置](./README_TESTING.md)

---

🎯 **5 分鐘學完了？馬上開始寫你的第一個測試！** 