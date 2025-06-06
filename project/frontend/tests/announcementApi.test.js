import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js';

import { DeleteAnnouncement, GetAnnouncements } from '@/services/AnnouncementApi.js';

describe('前端 Announcement API 整合測試', () => {
    beforeAll(async () => {
        await WaitForBackendReady();
        console.log('🎯 前端 Announcement 整合測試環境準備完成');
    });

    beforeEach(async () => {
        await ResetBackendDatabase();
    });

    describe('DeleteAnnouncement 整合測試', () => {
        it('應該成功刪除公告', async () => {
            // 先確認公告存在
            const courseId = 1;
            const announcements = await GetAnnouncements(courseId);
            expect(announcements.length).toBeGreaterThan(0);

            const announcementId = announcements[0].a_id || announcements[0].id;
            await DeleteAnnouncement(announcementId);

            // 再次查詢，確認已刪除
            const afterDelete = await GetAnnouncements(courseId);
            const exists = afterDelete.some(a => (a.a_id || a.id) === announcementId);
            expect(exists).toBe(false);
        });

        it('刪除不存在的公告應該拋出錯誤', async () => {
            let error;
            try {
                await DeleteAnnouncement(9999);
            } catch (err) {
                error = err;
            }
            expect(error).toBeDefined();
        });
    });
});