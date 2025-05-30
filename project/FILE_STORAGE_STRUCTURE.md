# 檔案儲存分離結構說明

## 📁 目錄結構

學生作業提交系統現在使用以下目錄結構來分離不同類型的檔案：

```
project/backend/uploads/
├── assignment/     # 教師上傳的作業檔案
├── material/       # 教師上傳的教材檔案  
└── submit/         # 學生提交的作業檔案
```

## 🎯 分離原則

### 1. 教材檔案 (`/uploads/material/`)
- **用途**: 教師上傳的課程教材
- **控制器**: `material_controller.js` - `UploadCourseMaterial`
- **前端組件**: `MaterialUploadModal.jsx`
- **API 調用**: `SaveFile(buffer, filename, "material")`

### 2. 作業檔案 (`/uploads/assignment/`)
- **用途**: 教師上傳的作業題目和相關檔案
- **控制器**: `assignment_controller.js` - `UploadAssignment`
- **前端組件**: `AssignmentUploadModal.jsx`
- **API 調用**: `SaveFile(buffer, filename, "assignment")`
- **特色**: 支援多檔案上傳

### 3. 學生提交檔案 (`/uploads/submit/`)
- **用途**: 學生提交的作業答案檔案
- **控制器**: `assignment_controller.js` - `SubmitAssignment`
- **前端組件**: `UploadModal.jsx` (mode="student-assignment")
- **API 調用**: `SaveFile(buffer, filename, "submit")`

## 🔧 技術實現

### SaveFile 函數
```javascript
SaveFile(buffer, originalName, subfolder)
```

- `subfolder` 參數決定檔案儲存的子目錄
- 自動創建目錄如果不存在
- 生成唯一的檔案 ID 避免名稱衝突

### 控制器使用方式

**教材上傳**:
```javascript
const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "material");
```

**作業上傳**:
```javascript
const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "assignment");
```

**學生提交**:
```javascript
const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "submit");
```

## ✅ 優點

1. **明確分離**: 不同類型檔案儲存在不同目錄，易於管理
2. **權限控制**: 可針對不同目錄設定不同的存取權限
3. **備份策略**: 可針對不同類型檔案制定不同的備份政策
4. **擴展性**: 未來可輕鬆添加新的檔案類型目錄
5. **故障排除**: 問題檔案可快速定位到特定類型

## 🚀 未來擴展

可考慮添加的目錄類型：
- `exam/` - 考試檔案
- `feedback/` - 教師回饋檔案
- `temp/` - 臨時檔案
- `archive/` - 歸檔檔案

## 📝 測試建議

1. **功能測試**: 驗證三種上傳類型都能正確儲存到對應目錄
2. **權限測試**: 確認不同角色只能存取相應的檔案
3. **清理測試**: 驗證檔案刪除功能正確清理對應目錄的檔案
