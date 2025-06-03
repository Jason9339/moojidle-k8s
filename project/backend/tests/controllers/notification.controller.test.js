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
    SendNotification,
    SendNotified
} from '#src/services/notification_service.js';
import { createMockReq, createMockRes } from '../test-utils.js';

// Mock service functions
vi.mock('#src/services/notification_service.js', () => ({
    FindNotifiedByUserId: vi.fn(),
    FindNotificationById: vi.fn(),
    DeleteNotifiedById: vi.fn(),
    SendNotification: vi.fn(),
    SendNotified: vi.fn()
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
        it('應該成功發送通知並記錄被通知者', async () => {
            const body = {
                event_id: 1,
                event_category: 'reply',
                context: 'You got a reply',
                notified_users: [2, 3]
            };
            const req = createMockReq(body);
            const res = createMockRes();

            const fakeNotification = { n_id: 99 };
            SendNotification.mockResolvedValue({ notification: fakeNotification });
            SendNotified.mockResolvedValue(true);

            await Notify(req, res);

            expect(SendNotification).toHaveBeenCalledWith(body);
            expect(SendNotified).toHaveBeenCalledWith(fakeNotification.n_id, body.notified_users);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: { result: { notification: fakeNotification } } });
        });

        it('應該回傳 500 當發生例外錯誤', async () => {
            const body = {
                event_id: 2,
                event_category: 'mention',
                context: 'You were mentioned',
                notified_users: [5]
            };
            const req = createMockReq(body);
            const res = createMockRes();

            SendNotification.mockRejectedValue(new Error('Unexpected error'));

            await Notify(req, res);

            expect(SendNotification).toHaveBeenCalledWith(body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ error: "An unexpected error occurred" });
        });
    });
});
