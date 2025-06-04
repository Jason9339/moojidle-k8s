import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    FindProjectTakenExamByUserIdAssId,
} from '#src/services/taken_exams_services.js';

describe("Testing submitted assigns' Services", () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    // Find series:
    // testing FindProjectTakenExamByUserIdAssId
    describe("Find all history of that exam (with no description and attachments) taken by an user)", () => {
        it("given a valid examId and userId", async () => {
            const takenExams = await FindProjectTakenExamByUserIdAssId(3, 1);

            expect(takenExams).toBeDefined();
            expect(takenExams.length).toBe(1);
            expect(takenExams[0].t_exam_id).toBe(1);
            expect(takenExams[0].exam_id).toBe(1);
            expect(takenExams[0].taken_by_user_id).toBe(3);
            expect(takenExams[0].taken_user_course_tag).toBe("User3's CustomTag_1");
            expect(takenExams[0].score).toBe(100);
            expect(takenExams[0].graded_by_user_id).toBe(1);

            expect(takenExams[0].description).toBeUndefined();
            expect(takenExams[0].attachments).toBeUndefined();
        });

        it("given an invalid examId", async () => {
            const takenExams = await FindProjectTakenExamByUserIdAssId(3, 100);

            expect(takenExams.length).toBe(0);
        });

        it("given an invalid user_id", async () => {
            const takenExams = await FindProjectTakenExamByUserIdAssId(1, 1);

            expect(takenExams.length).toBe(0);
        });
    });

    // Insert series:

    // Update series:

    // Delete series:
});