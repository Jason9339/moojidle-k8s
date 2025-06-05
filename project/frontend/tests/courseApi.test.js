import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js';

import { EditCourseName } from '@/services/CourseApi.js';
import { GetCourses } from '@/services/CourseApi.js'; // 假設你有這支 API

describe('CourseApi Integration Test', () => {
    beforeAll(async () => {
        await WaitForBackendReady();
    });

    beforeEach(async () => {
        await ResetBackendDatabase(); // 保證每次測試課程都存在
    });

    describe('EditCourseName integration test', () => {
        it('成功更新課程名稱，並可從後端讀到新名稱', async () => {
            const courseId = 1;
            const newName = '更新後的課程名稱';

            const result = await EditCourseName(courseId, newName);

            expect(result).toBeDefined();
            expect(result.name).toBe(newName);
            expect(result.course_id).toBe(courseId);

            // 二次驗證：透過查詢 API 取得課程名稱
            const course = await GetCourses(courseId);
            expect(course[0].course_name).toBe(newName);
        });

        it('若課程不存在，應拋出錯誤', async () => {
            const courseId = 9999;
            const newName = '無效課程名稱';

            try {
                await EditCourseName(courseId, newName);
                throw new Error('應該要失敗但沒有失敗');
            } catch (err) {
                expect(err.response).toBeDefined();
                expect(err.response.status).toBe(500);
                expect(err.response.data.message).toBe('Failed to Edit course');
            }
        });

        it('若名稱為空字串，應拋出錯誤', async () => {
            const courseId = 1;
            const newName = '   ';

            try {
                await EditCourseName(courseId, newName);
                throw new Error('應該要失敗但沒有失敗');
            } catch (err) {
                expect(err.response).toBeDefined();
                expect(err.response.status).toBe(500);
                expect(err.response.data.error).toContain('non-empty string');
            }
        });
    });
});
