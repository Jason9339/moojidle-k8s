# 🗄️ 使用正式資料庫進行測試

> **使用完整的 Schema 和 Seed 數據進行更接近生產環境的測試**

## 🎯 概述

除了標準的 MongoDB Memory Server 測試外，我們還提供了使用正式 Schema 和 Seed 數據的測試選項。這個選項適合：

- 🔍 **完整功能驗證**：測試完整的數據結構和約束
- 🛡️ **Schema 驗證測試**：確保數據符合正式的 schema 規範
- 🚀 **發布前驗證**：在接近生產環境的條件下測試
- 📊 **大數據量測試**：使用完整的假數據進行測試

## ⚙️ 設置步驟

### 1. 確保 MongoDB 運行

```bash
# Ubuntu/WSL
sudo systemctl start mongod
sudo systemctl status mongod

# macOS
brew services start mongodb-community@8.0
brew services list | grep mongodb
```

### 2. 環境變量配置

在 `project/backend/.env` 文件中添加：

```bash
# MongoDB 連接 URL
DATA_BASE_URL=mongodb://localhost:27017/moojidle

# 測試資料庫名稱（避免影響正式資料庫）
TEST_DB_NAME=moojidle_test
```

### 3. 執行完整測試

```bash
# 進入後端目錄
cd project/backend

# 執行完整測試
npm run test:real-db

# 監視模式
npm run test:real-db:watch

# 包含覆蓋率報告
npm run test:real-db:coverage

# 測試特定文件
npm run test:real-db -- user
npm run test:real-db -- course
```

## 📊 數據對比

| 項目 | 標準測試 | 完整測試 |
|------|----------|----------|
| **用戶數據** | 2 個測試用戶 | 50+ 完整用戶 |
| **課程數據** | 無預設課程 | 5+ 完整課程 |
| **其他數據** | 最小標籤數據 | 完整的公告、教材、考試等 |
| **Schema 驗證** | 無 | 完整的 JSON Schema 驗證器 |
| **執行時間** | 10-30 秒 | 1-3 分鐘 |

## 🔍 技術實現

### 自動 Schema 載入

系統會自動解析 `project/database/Schema.js` 文件：

```javascript
// 自動創建 collections 和驗證器
db.createCollection("user", {
    validator: {
        $jsonSchema: {
            // 完整的驗證規則
        }
    }
});
```

### 自動 Seed 資料載入

系統會自動解析 `project/database/Seed.js` 文件：

```javascript
// 自動插入完整的測試資料
db.user.insertMany([
    // 50+ 用戶數據
]);

db.course.insertMany([
    // 5+ 課程數據
]);
```

## 🚨 注意事項

### 安全性

- ✅ **使用獨立測試資料庫**：`moojidle_test`
- ✅ **測試後自動清理**：不會留下測試數據
- ⚠️ **不要在生產環境執行**：僅用於開發和測試

### 效能考量

- 📈 **初始載入較慢**：首次執行需要 1-3 分鐘
- 🔄 **後續執行正常**：Schema 和數據載入完成後正常速度
- 💾 **記憶體使用較高**：完整數據會占用更多記憶體

### 故障排除

**問題：Schema 載入失敗**
```bash
# 檢查文件是否存在
ls ../database/Schema.js
ls ../database/Seed.js

# 檢查權限
ls -la ../database/
```

**問題：MongoDB 連接失敗**
```bash
# 檢查 MongoDB 狀態
sudo systemctl status mongod

# 檢查連接
mongosh mongodb://localhost:27017
```

**問題：測試超時**
```bash
# 檢查 MongoDB 效能
mongostat --host localhost:27017

# 增加測試超時時間（在測試文件中）
// 已在 vitest.config.real-db.js 設置為 30 秒
```

## 🎯 使用建議

### 何時使用完整測試

- 🧪 **新功能開發**：確保與現有數據兼容
- 🔍 **Schema 修改**：驗證修改不會破壞現有數據
- 📋 **發布前檢查**：全面功能驗證
- 🐛 **調試數據相關問題**：使用真實數據結構

### 何時使用標準測試

- ⚡ **日常開發**：快速反饋循環
- 🔄 **CI/CD**：穩定快速的自動化測試
- 🎯 **單元測試**：專注於邏輯而非數據
- 📚 **學習測試**：簡單環境易於理解

## 📝 最佳實踐

1. **混合使用**：日常開發用標準測試，重要功能用完整測試
2. **定期驗證**：每週至少執行一次完整測試
3. **發布必備**：發布前必須通過完整測試
4. **文檔同步**：Schema 修改時更新測試

---

🎯 **開始使用完整測試，體驗更接近生產環境的測試體驗！** 