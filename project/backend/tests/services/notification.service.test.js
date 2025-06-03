import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';

import {
    SendNotification,
    SendNotified,
    FindNotificationById,
    FindNotifiedByUserId,
    DeleteNotifiedById,
    NotificationReaded
} from '#src/services/notification_service';

describe('Notification Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('SendNotify', () => {
        it('成功新建通知並發送給 user', async () => {
            const notificationData = {
                event_id: 100,
                event_category: "course",
                context: "CI test for SendNotify",
                notified_users: [{ user_id: 1001 }]
            };

            const result = await SendNotification(notificationData);
            const notifiedres = await SendNotified(result.notification.n_id, notificationData.notified_users);

            expect(result).toBeDefined();
            expect(result.notification.event_id).toBe(100);
            expect(result.notification.event_category).toBe("course");
            expect(result.notification.context).toBe("CI test for SendNotify");

            const notified = notifiedres[0];
            expect(notified.acknowledged).toBe(true);

            // 清理測試資料
            await mongoose.connection.db.collection('notification').deleteOne({ n_id: result.notification.n_id });
            await mongoose.connection.db.collection('notified').deleteMany({ n_id: result.notification.n_id });
        });
    });

    describe('SendNotification + FindNotificationById', () => {
        it('成功新增並查詢通知', async () => {
            const data = {
                event_id: 200,
                event_category: 'course',
                context: 'send then find',
                notified_users: []  // 不發送任何通知人
            };

            const result = await SendNotification(data);
            expect(result).toBeDefined();
            const insertedId = result.notification.n_id;

            const found = await FindNotificationById(insertedId);
            expect(found).toBeDefined();
            expect(found.context).toBe('send then find');

            // 清除測試資料
            await mongoose.connection.db.collection('notification').deleteOne({ n_id: insertedId });
        });
    });

    describe('SendNotified + FindNotifiedByUserId', () => {
        it('成功新增並查詢 Notified', async () => {
            const notificationResult = await SendNotification({
                event_id: 300,
                event_category: 'course',
                context: 'SendNotified test',
                notified_users: []
            });

            const n_id = notificationResult.notification.n_id;
            const user_id = 3001;

            const notifiedResult = await SendNotified(n_id, [{ user_id }]);
            expect(notifiedResult[0].acknowledged).toBe(true);

            const notifiedList = await FindNotifiedByUserId(user_id);
            const match = notifiedList.find(n => n.n_id === n_id);
            expect(match).toBeDefined();

            // 清理測試資料
            await mongoose.connection.db.collection('notification').deleteOne({ n_id });
            await mongoose.connection.db.collection('notified').deleteOne({ n_id, user_id });
        });
    });

    describe('DeleteNotifiedById', () => {
        it('成功刪除 Notified', async () => {
            const notificationResult = await SendNotification({
                event_id: 400,
                event_category: 'course',
                context: 'delete test',
                notified_users: []
            });

            const n_id = notificationResult.notification.n_id;
            const user_id = 4001;

            await SendNotified(n_id, [{ user_id }]);

            const deleteResult = await DeleteNotifiedById({ n_id, user_id });
            expect(deleteResult.deletedCount).toBe(1);

            // 清除通知資料
            await mongoose.connection.db.collection('notification').deleteOne({ n_id });
        });
    });

    describe('NotificationReaded', () => {
        it('成功更改notification已讀狀態', async () => {
            const notificationResult = await SendNotification({
                event_id: 500,
                event_category: 'course',
                context: 'read test',
                notified_users: []
            });

            const n_id = notificationResult.notification.n_id;
            const user_id = 5002;

            await SendNotified(n_id, [{ user_id }]);

            const before = await FindNotifiedByUserId(user_id);
            expect(before[0].is_read).toBe(false);

            await NotificationReaded({ n_id, user_id });

            const after = await FindNotifiedByUserId(user_id);
            expect(after[0].is_read).toBe(true);

            // 清理
            await mongoose.connection.db.collection('notification').deleteOne({ n_id });
            await mongoose.connection.db.collection('notified').deleteOne({ n_id, user_id });
        });
    });
});
