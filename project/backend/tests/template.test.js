// 📝 測試模板文件 - 複製此文件來快速開始新功能的測試
// 使用方法：
// 1. 複製此文件並重命名為 "功能名.test.js"
// 2. 替換所有 "TemplateName" 為實際的功能名稱
// 3. 根據實際需求修改測試案例

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';

// ========================================
// SERVICE 層測試模板
// ========================================

// import {
//   CreateTemplateName,
//   FindTemplateNameById,
//   UpdateTemplateName,
//   DeleteTemplateName
// } from '#src/services/templatename_service.js';

describe('TemplateName Service', () => {
  beforeAll(global.beforeAll);
  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  describe('CreateTemplateName', () => {
    it('應該成功創建新記錄', async () => {
      // Arrange
      const testData = {
        // 填入測試數據
        name: 'Test Name',
        email: `test${Date.now()}@example.com`
      };

      // Act
      const result = await CreateTemplateName(testData);

      // Assert
      expect(result).toBeDefined();
      expect(result.insertedId).toBeDefined();
    });

    it('應該處理無效輸入', async () => {
      // Arrange
      const invalidData = {
        // 無效數據
      };

      // Act & Assert
      await expect(CreateTemplateName(invalidData)).rejects.toThrow();
    });
  });

  describe('FindTemplateNameById', () => {
    it('應該找到存在的記錄', async () => {
      // Arrange
      const testData = {
        name: 'Find Test',
        email: `find${Date.now()}@example.com`
      };
      const createResult = await CreateTemplateName(testData);
      const id = createResult.insertedId;

      // Act
      const found = await FindTemplateNameById(id);

      // Assert
      expect(found).toBeDefined();
      expect(found.name).toBe('Find Test');
    });

    it('應該返回 null 當記錄不存在', async () => {
      // Act
      const result = await FindTemplateNameById('nonexistent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('UpdateTemplateName', () => {
    it('應該成功更新記錄', async () => {
      // Arrange
      const original = {
        name: 'Original Name',
        email: `original${Date.now()}@example.com`
      };
      const createResult = await CreateTemplateName(original);
      const id = createResult.insertedId;

      const updateData = {
        name: 'Updated Name'
      };

      // Act
      const result = await UpdateTemplateName(id, updateData);

      // Assert
      expect(result.modifiedCount).toBe(1);
      
      // 驗證更新效果
      const updated = await FindTemplateNameById(id);
      expect(updated.name).toBe('Updated Name');
    });
  });

  describe('DeleteTemplateName', () => {
    it('應該成功刪除記錄', async () => {
      // Arrange
      const testData = {
        name: 'Delete Test',
        email: `delete${Date.now()}@example.com`
      };
      const createResult = await CreateTemplateName(testData);
      const id = createResult.insertedId;

      // Act
      const result = await DeleteTemplateName(id);

      // Assert
      expect(result.deletedCount).toBe(1);
      
      // 驗證刪除效果
      const deleted = await FindTemplateNameById(id);
      expect(deleted).toBeNull();
    });
  });
});

// ========================================
// CONTROLLER 層測試模板
// ========================================

// import {
//   CreateTemplateNameController,
//   GetTemplateNameController,
//   UpdateTemplateNameController,
//   DeleteTemplateNameController
// } from '#src/controllers/templatename_controller.js';

describe('TemplateName Controller', () => {
  beforeAll(global.beforeAll);
  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  // Mock 輔助函數
  const createMockReq = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query
  });

  const createMockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  describe('CreateTemplateNameController', () => {
    it('應該成功處理創建請求', async () => {
      // Arrange
      const req = createMockReq({
        // 請求數據
        name: 'Controller Test',
        email: 'controller@test.com'
      });
      const res = createMockRes();

      // Act
      await CreateTemplateNameController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Created successfully'
      });
    });

    it('應該拒絕無效請求', async () => {
      // Arrange
      const req = createMockReq({
        // 缺少必填字段
      });
      const res = createMockRes();

      // Act
      await CreateTemplateNameController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Missing required fields'
      });
    });
  });

  describe('GetTemplateNameController', () => {
    it('應該成功獲取記錄', async () => {
      // Arrange
      const req = createMockReq({}, { id: 'test-id' });
      const res = createMockRes();

      // Act
      await GetTemplateNameController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('應該返回 404 當記錄不存在', async () => {
      // Arrange
      const req = createMockReq({}, { id: 'nonexistent' });
      const res = createMockRes();

      // Act
      await GetTemplateNameController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Not found'
      });
    });
  });
});

// ========================================
// ROUTES 層測試模板
// ========================================

// import express from 'express';
// import bodyParser from 'body-parser';
// import request from 'supertest';
// import templateNameRoute from '#src/routes/templatename_route.js';

describe('TemplateName Routes Integration Tests', () => {
  let app;

  beforeAll(async () => {
    await global.beforeAll();
    
    // 設置測試用的 Express 應用
    app = express();
    app.use(bodyParser.json());
    app.use('/templatename', templateNameRoute);
  });

  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  describe('POST /templatename', () => {
    it('應該成功創建記錄', async () => {
      const newRecord = {
        // 測試數據
        name: 'Route Test',
        email: 'route@test.com'
      };

      const response = await request(app)
        .post('/templatename')
        .send(newRecord)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Created successfully');
    });

    it('應該拒絕無效數據', async () => {
      const invalidRecord = {
        // 無效數據
      };

      const response = await request(app)
        .post('/templatename')
        .send(invalidRecord)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /templatename/:id', () => {
    it('應該成功獲取記錄', async () => {
      // 先創建記錄...
      
      const response = await request(app)
        .get('/templatename/test-id')
        .expect(200);

      expect(response.body).toHaveProperty('name');
    });

    it('應該返回 404 當記錄不存在', async () => {
      const response = await request(app)
        .get('/templatename/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Not found');
    });
  });

  describe('PUT /templatename/:id', () => {
    it('應該成功更新記錄', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put('/templatename/test-id')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Updated successfully');
    });
  });

  describe('DELETE /templatename/:id', () => {
    it('應該成功刪除記錄', async () => {
      const response = await request(app)
        .delete('/templatename/test-id')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Deleted successfully');
    });
  });
});

// ========================================
// 測試數據工廠函數模板
// ========================================

function createTestTemplateNameData(overrides = {}) {
  return {
    name: 'Default Test Name',
    email: `test${Date.now()}@example.com`,
    // 其他默認值...
    ...overrides
  };
}

// ========================================
// 使用說明
// ========================================

/*
使用此模板的步驟：

1. 複製文件並重命名
   cp tests/template.test.js tests/your-feature.test.js

2. 全局替換功能名稱
   - TemplateName → YourFeatureName
   - templatename → yourfeaturename
   - CreateTemplateName → CreateYourFeatureName
   
3. 修改測試數據結構
   根據你的數據模型調整測試數據

4. 導入實際的函數
   取消註釋 import 語句並修改路徑

5. 運行測試
   npx vitest tests/your-feature.test.js

6. 根據實際 API 調整測試案例
   修改 HTTP 方法、路徑、狀態碼等

記住：好的測試應該簡單、快速、可靠！
*/ 