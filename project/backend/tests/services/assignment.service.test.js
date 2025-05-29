import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
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

            expect(assigns[0].description).toBeUndefined();
            expect(assigns[0].attachments).toBeUndefined();
        });

        it("given a valid courseId but not in integer", async () => {
            const assigns = await FindProjectedAssignmentsByCourseId('1');

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

            expect(assigns[0].description).toBeUndefined();
            expect(assigns[0].attachments).toBeUndefined();
        });

        it("given an invalid courseId", async () => {
            const assigns = await FindProjectedAssignmentsByCourseId(100);

            expect(assigns.length).toBe(0);
        })
    });

    // Insert series:

    // Update series:
    // testing UpdateOneAssignScoreById
    describe("Update the assignment's max_score and percentage", () => {
        it("given valid ass_id, max_score, percentage", async () => {
            const result = await UpdateOneAssignScoreById(1, 120, 0.5);

            expect(result).toBeDefined();
            expect(result).toBe(1);

            const assigns = await FindProjectedAssignmentsByCourseId(1);
            expect(assigns).toBeDefined();
            expect(assigns.length).toBe(1);
            expect(assigns[0].max_score).toBe(120);
            expect(assigns[0].percentage).toBe(0.5);
        });

        it("given an invalid ass_id", async () => {
            const result = await UpdateOneAssignScoreById(100, 120, 0.5);

            expect(result).toBeDefined();
            expect(result).toBeNull();
        });
    });

    // Delete series:
});