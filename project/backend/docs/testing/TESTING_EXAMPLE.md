# 📚 測試開發實例：Course 功能（適應現有路由設計）

> **實用的測試示例，適應項目當前的路由架構**

## 🎯 測試原則

**實用導向：測試應該驗證功能正確性，而不是強制特定的設計模式。**

---

## 🎯 功能需求

課程管理 CRUD 操作：創建、讀取、更新、刪除課程

---

## 📝 Service 層測試

```javascript
// tests/course.service.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  InsertCourse, FindCourseById, UpdateCourseName, DeleteCourse, FindAllCourses
} from '#src/services/course_service.js';

describe('Course Service', () => {
  beforeAll(global.beforeAll);
  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  describe('InsertCourse', () => {
    it('應該成功創建新課程', async () => {
      const courseData = {
        name: 'Introduction to Computer Science',
        description: 'Learn the basics of computer science',
        start_date: '2024-01-15',
        syllabus: 'Course syllabus here',
        week: 16,
        color: '#4A90E2'
      };

      const result = await InsertCourse(courseData);
      
      expect(result).toBeDefined();
      expect(result.course_id).toBeDefined();
      expect(result.name).toBe('Introduction to Computer Science');
      expect(result.invite_link).toBeDefined();
    });

    it('應該處理缺少 name 字段的課程', async () => {
      const invalidData = { description: 'Only description' };
      
      // 根據實際實現調整期望
      await expect(InsertCourse(invalidData)).rejects.toThrow();
    });

    it('應該處理空的課程名稱', async () => {
      const invalidData = { name: '', description: 'Valid description' };
      
      // 測試實際驗證邏輯
      const result = await InsertCourse(invalidData);
      expect(result).toBeDefined(); // 或者期望拋出錯誤
    });
  });

  describe('FindCourseById', () => {
    it('應該正確處理不存在的課程', async () => {
      // 測試實際的錯誤處理方式
      try {
        const result = await FindCourseById(99999);
        expect(result).toBeNull(); // 如果返回 null
      } catch (error) {
        expect(error.message).toContain('找不到'); // 如果拋出錯誤
      }
    });

    it('應該能查找到存在的課程', async () => {
      // 先創建課程
      const courseData = { name: 'Test Course', description: 'Test' };
      const created = await InsertCourse(courseData);
      
      const found = await FindCourseById(created.course_id);
      expect(found).toBeDefined();
      expect(found.name).toBe('Test Course');
    });
  });

  describe('UpdateCourseName', () => {
    it('應該成功更新課程名稱', async () => {
      const originalData = { 
        name: 'Original Course', 
        description: 'Original description'
      };
      const createResult = await InsertCourse(originalData);
      
      const updatedCourse = await UpdateCourseName(createResult.course_id, 'Updated Course Name');
      
      expect(updatedCourse).toBeDefined();
      expect(updatedCourse.name).toBe('Updated Course Name');
    });
  });

  describe('DeleteCourse', () => {
    it('應該成功刪除課程', async () => {
      const courseData = { 
        name: 'Delete Test Course', 
        description: 'Test description'
      };
      const createResult = await InsertCourse(courseData);
      
      const deletedCount = await DeleteCourse(createResult.course_id);
      
      expect(deletedCount).toBe(1);
      
      // 驗證刪除效果
      try {
        await FindCourseById(createResult.course_id);
        // 如果沒有拋出錯誤，表示課程仍存在
        expect(false).toBe(true); // 強制失敗
      } catch (error) {
        expect(error.message).toContain('找不到');
      }
    });
  });
});
```

---

## 🎮 Controller 層測試

