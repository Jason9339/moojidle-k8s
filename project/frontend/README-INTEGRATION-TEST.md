# 前端整合測試指南

> **測試前端 UserApi.js 與後端的實際整合**

## 🎯 概述

這個整合測試設置允許前端直接測試與後端 API 的整合，使用真實的 HTTP 請求和 mongodb-memory-server。

## ✨ 特點

- 🚀 **自動啟動後端**：測試會自動啟動獨立的後端測試服務器
- 💾 **内存資料庫**：使用 mongodb-memory-server，無需外部 MongoDB
- 🔄 **資料隔離**：每個測試前自動重置資料庫
- 📡 **真實 HTTP 請求**：測試實際的網路請求流程
- ⚡ **快速執行**：使用内存資料庫，測試執行快速

## 🚀 快速開始

### 安裝依賴
```bash
cd project/frontend
npm install
```

### 執行整合測試
```bash
# 執行所有整合測試
npm run test:integration

# 監視模式（開發時使用）
npm run test:integration:watch
```

### 執行單元測試（如果有）
```bash
npm run test:unit
```

## 📁 測試文件結構

```
project/frontend/
├── src/
│   ├── services/
│   │   └── UserApi.js          # 被測試的 API 模組
│   └── test/
│       ├── setup.js            # 基本測試設置
│       └── integration/
│           ├── setup.js        # 整合測試設置
│           └── userApi.integration.test.js  # UserApi 整合測試
├── vitest.config.js            # 單元測試配置
├── vitest.config.integration.js # 整合測試配置
└── package.json
```

## 🧪 測試內容

### UserApi 整合測試涵蓋：

#### ✅ 基本功能測試
- `GetUserDataById` - 獲取用戶資料
- `GetUserTagsById` - 獲取用戶標籤
- `UpdateUserPassword` - 更新密碼

#### ✅ 完整流程測試
- 用戶註冊 → 登入 → 獲取資料 → 更新密碼的完整流程

#### ✅ 錯誤處理測試
- 網路錯誤處理
- 無效輸入處理
- 用戶不存在的情況

#### ✅ API 配置測試
- 環境變數配置
- API 客戶端設置

## ⚙️ 配置說明

### 環境變數
測試期間會自動設置：
```javascript
process.env.VITE_API_BASE_URL = 'http://localhost:3001'
```

### 後端服務器
- **端口**: 3001
- **資料庫**: MongoDB Memory Server
- **自動啟動**: 測試開始時啟動，結束時關閉

## 🔧 進階配置

### 調整測試超時時間
如果測試超時，可以在 `vitest.config.integration.js` 中調整：

```javascript
export default defineConfig({
  test: {
    testTimeout: 60000, // 增加到 60 秒
    // ...
  }
})
```

### 調試模式
啟用更詳細的日誌輸出：

```bash
# 在 setup.js 中啟用調試日誌
DEBUG=1 npm run test:integration
```

## 🐛 故障排除

### 常見問題

#### 1. 後端服務器啟動失敗
```bash
Error: 後端服務器啟動超時
```

**解決方案**：
- 檢查端口 3001 是否被佔用
- 確保後端依賴已安裝：`cd ../backend && npm install`

#### 2. 網路連接錯誤
```bash
Error: connect ECONNREFUSED 127.0.0.1:3001
```

**解決方案**：
- 等待後端服務器完全啟動
- 檢查防火牆設置

#### 3. 測試資料問題
```bash
Expected: "User 1", Received: undefined
```

**解決方案**：
- 檢查資料庫重置是否正常工作
- 確認測試資料初始化腳本正確執行

### 調試技巧

#### 檢查後端服務器狀態
```bash
curl http://localhost:3001/health
```

#### 手動重置資料庫
```bash
curl -X POST http://localhost:3001/test/reset-database
```

## 📊 CI/CD 整合

### GitLab CI
整合測試已配置在 `.gitlab-ci.yml` 中：

```yaml
frontend-integration-test:
  stage: integration-test
  script:
    - npm run test:integration
```

### 本地 CI 模擬
```bash
# 模擬 CI 環境運行
NODE_ENV=ci npm run test:integration
```

## 🎯 最佳實踐

### 1. 測試隔離
- 每個測試用例都是獨立的
- 使用 `beforeEach` 重置資料庫
- 避免測試間的相互依賴

### 2. 資料管理
- 使用預設的測試用戶（User 1, User 2）
- 創建新用戶時使用唯一的 email
- 測試結束後自動清理

### 3. 錯誤處理
- 測試正常情況和異常情況
- 驗證錯誤訊息的正確性
- 確保 API 客戶端的容錯能力

### 4. 效能考量
- 使用內存資料庫提升速度
- 合理設置測試超時時間
- 避免不必要的重複設置

## 📚 延伸閱讀

- [Vitest 文檔](https://vitest.dev/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Axios 測試](https://axios-http.com/docs/req_config)
- [Node.js 子進程](https://nodejs.org/api/child_process.html)

---

## 🚀 執行測試

```bash
# 快速開始
cd project/frontend
npm install
npm run test:integration
```

**🎯 成功的整合測試讓前後端協作更可靠！** 