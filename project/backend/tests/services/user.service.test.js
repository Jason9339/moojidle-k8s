import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    RegisterUser,
    LoginUser,
    DeleteUser,
    FindOneUserById,
    FindOnesTagById,
    UpdateUserPassword
} from '#src/services/user_service.js';

describe('User Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('FindOneUserById', () => {
        it('應該根據 user_id 找到用戶', async () => {
            const user = await FindOneUserById(1);

            expect(user).toBeDefined();
            expect(user.user_id).toBe(1);
            expect(user.name).toBe('User 1');
            expect(user.email).toBe('user1@example.com');
        });

        it('當用戶不存在時應該返回 null', async () => {
            const user = await FindOneUserById(999);

            expect(user).toBeNull();
        });
    });

    describe('RegisterUser', () => {
        it('應該成功註冊新用戶', async () => {
            const userData = {
                name: 'New User',
                email: 'newuser@example.com',
                password: 'newpassword123'
            };

            const result = await RegisterUser(userData);

            expect(result).toBeDefined();
            expect(result.insertedId).toBeDefined();

            // 使用登入來驗證用戶是否真的被創建
            const createdUser = await LoginUser('newuser@example.com', 'newpassword123');
            expect(createdUser).toBeDefined();
            expect(createdUser.name).toBe('New User');
            expect(createdUser.email).toBe('newuser@example.com');
        });

        it('當 email 已存在時應該返回 null', async () => {
            const userData = {
                name: 'Duplicate User',
                email: 'user1@example.com', // 使用已存在的 email
                password: 'password123'
            };

            const result = await RegisterUser(userData);

            expect(result).toBeNull();
        });
    });

    describe('LoginUser', () => {
        it('應該成功登入有效用戶', async () => {
            const user = await LoginUser('user1@example.com', 'hashed_password_1');

            expect(user).toBeDefined();
            expect(user.user_id).toBe(1);
            expect(user.email).toBe('user1@example.com');
        });

        it('當密碼錯誤時應該返回 null', async () => {
            const user = await LoginUser('user1@example.com', 'wrongpassword');

            expect(user).toBeNull();
        });

        it('當 email 不存在時應該返回 null', async () => {
            const user = await LoginUser('nonexistent@example.com', 'password123');

            expect(user).toBeNull();
        });
    });

    describe('DeleteUser', () => {
        it('應該成功刪除用戶', async () => {
            // 創建一個專用於刪除測試的用戶
            const testUserData = {
                name: 'User To Delete',
                email: 'delete@test.com',
                password: 'deletetest123'
            };

            const createResult = await RegisterUser(testUserData);
            expect(createResult).toBeDefined();
            expect(createResult.insertedId).toBeDefined();

            // 通過 email 找到剛創建的用戶
            const createdUser = await LoginUser('delete@test.com', 'deletetest123');
            expect(createdUser).toBeDefined();
            expect(createdUser.email).toBe('delete@test.com');

            const userIdToDelete = createdUser.user_id;

            // 現在刪除這個用戶
            const deleteResult = await DeleteUser(userIdToDelete);
            expect(deleteResult.deletedCount).toBe(1);

            // 驗證用戶是否真的被刪除
            const deletedUser = await FindOneUserById(userIdToDelete);
            expect(deletedUser).toBeNull();
        });

        it('當用戶不存在時應該返回 deletedCount 為 0', async () => {
            const result = await DeleteUser(999);

            expect(result.deletedCount).toBe(0);
        });
    });

    describe('FindOnesTagById', () => {
        it('應該找到用戶的標籤', async () => {
            const tags = await FindOnesTagById(1);

            expect(tags).toBeDefined();
            expect(Array.isArray(tags)).toBe(true);
            expect(tags.length).toBeGreaterThan(0);
            expect(tags[0].user_id).toBe(1);
            expect(tags[0].user_tag).toBe("User1's CustomTag_1");
        });

        it('當用戶沒有標籤時應該返回空數組', async () => {
            const tags = await FindOnesTagById(999);

            expect(tags).toBeDefined();
            expect(Array.isArray(tags)).toBe(true);
            expect(tags.length).toBe(0);
        });
    });

    describe('UpdateUserPassword', () => {
        it('應該成功更新用戶密碼', async () => {
            const result = await UpdateUserPassword(1, 'newpassword123');

            expect(result.modifiedCount).toBe(1);

            // 驗證密碼是否真的被更新
            const user = await LoginUser('user1@example.com', 'newpassword123');
            expect(user).toBeDefined();
            expect(user.user_id).toBe(1);
        });

        it('當用戶不存在時應該返回 modifiedCount 為 0', async () => {
            const result = await UpdateUserPassword(999, 'newpassword123');

            expect(result.modifiedCount).toBe(0);
        });
    });
}); 