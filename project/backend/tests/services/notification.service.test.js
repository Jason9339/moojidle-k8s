import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';

import {
    InsertNotification,
    InsertNotified,
    FindNotificationById,
    FindNotifiedByUserId,
    DeleteNotifiedById,
    SendNotification,
    SendNotified,
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
            await mongoose.connection.db.collection('notification').deleteOne({ n_id: result.notification_id });
            await mongoose.connection.db.collection('notified').deleteMany({ n_id: result.notification_id });
        });
    });

    describe('InsertNotification + FindNotificationById', () => {
        it('成功新增並查詢通知', async () => {
            const data = {
                event_id: 200,
                event_category: 'course',
                context: 'insert then find',
                notified_date: new Date()
            };

            const result = await InsertNotification(data);
            expect(result).toBeDefined();
            const insertedId = result.n_id;

            const found = await FindNotificationById(insertedId);
            expect(found).toBeDefined();
            expect(found.context).toBe('insert then find');

            // 清除測試資料
            await mongoose.connection.db.collection('notification').deleteOne({ n_id: insertedId });
        });
    });

    describe('InsertNotified + FindNotifiedByUserId', () => {
        it('成功新增並查詢 Notified', async () => {
            const notification = await InsertNotification({
                event_id: 300,
                event_category: 'course',
                context: 'InsertNotified test',
                notified_date: new Date()
            });

            const n_id = notification.n_id;
            const user_id = 3001;

            const notifiedResult = await InsertNotified({ n_id, user_id });
            expect(notifiedResult.insertedId).toBeDefined();

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
            const notification = await InsertNotification({
                event_id: 400,
                event_category: 'course',
                context: 'delete test',
                notified_date: new Date()
            });

            const n_id = notification.n_id;
            const user_id = 4001;

            await InsertNotified({ n_id, user_id });
            
            const deleteResult = await DeleteNotifiedById({ n_id, user_id });
            expect(deleteResult.deletedCount).toBe(1);

            // 清除通知資料
            await mongoose.connection.db.collection('notification').deleteOne({ n_id });
        });
    });

    describe('NotificationReaded', () => {
        it('成功更改notification已讀狀態', async () => {
            const notified1 = await FindNotifiedByUserId(2);
            expect(notified1[0].is_read).toBe(false);
            await NotificationReaded({
                n_id: 1,
                user_id: 2
            });
            
            const notified2 = await FindNotifiedByUserId(2);
            expect(notified2[0].is_read).toBe(true);
        });
    });
});
