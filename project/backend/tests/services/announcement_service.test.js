import mongoose from "mongoose";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { DeleteAnnouncementByAnnouncementID } from '#src/services/announcement_service.js';

// Helper for test only
async function FindAnnouncementById(a_id) {
    return await mongoose.connection.db.collection('announcement').findOne({ a_id });
}

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
});