
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createMockReq, createMockRes } from '../test-utils.js';

import {
    GetSubmissionsByAssignmentId,
    ReviewAssignmentSubmissionService,

} from "#src/services/submit_assignment_service.js";



describe('Assignment Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);


    describe("GetSubmissionsByAssignmentId", () => {
        it('應該成功獲取繳交作業的資訊', async () => {
            const assignmentId = 1;
            const result = await GetSubmissionsByAssignmentId(assignmentId);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);

            const result_0 = result[0]; // 取第一筆資料進行驗證

            expect(result_0.s_ass_id).toBe(1);
            expect(result_0.ass_id).toBe(1);
            expect(result_0.submit_by_user_id).toBe(3);
            expect(result_0.submit_user_course_tag).toBe("User3's CustomTag_1");
            expect(result_0.submit_date).toEqual(new Date("2025-01-14T00:00:00.000Z"));
            expect(result_0.score).toBe(100);
            expect(result_0.graded_by_user_id).toBe(2);
            expect(result_0.attachments).toBeDefined();
            expect(Array.isArray(result_0.attachments)).toBe(true);
            expect(result_0.attachments.length).toBe(1);
            expect(result_0.attachments[0].filename).toBe("submitted_assignment_1_file_1.pdf");
            expect(result_0.description).toBe("This is the submission for Assignment 1 by User 3.");
        });

        it('當作業不存在時應該返回空陣列', async () => {
            const assignmentId = 999;
            const result = await GetSubmissionsByAssignmentId(assignmentId);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
    });

    describe("ReviewAssignmentSubmissionService", () => {
        it('應該成功修改繳交作業的分數', async () => {
            const submitAssignmentId = 1;
            const score = 95;
            const graderId = 1;

            const result = await ReviewAssignmentSubmissionService(submitAssignmentId, score, graderId);

            expect(result).toBeDefined();
            expect(result.updated).toBe(true);

            // 驗證分數確實被更新
            const submissions = await GetSubmissionsByAssignmentId(1);
            const updatedSubmission = submissions.find(sub => sub.s_ass_id === 1);
            expect(updatedSubmission.score).toBe(95);
            expect(updatedSubmission.graded_by_user_id).toBe(1);
        });

        it('當提交不存在時應該返回錯誤', async () => {
            const submitAssignmentId = 999;
            const score = 85;
            const graderId = 1;

            await expect(ReviewAssignmentSubmissionService(submitAssignmentId, score, graderId))
            .rejects.toThrow();
        });

        it('應該驗證分數範圍', async () => {
            const submitAssignmentId = 1;
            const invalidScore = -10;
            const graderId = 1;

            await expect(ReviewAssignmentSubmissionService(submitAssignmentId, invalidScore, graderId))
            .rejects.toThrow();
        });

        it('應該驗證分數上限', async () => {
            const submitAssignmentId = 1;
            const invalidScore = 150;
            const graderId = 1;

            await expect(ReviewAssignmentSubmissionService(submitAssignmentId, invalidScore, graderId))
            .rejects.toThrow();
        });
    });



});

