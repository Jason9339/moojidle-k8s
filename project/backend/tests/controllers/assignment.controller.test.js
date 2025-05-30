import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    GetCourseAssignments
} from '#src/controllers/assignment_controller.js';

import CalculateWeek from '#src/utils/calculate_week.js';
import { createMockReq, createMockRes } from '../test-utils.js';

describe('Assignment Controller', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('GetCourseAssignments', () => {
        it('應該根據課程ID正確取得作業列表', async () => {
            const req = createMockReq({}, { courseId: 1 });
            const res = createMockRes();

            await GetCourseAssignments(req, res);

            expect(res.json).toHaveBeenCalledTimes(1);
            const assignments = res.json.mock.calls[0][0];

            expect(Array.isArray(assignments)).toBe(true);
            expect(assignments.length).toBe(1);

            const assignment = assignments[0];
            expect(assignment.id).toBe(1);
            expect(assignment.name).toBe('Assignment 1 for Course 1');
            expect(assignment.description).toBe('This is the description for Assignment 1.');
            expect(assignment.attachments.length).toBe(1);
            expect(assignment.dueDate).toBeDefined();
            expect(assignment.startDate).toBeDefined();
            expect(assignment.week).toBe(2);
        });

        it('要算對週數', () => {
            // 假設課程 1 的 start_date 是 2025-01-01
            const courseStartDate = '2025-01-01T00:00:00.000Z';
            // 作業開始日是 2025-01-08，應該是第 2 週
            const assignmentStartDate = '2025-01-08T00:00:00.000Z';

            const week = CalculateWeek(courseStartDate, assignmentStartDate, 16);
            expect(week).toBe(2);

            // 測試第一週
            const week1 = CalculateWeek(courseStartDate, courseStartDate, 16);
            expect(week1).toBe(1);

            // 測試超過課程週數
            const week17 = CalculateWeek(courseStartDate, '2025-05-10T00:00:00.000Z', 16);
            expect(week17).toBe(16);

            // 測試日期異常
            const invalid = CalculateWeek('invalid', 'invalid', 16);
            expect(invalid).toBe(1);
        });
    });
});