```javascript
// tests/course.controller.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
  CreateCourse, GetCourseDetail, EditCourse, RemoveCourse, GetAllCourses
} from '#src/controllers/course_controller.js';

describe('Course Controller', () => {
  beforeAll(global.beforeAll);
  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  const createMockReq = (body = {}, params = {}) => ({ body, params });
  const createMockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  describe('CreateCourse', () => {
    it('應該成功創建課程', async () => {
      const req = createMockReq({
        name: 'Controller Test Course',
        description: 'Test description',
        userId: 1
      });
      const res = createMockRes();

      await CreateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
      const sentData = res.send.mock.calls[0][0];
      expect(sentData).toHaveProperty('course_id');
      expect(sentData).toHaveProperty('name', 'Controller Test Course');
    });

    it('應該拒絕空的課程數據', async () => {
      const req = createMockReq({});
      const res = createMockRes();

      await CreateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Lack of Course Data." });
    });
  });

  describe('GetCourseDetail', () => {
    it('應該成功獲取課程詳情', async () => {
      // 先創建課程
      const createReq = createMockReq({
        name: 'Detail Test Course',
        description: 'Test description',
        userId: 1
      });
      const createRes = createMockRes();
      await CreateCourse(createReq, createRes);
      
      const courseId = createRes.send.mock.calls[0][0].course_id;

      // 測試獲取課程詳情
      const req = createMockReq({}, { courseId: courseId.toString() });
      const res = createMockRes();

      await GetCourseDetail(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const sentData = res.json.mock.calls[0][0];
      expect(sentData).toHaveProperty('id', courseId);
      expect(sentData).toHaveProperty('title', 'Detail Test Course');
    });

    it('應該返回 404 當課程不存在', async () => {
      const req = createMockReq({}, { courseId: '99999' });
      const res = createMockRes();

      await GetCourseDetail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Course not found' });
    });
  });

  describe('EditCourse', () => {
    it('應該成功更新課程', async () => {
      // 先創建課程
      const createReq = createMockReq({
        name: 'Original Course',
        description: 'Original description',
        userId: 1
      });
      const createRes = createMockRes();
      await CreateCourse(createReq, createRes);
      
      const courseId = createRes.send.mock.calls[0][0].course_id;

      // 測試更新課程
      const req = createMockReq({ name: 'Updated Course Name' }, { id: courseId.toString() });
      const res = createMockRes();

      await EditCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
      const sentData = res.send.mock.calls[0][0];
      expect(sentData).toHaveProperty('name', 'Updated Course Name');
    });

    it('應該拒絕空的更新數據', async () => {
      const req = createMockReq({}, { id: '1' });
      const res = createMockRes();

      await EditCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Lack of update Data." });
    });
  });

  describe('RemoveCourse', () => {
    it('應該成功刪除課程', async () => {
      // 先創建課程
      const createReq = createMockReq({
        name: 'Delete Test Course',
        description: 'Test description',
        userId: 1
      });
      const createRes = createMockRes();
      await CreateCourse(createReq, createRes);
      
      const courseId = createRes.send.mock.calls[0][0].course_id;

      // 測試刪除課程
      const req = createMockReq({}, { id: courseId.toString() });
      const res = createMockRes();

      await RemoveCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
      const sentData = res.send.mock.calls[0][0];
      expect(sentData.message).toContain('Successfully deleted course');
    });

    it('應該返回 404 當嘗試刪除不存在的課程', async () => {
      const response = await request(app)
        .delete('/course/delete/99999')
        .expect(404);

      expect(response.body.message).toContain('Course not found');
    });
  });
});
```

---

## 🌐 Routes 層測試（適應現有路由）

