import mongoose from "mongoose";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { DeleteAnnouncementByAnnouncementID, FindAnnouncementByCourseId, InsertAnnouncement } from '#src/services/announcement_service.js';

// Helper for test only
async function FindAnnouncementById(a_id) {
    return await mongoose.connection.db.collection('announcement').findOne({ a_id });
}

// async function InsertTestAnnouncement(courseId, context, user_id, announce_date) {
//     return await InsertAnnouncement(courseId, context, user_id, announce_date);
// }

describe('Announcement Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('DeleteAnnouncementByAnnouncementID', () => {
        it('應該成功刪除公告', async () => {
            const a_id = 1;

            // 確認公告存在
            const beforeDelete = await FindAnnouncementById(a_id);
            expect(beforeDelete).toBeDefined();

            // 執行刪除
            await DeleteAnnouncementByAnnouncementID(a_id);

            // 確認已刪除
            const afterDelete = await FindAnnouncementById(a_id);
            expect(afterDelete).toBeNull();
        });

        it('刪除不存在的公告應拋出錯誤', async () => {
            await expect(DeleteAnnouncementByAnnouncementID(9999)).rejects.toThrow('Announcement not found');
        });
    });

    // describe('FindAnnouncementByCourseId', () => {
    //     it('應該只回傳 announce_date <= 現在的公告', async () => {
    //         const courseId = 101;
    //         const user_id = 1;
    //         const now = new Date();
    //         const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    //         const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    //         // 插入過去公告
    //         await InsertTestAnnouncement(courseId, "過去公告", user_id, pastDate);
    //         // 插入未來公告
    //         await InsertTestAnnouncement(courseId, "未來公告", user_id, futureDate);

    //         // 只查詢 announce_date <= 現在
    //         const results = await FindAnnouncementByCourseId(courseId, false);
    //         const contexts = results.map(a => a.context);

    //         expect(contexts).toContain("過去公告");
    //         expect(contexts).not.toContain("未來公告");
    //     });

    //     it('showFuture=true 時應該回傳所有公告', async () => {
    //         const courseId = 102;
    //         const user_id = 1;
    //         const now = new Date();
    //         const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    //         const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    //         // 插入過去公告
    //         await InsertTestAnnouncement(courseId, "過去公告2", user_id, pastDate);
    //         // 插入未來公告
    //         await InsertTestAnnouncement(courseId, "未來公告2", user_id, futureDate);

    //         // 查詢所有公告
    //         const results = await FindAnnouncementByCourseId(courseId, true);
    //         const contexts = results.map(a => a.context);

    //         expect(contexts).toContain("過去公告2");
    //         expect(contexts).toContain("未來公告2");
    //     });
    // });
});