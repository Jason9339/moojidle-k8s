import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    FindProjectedExamsByCourseId,

    UpdateOneExamScoreById
} from '#src/services/exam_service.js';

describe("Testing Exams' Services", () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    // Find series:
    // testing FindProjectedExamsByCourseId
    describe("Finding exams in a course (with no description and attachments)", () => {
        it("given a valid examId", async () => {
            const exams = await FindProjectedExamsByCourseId(1);

            expect(exams).toBeDefined();
            expect(exams.length).toBe(1);
            expect(exams[0].exam_id).toBe(1);
            expect(exams[0].in_course_id).toBe(1);
            expect(exams[0].create_by_user_id).toBe(1);
            expect(exams[0].exam_name).toBe("Exam 1 for Course 1");
            expect(exams[0].create_date).toStrictEqual(new Date("2025-01-01T00:00:00.000Z"));
            expect(exams[0].start_date).toStrictEqual(new Date("2025-01-15T00:00:00.000Z"));
            expect(exams[0].end_date).toStrictEqual(new Date("2025-01-15T03:00:00.000Z"));
            expect(exams[0].max_score).toBe(100);
            expect(exams[0].percentage).toBe(0.1);

            expect(exams[0].description).toBeUndefined();
            expect(exams[0].attachments).toBeUndefined();
        });

        it("given a valid courseId but not in integer", async () => {
            const exams = await FindProjectedExamsByCourseId('1');

            expect(exams).toBeDefined();
            expect(exams.length).toBe(1);
            expect(exams[0].exam_id).toBe(1);
            expect(exams[0].in_course_id).toBe(1);
            expect(exams[0].create_by_user_id).toBe(1);
            expect(exams[0].exam_name).toBe("Exam 1 for Course 1");
            expect(exams[0].create_date).toStrictEqual(new Date("2025-01-01T00:00:00.000Z"));
            expect(exams[0].start_date).toStrictEqual(new Date("2025-01-15T00:00:00.000Z"));
            expect(exams[0].end_date).toStrictEqual(new Date("2025-01-15T03:00:00.000Z"));
            expect(exams[0].max_score).toBe(100);
            expect(exams[0].percentage).toBe(0.1);

            expect(exams[0].description).toBeUndefined();
            expect(exams[0].attachments).toBeUndefined();
        });

        it("given an invalid courseId", async () => {
            const exams = await FindProjectedExamsByCourseId(100);

            expect(exams.length).toBe(0);
        })
    });

    // Insert series:

    // Update series:
    // testing UpdateOneExamScoreById
    describe("Update the assignment's max_score and percentage", () => {
        it("given valid ass_id, max_score, percentage", async () => {
            const result = await UpdateOneExamScoreById(1, 120, 0.5);

            expect(result).toBeDefined();
            expect(result).toBe(1);

            const exams = await FindProjectedExamsByCourseId(1);
            expect(exams).toBeDefined();
            expect(exams.length).toBe(1);
            expect(exams[0].max_score).toBe(120);
            expect(exams[0].percentage).toBe(0.5);
        });

        it("given an invalid ass_id", async () => {
            const result = await UpdateOneExamScoreById(100, 120, 0.5);

            expect(result).toBeDefined();
            expect(result).toBeNull();
        });
    });

    // Delete series:
});