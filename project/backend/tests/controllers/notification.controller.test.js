import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
    GetNotified,
    NotifiedDeleter,
    Notify
} from '#src/controllers/notification_controller.js';
import {
    FindNotifiedByUserId,
    FindNotificationById,
    DeleteNotifiedById,
    SendNotify
} from '#src/services/notification_service.js';
import { createMockReq, createMockRes } from '../test-utils.js';

// Mock service functions
vi.mock('#src/services/notification_service.js', () => ({
    FindNotifiedByUserId: vi.fn(),
    FindNotificationById: vi.fn(),
    DeleteNotifiedById: vi.fn(),
    SendNotify: vi.fn()
}));

describe('Notification Controller', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('GetNotified', () => {
        it('應該成功取得使用者的通知資料', async () => {
            const req = createMockReq({}, { id: '1' });
            const res = createMockRes();

            FindNotifiedByUserId.mockResolvedValue([
                { n_id: 101 },
                { n_id: 102 }
            ]);
            FindNotificationById.mockResolvedValue({ title: 'New Message' });

            await GetNotified(req, res, () => {});

            expect(FindNotifiedByUserId).toHaveBeenCalledWith(1);
            expect(FindNotificationById).toHaveBeenCalledTimes(2);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalled();
        });

        it('應該回傳 400 當 userId 無效', async () => {
            const req = createMockReq({}, { id: 'abc' });
            const res = createMockRes();

            await GetNotified(req, res, () => {});

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: 'Invalid user_id' });
        });

        it('應該回傳 404 當找不到使用者通知', async () => {
            const req = createMockReq({}, { id: '2' });
            const res = createMockRes();

            FindNotifiedByUserId.mockResolvedValue(null);

            await GetNotified(req, res, () => {});

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ error: 'Post Not Found' });
        });

        it('應該回傳 404 當某個通知找不到', async () => {
            const req = createMockReq({}, { id: '3' });
            const res = createMockRes();

            FindNotifiedByUserId.mockResolvedValue([{ n_id: 999 }]);
            FindNotificationById.mockResolvedValue(null);

            await GetNotified(req, res, () => {});

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ error: 'Notification Not found' });
        });
    });

    describe('NotifiedDeleter', () => {
        it('應該成功刪除通知記錄', async () => {
            const req = createMockReq({ n_id: 1, user_id: 2 });
            const res = createMockRes();

            DeleteNotifiedById.mockResolvedValue({ deletedCount: 1 });

            await NotifiedDeleter(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: { deletedCount: 1 }
            });
        });

        it('應該回傳 400 當 n_id 或 user_id 無效', async () => {
            const res = createMockRes();

            const req1 = createMockReq({ n_id: 'abc', user_id: 2 });
            await NotifiedDeleter(req1, res);
            expect(res.status).toHaveBeenCalledWith(400);

            const req2 = createMockReq({ n_id: 1, user_id: 'def' });
            await NotifiedDeleter(req2, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('應該回傳 404 當無資料被刪除', async () => {
            const req = createMockReq({ n_id: 1, user_id: 2 });
            const res = createMockRes();

            DeleteNotifiedById.mockResolvedValue({ deletedCount: 0 });

            await NotifiedDeleter(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Nothing to delete');
        });

        it('應該回傳 404 當服務返回錯誤訊息', async () => {
            const req = createMockReq({ n_id: 1, user_id: 2 });
            const res = createMockRes();

            DeleteNotifiedById.mockResolvedValue({ error: 'Not found' });

            await NotifiedDeleter(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ error: 'Not found' });
        });
    });

    describe('Notify', () => {
        it('應該成功發送通知', async () => {
            const body = {
                event_id: 1,
                event_category: 'reply',
                context: 'You got a reply',
                notified_userId: [2]
            };
            const req = createMockReq(body);
            const res = createMockRes();

            SendNotify.mockResolvedValue({ success: true });

            await Notify(req, res);

            expect(SendNotify).toHaveBeenCalledWith(body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: { result: { success: true } }
            });
        });

        it('應該回傳 404 當服務返回錯誤訊息', async () => {
            const req = createMockReq({
                event_id: 1,
                event_category: 'like',
                context: 'Someone liked your post',
                notified_userId: [3]
            });
            const res = createMockRes();

            SendNotify.mockResolvedValue({ error: 'User not found' });

            await Notify(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });
});
