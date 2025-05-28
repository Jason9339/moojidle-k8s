import { describe, it, expect, beforeAll, afterAll, beforeEach, assert } from 'vitest';
import {
    FindProjectedAssignmentsByCourseId,

    UpdateOneAssignScoreById
} from '#src/services/assignment_service.js';

describe("Testing Assignments' Services", () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    // Find series:
    // testing FindProjectedAssignmentsByCourseId
    describe("Finding assiments in a course (with no description and attachments)", () => {
        it("given a valid courseId", async () => {
            const assigns = await FindProjectedAssignmentsByCourseId(1);

            expect(assigns).toBeDefined();
            expect(assigns.length).toBe(1);
            expect(assigns[0].ass_id).toBe(1);
            expect(assigns[0].in_course_id).toBe(1);
            expect(assigns[0].create_by_user_id).toBe(1);
            expect(assigns[0].ass_name).toBe("Assignment 1 for Course 1");
            expect(assigns[0].create_date).toStrictEqual(new Date("2025-01-08T00:00:00.000Z"));
            expect(assigns[0].start_date).toStrictEqual(new Date("2025-01-08T00:00:00.000Z"));
            expect(assigns[0].end_date).toStrictEqual(new Date("2025-01-15T00:00:00.000Z"));
            expect(assigns[0].max_score).toBe(100);
            expect(assigns[0].percentage).toBe(0.1);
        });

        it("given an invalid courseId", async () => {
            const assigns = await FindProjectedAssignmentsByCourseId(100);

            expect(assigns.length).toBe(0);
        })
    });

    // Insert series:

    // Update series:

    // Delete series:
});