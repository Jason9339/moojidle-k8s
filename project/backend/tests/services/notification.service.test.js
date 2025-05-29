import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

import { 
    InsertNotification,
    InsertNotified,
    FindNotificationById,
    FindNotifiedByUserId
} from '#src/services/notification_service'

describe('Notification Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('FindNotificationById', () => {
        it('成功回傳通知', async () => {
            const result = await FindNotificationById(1);

            expect(result).toBeDefined();
            expect(result.n_id).toBe(1);
            expect(result.event_id).toBe(1);
            expect(result.event_category).toBe("course");
            expect(result.context).toBe("Successfully enrolled in a course");
        });
    });

    describe('FindNotifiedByUserId', () => {
        it('成功回傳user所有通知', async () => {
            const result = await FindNotifiedByUserId(2);

            expect(result).toBeDefined();
            expect(result[0].n_id).toBe(1);
            expect(result[0].user_id).toBe(2);
            expect(result[0].is_read).toBe(false);
        });
    });


    describe('CreateNotification', () => {
        it('成功新增通知', async () => {
            const notification_date = new Date();

            const notificationData = {
                event_id: 1,
                event_category: 'cource',
                context: 'add to cource',
                notified_date: notification_date
            };

            const result = await InsertNotification(notificationData);

            expect(result).toBeDefined();
            expect(result.insertedId).toBeDefined();

            // 使用FindNotificationById確認notification有被新增
            const createdNotification = await FindNotificationById(2);
            expect(createdNotification).toBeDefined();
            expect(createdNotification.event_category).toBe('cource');
            expect(createdNotification.context).toBe('add to cource');
        });
    });

    describe('InsertNotified', () => {
        it('成功新增被通知者', async () => {

            const notifiedData = {
                n_id: 1,
                user_id: 1,
            };

            const result = await InsertNotified(notifiedData);

            expect(result).toBeDefined();
            expect(result.insertedId).toBeDefined();

            // 使用FindNotificationById確認notified有被新增
            const createdNotified = await FindNotifiedByUserId(1);
            expect(createdNotified).toBeDefined();
            expect(createdNotified[0].n_id).toBe(1);
            expect(createdNotified[0].user_id).toBe(1);
        });
    });
}); 