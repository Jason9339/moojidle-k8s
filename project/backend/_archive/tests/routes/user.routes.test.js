import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import userRoute from '#src/routes/user_route.js';

describe('User Routes Integration Tests', () => {
  let app;

  beforeAll(async () => {
    await global.beforeAll();
    
    // 設置測試用的 Express 應用
    app = express();
    app.use(bodyParser.json());
    app.use('/user', userRoute);
  });

  afterAll(global.afterAll);
  beforeEach(global.beforeEach);

  describe('GET /user/get-user-by-id/:userId', () => {
    it('應該成功獲取用戶數據', async () => {
      const response = await request(app)
        .get('/user/get-user-by-id/1')
        .expect(200);

      expect(response.body).toHaveProperty('user_id', 1);
      expect(response.body).toHaveProperty('name', 'User 1');
      expect(response.body).toHaveProperty('email', 'user1@example.com');
      expect(response.body).toHaveProperty('user_tags');
      expect(Array.isArray(response.body.user_tags)).toBe(true);
    });

    it('當用戶不存在時應該返回 404', async () => {
      const response = await request(app)
        .get('/user/get-user-by-id/999')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('GET /user/get-user-tags-by-id/:userId', () => {
    it('應該成功獲取用戶標籤', async () => {
      const response = await request(app)
        .get('/user/get-user-tags-by-id/1')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('user_id', 1);
      expect(response.body[0]).toHaveProperty('user_tag');
    });

    it('當用戶沒有標籤時應該返回空數組', async () => {
      const response = await request(app)
        .get('/user/get-user-tags-by-id/999')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('POST /user/register', () => {
    it('應該成功註冊新用戶', async () => {
      const newUser = {
        name: 'New Test User',
        email: 'newtest@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/user/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('當缺少必填欄位時應該返回 400', async () => {
      const incompleteUser = {
        name: 'Incomplete User',
        // 缺少 email 和 password
      };

      const response = await request(app)
        .post('/user/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'All fields are required');
    });

    it('當 email 已存在時應該返回 500', async () => {
      const duplicateUser = {
        name: 'Duplicate User',
        email: 'user1@example.com', // 已存在的 email
        password: 'password123'
      };

      const response = await request(app)
        .post('/user/register')
        .send(duplicateUser)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Failed to register user');
    });
  });

  describe('POST /user/login', () => {
    it('應該成功登入有效用戶', async () => {
      const loginData = {
        email: 'user1@example.com',
        pw: 'hashed_password_1'
      };

      const response = await request(app)
        .post('/user/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('user_id', 1);
      expect(response.body).toHaveProperty('name', 'User 1');
      expect(response.body).toHaveProperty('email', 'user1@example.com');
    });

    it('當缺少 email 或密碼時應該返回 400', async () => {
      const incompleteLogin = {
        email: 'user1@example.com'
        // 缺少 pw
      };

      const response = await request(app)
        .post('/user/login')
        .send(incompleteLogin)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    it('當 email 或密碼錯誤時應該返回 401', async () => {
      const wrongLogin = {
        email: 'user1@example.com',
        pw: 'wrongpassword'
      };

      const response = await request(app)
        .post('/user/login')
        .send(wrongLogin)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('DELETE /user/delete/:id', () => {
    it('應該成功刪除用戶', async () => {
      const response = await request(app)
        .delete('/user/delete/1')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('當用戶不存在時應該返回 404', async () => {
      const response = await request(app)
        .delete('/user/delete/999')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PUT /user/update-password/:id', () => {
    it('應該成功更新密碼', async () => {
      const passwordUpdate = {
        currentPassword: 'hashed_password_1',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/user/update-password/1')
        .send(passwordUpdate)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Password updated successfully');
    });

    it('當缺少必填欄位時應該返回 400', async () => {
      const incompleteUpdate = {
        currentPassword: 'hashed_password_1'
        // 缺少 newPassword
      };

      const response = await request(app)
        .put('/user/update-password/1')
        .send(incompleteUpdate)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Current password and new password are required');
    });

    it('當用戶不存在時應該返回 404', async () => {
      const passwordUpdate = {
        currentPassword: 'hashed_password_1',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/user/update-password/999')
        .send(passwordUpdate)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('當現有密碼錯誤時應該返回 401', async () => {
      const wrongPasswordUpdate = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .put('/user/update-password/1')
        .send(wrongPasswordUpdate)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Current password is incorrect');
    });
  });
}); 