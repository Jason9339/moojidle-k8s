import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
    Register,
    Login,
    Delete,
    GetUserData,
    GetUserTags,
    UpdatePassword
} from '#src/controllers/user_controller.js';

describe('User Controller', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    // 輔助函數創建 mock req 和 res 對象
    const createMockReq = (body = {}, params = {}) => ({
        body,
        params
    });

    const createMockRes = () => {
        const res = {};
        res.status = vi.fn().mockReturnValue(res);
        res.send = vi.fn().mockReturnValue(res);
        return res;
    };

    describe('Register', () => {
        it('應該成功註冊新用戶', async () => {
            const req = createMockReq({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'password123'
            });
            const res = createMockRes();

            await Register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                message: 'User registered successfully'
            });
        });

        it('當缺少必填欄位時應該返回 400 錯誤', async () => {
            const req = createMockReq({
                name: 'New User',
                // 缺少 email 和 password
            });
            const res = createMockRes();

            await Register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: 'All fields are required'
            });
        });

        it('當 email 已存在時應該返回 500 錯誤', async () => {
            const req = createMockReq({
                name: 'Duplicate User',
                email: 'user1@example.com', // 已存在的 email
                password: 'password123'
            });
            const res = createMockRes();

            await Register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Failed to register user'
            });
        });
    });

    describe('Login', () => {
        it('應該成功登入有效用戶', async () => {
            const req = createMockReq({
                email: 'user1@example.com',
                pw: 'hashed_password_1'
            });
            const res = createMockRes();

            await Login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                user_id: 1,
                name: 'User 1',
                email: 'user1@example.com'
            });
        });

        it('當缺少 email 或密碼時應該返回 400 錯誤', async () => {
            const req = createMockReq({
                email: 'user1@example.com'
                // 缺少 pw
            });
            const res = createMockRes();

            await Login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Email and password are required'
            });
        });

        it('當 email 或密碼錯誤時應該返回 401 錯誤', async () => {
            const req = createMockReq({
                email: 'user1@example.com',
                pw: 'wrongpassword'
            });
            const res = createMockRes();

            await Login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Invalid email or password'
            });
        });
    });

    describe('Delete', () => {
        it('應該成功刪除用戶', async () => {
            const req = createMockReq({}, { id: '1' });
            const res = createMockRes();

            await Delete(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: 'User deleted successfully'
            });
        });

        it('當用戶不存在時應該返回 404 錯誤', async () => {
            const req = createMockReq({}, { id: '999' });
            const res = createMockRes();

            await Delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: 'User not found'
            });
        });
    });

    describe('GetUserData', () => {
        it('應該成功獲取用戶數據包括標籤', async () => {
            const req = createMockReq({}, { userId: '1' });
            const res = createMockRes();

            await GetUserData(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            // 檢查返回的數據結構
            const sentData = res.send.mock.calls[0][0];
            expect(sentData.user_id).toBe(1);
            expect(sentData.name).toBe('User 1');
            expect(sentData.email).toBe('user1@example.com');
            expect(sentData.user_tags).toBeDefined();
            expect(Array.isArray(sentData.user_tags)).toBe(true);
        });

        it('當用戶不存在時應該返回 404 錯誤', async () => {
            const req = createMockReq({}, { userId: '999' });
            const res = createMockRes();

            await GetUserData(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: 'User not found'
            });
        });
    });

    describe('GetUserTags', () => {
        it('應該成功獲取用戶標籤', async () => {
            const req = createMockReq({}, { userId: '1' });
            const res = createMockRes();

            await GetUserTags(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const sentData = res.send.mock.calls[0][0];
            expect(Array.isArray(sentData)).toBe(true);
            expect(sentData.length).toBeGreaterThan(0);
            expect(sentData[0].user_id).toBe(1);
        });
    });

    describe('UpdatePassword', () => {
        it('應該成功更新密碼', async () => {
            const req = createMockReq({
                currentPassword: 'hashed_password_1',
                newPassword: 'newpassword123'
            }, { id: '1' });
            const res = createMockRes();

            await UpdatePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Password updated successfully'
            });
        });

        it('當缺少必填欄位時應該返回 400 錯誤', async () => {
            const req = createMockReq({
                currentPassword: 'hashed_password_1'
                // 缺少 newPassword
            }, { id: '1' });
            const res = createMockRes();

            await UpdatePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Current password and new password are required'
            });
        });

        it('當用戶不存在時應該返回 404 錯誤', async () => {
            const req = createMockReq({
                currentPassword: 'hashed_password_1',
                newPassword: 'newpassword123'
            }, { id: '999' });
            const res = createMockRes();

            await UpdatePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: 'User not found'
            });
        });

        it('當現有密碼錯誤時應該返回 401 錯誤', async () => {
            const req = createMockReq({
                currentPassword: 'wrongpassword',
                newPassword: 'newpassword123'
            }, { id: '1' });
            const res = createMockRes();

            await UpdatePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Current password is incorrect'
            });
        });
    });
}); 