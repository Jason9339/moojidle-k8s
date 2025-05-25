# 後端測試指南 - 環境設置與基礎

> **測試環境設置和基礎概念指南**

## 📚 相關文檔

- **[📚 文檔導覽](./README.md)** - 所有測試文檔的導覽和使用指南 👈 **主目錄**
- **[⚡ 快速開始指南](./TESTING_QUICKSTART.md)** - 5 分鐘快速為新功能添加測試 👈 **從這裡開始**
- **[📚 Course 功能示例](./TESTING_EXAMPLE.md)** - 完整的實際示例，展示如何為新功能編寫測試
- **[📝 測試模板文件](../tests/template.test.js)** - 可複製的測試模板，快速開始新功能測試

---

## 📋 測試架構

### 三層測試架構
1. **Service 層測試** - 測試數據庫操作和業務邏輯
2. **Controller 層測試** - 測試請求處理和響應格式  
3. **Routes 集成測試** - 測試完整的 HTTP API

### 技術棧
- **Vitest** - 快速測試運行器，支持 ES modules
- **MongoDB Memory Server** - 內存數據庫，測試隔離
- **Supertest** - HTTP 請求測試
- **vi** - Mock 函數工具

---

## 🚀 環境設置

### 安裝依賴
```bash
npm install --save-dev vitest @vitest/ui supertest mongodb-memory-server
```

### 配置文件

#### vitest.config.js
```javascript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      '#src': path.resolve(process.cwd(), 'src')
    }
  }
});
```

#### package.json 腳本
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

#### tests/setup.js
```javascript
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

global.beforeAll = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // 初始化測試數據
  await setupTestData();
};

global.afterAll = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

global.beforeEach = async () => {
  // 清理並重新初始化測試數據
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  await new Promise(resolve => setTimeout(resolve, 5));
  await setupTestData();
};

async function setupTestData() {
  // 插入基礎測試數據
  await mongoose.connection.db.collection('counter').insertOne({ user: 2 });
  await mongoose.connection.db.collection('user').insertMany([
    { user_id: 1, name: 'Test User 1', email: 'test1@example.com', pw: 'password1' },
    { user_id: 2, name: 'Test User 2', email: 'test2@example.com', pw: 'password2' }
  ]);
}
```

---

## 🎯 快速驗證

### 檢查測試環境
```bash
# 驗證測試配置
npm test

# 運行現有測試
npm run test:run

# 查看測試覆蓋率
npm run test:coverage
```

### 測試結構
```
project/backend/
├── tests/
│   ├── setup.js              # 測試環境配置
│   ├── template.test.js       # 測試模板
│   ├── user.service.test.js   # Service 層測試示例
│   ├── user.controller.test.js # Controller 層測試示例
│   └── user.routes.test.js    # Routes 層測試示例
├── vitest.config.js           # Vitest 配置
└── package.json              # 測試腳本
```

---

## 🛠️ 常見配置問題

### 模塊解析錯誤
確保 `vitest.config.js` 中正確配置了模塊別名：
```javascript
resolve: {
  alias: {
    '#src': path.resolve(process.cwd(), 'src')
  }
}
```

### 數據庫連接問題
檢查 MongoDB Memory Server 是否正確啟動：
```javascript
// tests/setup.js 中檢查連接狀態
console.log('MongoDB 連接狀態:', mongoose.connection.readyState);
```

### 測試超時問題
調整測試超時時間：
```javascript
// vitest.config.js
export default defineConfig({
  test: {
    testTimeout: 15000, // 15 秒
  }
});
```

---

## 📊 測試覆蓋率

### 查看覆蓋率報告
```bash
npm run test:coverage
```

### 覆蓋率目標
- **Statements**: > 80%
- **Branches**: > 70%  
- **Functions**: > 80%
- **Lines**: > 80%

---

## 🔗 相關資源

- [Vitest 官方文檔](https://vitest.dev/)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

---

**環境設置完成後，請前往 [⚡ 快速開始指南](./TESTING_QUICKSTART.md) 開始為你的功能編寫測試！** 🚀 