import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { EditCourseName } from '#src/services/course_service.js'; 

describe('Course Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('EditCourseName', () => {
        it('應該成功更新課程名稱', async () => {
            const courseId = 1; 
            const newName = '更新後的課程名稱';

            const result = await EditCourseName(courseId, newName);

            expect(result).toBeDefined();
            expect(result.name).toBe(newName);
            expect(result.course_id).toBe(courseId);
        });

        it('當課程不存在時應該拋出錯誤', async () => {
            const nonExistentId = 9999;
            const newName = '無效課程名稱';

            await expect(EditCourseName(nonExistentId, newName)).rejects.toThrow(
                `Course with ID ${nonExistentId} not found`
            );
        });

        it('當名稱為空字串時應該拋出錯誤', async () => {
            const courseId = 1;
            const invalidName = '   ';

            await expect(EditCourseName(courseId, invalidName)).rejects.toThrow(
                'New course name must be a non-empty string'
            );
        });
    });
});