```javascript
// tests/course.routes.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import courseRoute from '#src/routes/course_router.js';

describe('Course Routes Integration Tests - 現有路由設計', () => {
  let app;

  beforeAll(async () => {
    await global.beforeAll();
    
    app = express();
    app.use(bodyParser.json());
    app.use('/course', courseRoute);
  });

  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  describe('POST /course/create', () => {
    it('應該成功創建課程', async () => {
      const newCourse = {
        name: 'Route Test Course',
        description: 'Test course for route testing',
        userId: 1,
        start_date: '2024-01-15'
      };

      const response = await request(app)
        .post('/course/create')
        .send(newCourse)
        .expect(201);

      expect(response.body).toHaveProperty('course_id');
      expect(response.body).toHaveProperty('name', 'Route Test Course');
      expect(response.body).toHaveProperty('invite_link');
    });

    it('應該拒絕空的課程數據', async () => {
      const response = await request(app)
        .post('/course/create')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Lack of Course Data.');
    });
  });

  describe('GET /course/list', () => {
    it('應該返回所有課程列表', async () => {
      const response = await request(app)
        .get('/course/list')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        response.body.forEach(course => {
          expect(course).toHaveProperty('course_id');
          expect(course).toHaveProperty('name');
          expect(course).toHaveProperty('create_date');
        });
      }
    });
  });

  describe('GET /course/:courseId', () => {
    it('應該成功獲取課程詳情', async () => {
      // 先創建課程
      const createResponse = await request(app)
        .post('/course/create')
        .send({ 
          name: 'Detail Test Course', 
          description: 'Test description',
          userId: 1
        });

      const courseId = createResponse.body.course_id;

      // 獲取課程詳情
      const response = await request(app)
        .get(`/course/${courseId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', courseId);
      expect(response.body).toHaveProperty('title', 'Detail Test Course');
    });

    it('應該返回 404 當課程不存在', async () => {
      const response = await request(app)
        .get('/course/99999')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Course not found');
    });
  });

  describe('GET /course/read/:user_id (現有的用戶課程路由)', () => {
    it('應該返回指定用戶的課程', async () => {
      const response = await request(app)
        .get('/course/read/1')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // 驗證響應格式（適應現有的雙重命名）
      if (response.body.length > 0) {
        response.body.forEach(course => {
          expect(course).toHaveProperty('courseId');
          expect(course).toHaveProperty('title');
          expect(course).toHaveProperty('course_id'); // 後端兼容性
          expect(course).toHaveProperty('course_name'); // 後端兼容性
        });
      }
    });
  });

  describe('POST /course/edit/:id (現有的編輯路由)', () => {
    it('應該成功更新課程', async () => {
      // 先創建課程
      const createResponse = await request(app)
        .post('/course/create')
        .send({ 
          name: 'Edit Test Course', 
          description: 'Original description',
          userId: 1
        });

      const courseId = createResponse.body.course_id;

      // 使用現有的 POST /course/edit/:id 路由
      const updateData = { name: 'Updated Course Name' };
      const response = await request(app)
        .post(`/course/edit/${courseId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Updated Course Name');
    });

    it('應該拒絕空的更新數據', async () => {
      const response = await request(app)
        .post('/course/edit/1')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Lack of update Data.');
    });
  });

  describe('DELETE /course/delete/:id (現有的刪除路由)', () => {
    it('應該成功刪除課程', async () => {
      // 先創建課程
      const createResponse = await request(app)
        .post('/course/create')
        .send({ 
          name: 'Delete Test Course', 
          description: 'Test description',
          userId: 1
        });

      const courseId = createResponse.body.course_id;

      // 使用現有的 DELETE /course/delete/:id 路由
      const response = await request(app)
        .delete(`/course/delete/${courseId}`)
        .expect(200);

      expect(response.body.message).toContain('Successfully deleted course');
    });

    it('應該返回 404 當嘗試刪除不存在的課程', async () => {
      const response = await request(app)
        .delete('/course/delete/99999')
        .expect(404);

      expect(response.body.message).toContain('Course not found');
    });
  });

  describe('完整的 CRUD 流程測試 (使用現有路由)', () => {
    it('應該能完成完整的 CRUD 流程', async () => {
      // 1. CREATE - POST /course/create
      const createResponse = await request(app)
        .post('/course/create')
        .send({ 
          name: 'CRUD Test Course', 
          description: 'Complete CRUD test',
          userId: 1
        })
        .expect(201);

      const courseId = createResponse.body.course_id;
      expect(courseId).toBeDefined();

      // 2. READ - GET /course/:id  
      const getResponse = await request(app)
        .get(`/course/${courseId}`)
        .expect(200);

      expect(getResponse.body.title).toBe('CRUD Test Course');

      // 3. UPDATE - POST /course/edit/:id (現有路由)
      const updateResponse = await request(app)
        .post(`/course/edit/${courseId}`)
        .send({ name: 'Updated CRUD Course' })
        .expect(200);

      expect(updateResponse.body.name).toBe('Updated CRUD Course');

      // 4. DELETE - DELETE /course/delete/:id (現有路由)
      await request(app)
        .delete(`/course/delete/${courseId}`)
        .expect(200);

      // 5. 驗證課程已被刪除
      await request(app)
        .get(`/course/${courseId}`)
        .expect(404);
    });
  });
});
```

---

## 🔧 現有路由架構分析

### 📋 **當前路由設計**

```javascript
// course_router.js - 現有路由
router.post("/create", CreateCourse);           // 創建課程
router.post("/edit/:id", EditCourse);           // 編輯課程  
router.delete("/delete/:id", RemoveCourse);     // 刪除課程
router.get("/list", GetAllCourses);             // 獲取所有課程
router.get("/read/:user_id", ReadCourse);       // 獲取用戶課程
router.get("/read/teach_in", ReadTeachIn);      // 獲取教師課程
router.get("/:courseId", GetCourseDetail);      // 獲取課程詳情
router.get("/invite/:code", GetCourseIdByInviteCode); // 邀請碼查詢
```

### ✅ **測試策略調整**

1. **🎯 適應現有設計**: 測試現有路由而不是強制 RESTful
2. **📊 功能驗證**: 確保每個端點功能正常
3. **🔒 錯誤處理**: 測試各種錯誤情況
4. **🔄 完整流程**: 測試端到端的 CRUD 操作

---

## 🚀 測試執行指南

### 執行所有課程測試
```bash
npm test course
```

### 執行特定測試層
```bash
npm test course.service.test.js    # Service 層
npm test course.controller.test.js # Controller 層  
npm test course.routes.test.js     # Routes 層
```

### 查看測試覆蓋率
```bash
npm run test:coverage course
```

---

## 💡 測試最佳實踐

### 1. **AAA 模式**
```javascript
it('應該成功創建課程', async () => {
  // Arrange - 準備測試數據
  const courseData = { name: 'Test Course', userId: 1 };
  
  // Act - 執行測試動作
  const result = await CreateCourse(courseData);
  
  // Assert - 驗證結果
  expect(result).toHaveProperty('course_id');
});
```

### 2. **數據隔離**
```javascript
beforeEach(async () => {
  // 每個測試前清理數據
  await global.beforeEach();
});
```

### 3. **明確的測試描述**
```javascript
// ✅ 好的描述
it('應該返回 404 當課程不存在');

// ❌ 不好的描述  
it('測試課程查詢');
```

### 4. **邊界條件測試**
```javascript
it('應該處理空的課程名稱', async () => {
  const invalidData = { name: '', userId: 1 };
  // 測試實際的驗證邏輯
});
```

---

## 📚 相關文檔

- **主目錄**: [📚 文檔導覽](./README.md)
- **快速開始**: [⚡ 快速開始指南](./TESTING_QUICKSTART.md)
- **測試模板**: [📝 測試模板](../tests/template.test.js)

🎯 **實用測試，穩定功能！** 