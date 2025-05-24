# 📚 測試文檔導覽

> **簡化的測試指南 - 讓團隊快速上手**

## 🎯 快速導覽

| 需求 | 文檔 | 預估時間 |
|------|------|----------|
| **🚀 馬上開始寫測試** | [⚡ 快速開始指南](./TESTING_QUICKSTART.md) | 5 分鐘 |
| **📚 學習完整範例** | [📖 測試範例](./TESTING_EXAMPLE.md) | 15 分鐘 |
| **🎯 團隊能力驗證** | [✅ 驗證步驟](./TEAM_VERIFICATION_STEPS.md) | 90 分鐘 |

---

## 📖 文檔說明

### 1️⃣ [⚡ 快速開始指南](./TESTING_QUICKSTART.md)
**5 分鐘上手測試**
- 核心 5 步驟流程
- 常用測試語法
- 快速參考清單

### 2️⃣ [📖 測試範例](./TESTING_EXAMPLE.md)  
**深入學習測試實例**
- Course 功能完整示例
- Service/Controller/Routes 三層架構
- 適應現有路由設計

### 3️⃣ [✅ 驗證步驟](./TEAM_VERIFICATION_STEPS.md)
**確保團隊成員測試能力**
- 環境驗證任務
- 範例執行任務  
- 獨立編寫任務

---

## 🏃‍♂️ 快速開始

### 新手路線 (推薦)
```bash
# 1. 環境檢查
npm test user

# 2. 快速學習
# 閱讀：TESTING_QUICKSTART.md (5分鐘)

# 3. 實際練習  
# 執行：TEAM_VERIFICATION_STEPS.md 任務一
```

### 進階路線
```bash
# 1. 完整範例學習
# 閱讀：TESTING_EXAMPLE.md

# 2. 實際應用
# 完成：TEAM_VERIFICATION_STEPS.md 所有任務

# 3. 獨立開發
# 使用：tests/template.test.js 開始新模組測試
```

---

## 📁 文檔結構

### 📁 文檔結構
```
docs/testing/
├── README.md                    # 📍 你在這裡
├── TESTING_QUICKSTART.md        # ⚡ 快速開始 
├── README_TESTING.md            # 📋 環境設置
└── TESTING_EXAMPLE.md           # 📚 完整示例
```

### 🛠️ 測試文件位置
```
tests/
├── setup.js                     # 測試環境配置
├── template.test.js              # 測試模板
├── user.service.test.js          # Service 層測試示例
├── user.controller.test.js       # Controller 層測試示例
└── user.routes.test.js           # Routes 層測試示例
```

### 📚 外部資源
- [Vitest 官方文檔](https://vitest.dev/)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

---

## 🆘 需要幫助？

### 🎯 **我的情況是...**

| 情況 | 建議 |
|------|------|
| 第一次寫測試 | 先看 [📋 環境設置](./README_TESTING.md)，再看 [⚡ 快速開始](./TESTING_QUICKSTART.md) |
| 有測試經驗，想快速上手 | 直接看 [⚡ 快速開始指南](./TESTING_QUICKSTART.md) |
| 想了解完整流程 | 看 [🔬 工作流程指南](./TESTING_WORKFLOW.md) |
| 需要具體代碼參考 | 看 [📚 Course 功能示例](./TESTING_EXAMPLE.md) |
| 測試環境有問題 | 參考 [📋 環境設置指南](./README_TESTING.md) 的常見問題 |

---

**🎯 記住**：測試不是負擔，而是讓代碼更穩定、開發更自信的工具！

**▶️ 開始建議**：如果你是第一次接觸我們的測試體系，建議從 [⚡ 快速開始指南](./TESTING_QUICKSTART.md) 開始！ 🚀 