
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createMockReq, createMockRes } from '../test-utils.js';

import {
    GetCourseAssignments

} from "#src/controllers/assignment_controller.js";


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

});

});

