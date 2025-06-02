
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createMockReq, createMockRes } from '../test-utils.js';

import {
    FindAssignmentsByCourseId,
    FindAssignmentMaxScore,
    FindCourseIdByAssignmentId

} from "#src/services/assignment_service.js";



describe('Assignment Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe("GetCourseIdByAssignmentId", () => {
        it('應該成功獲取繳交作業所在的課程Id', async () => {
            const assignmentId = 1;
            const result = await FindCourseIdByAssignmentId(assignmentId);

            expect(result).toBeDefined();
            expect(result).toBe(1);
        });

        it('當作業不存在時應該返回null', async () => {
            const assignmentId = 999;
            const result = await FindCourseIdByAssignmentId(assignmentId);

            expect(result).toBeNull();
        });
    });

    describe('FindAssignmentsByCourseId', () => {
        it('應該要根據CourseId找到其之下的作業', async () => {
            const assignments = await FindAssignmentsByCourseId(1);

            expect(assignments).toBeDefined();
            expect(Array.isArray(assignments)).toBe(true);
            expect(assignments.length).toBe(1);

            const assignment = assignments[0];
            expect(assignment.ass_id).toBe(1);
            expect(assignment.in_course_id).toBe(1);
            expect(assignment.ass_name).toBe('Assignment 1 for Course 1');
            expect(assignment.max_score).toBe(100);
            expect(assignment.percentage).toBe(0.1);
            expect(assignment.description).toBe('This is the description for Assignment 1.');
            expect(Array.isArray(assignment.attachments)).toBe(true);
        });

        it('當課程不存在時應該返回空陣列', async () => {
            const assignments = await FindAssignmentsByCourseId(999);
            expect(Array.isArray(assignments)).toBe(true);
            expect(assignments.length).toBe(0);
        });
    });

    describe('GetAssignmentMaxScore', () => {
        it('應該要取得作業最大分數'), async () => {
            const assignmentId = 1;
            const maxScore = FindAssignmentMaxScore(assignmentId);
            expect(maxScore).toBe(100)
        }
    })


});

