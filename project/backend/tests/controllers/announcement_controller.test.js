import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { DeleteAnnouncement } from '#src/controllers/announcement_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';
import mongoose from 'mongoose';

// Helper for test only
async function FindAnnouncementById(a_id) {
    return await mongoose.connection.db.collection('announcement').findOne({ a_id });
}

describe('Announcement Controller', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('DeleteAnnouncement', () => {
        it('應該成功刪除公告', async () => {
            // 假設 a_id 1 已經在 seed 中
            const req = createMockReq({}, { announcementId: 1 });
            const res = createMockRes();

            // 確認公告存在
            const beforeDelete = await FindAnnouncementById(1);
            expect(beforeDelete).toBeDefined();

            await DeleteAnnouncement(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();

            // 確認已刪除
            const afterDelete = await FindAnnouncementById(1);
            expect(afterDelete).toBeNull();
        });

        it('刪除不存在的公告應返回 500', async () => {
            const req = createMockReq({}, { announcementId: 9999 });
            const res = createMockRes();

            await DeleteAnnouncement(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
        });
    });
});