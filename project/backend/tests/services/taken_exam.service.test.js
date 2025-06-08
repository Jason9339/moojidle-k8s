import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    FindProjectTakenExamByUserIdAssId,
    FindAllTakenExamsByExamId,
    CreateTakenExam,
    UpdateTakenExam

} from '#src/services/taken_exams_services.js';

describe("Testing taken exams Services", () => {
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

    // FindAllTakenExamsByExamId tests
    describe("Find all taken exams by exam ID", () => {
        it("given a valid examId should return all taken exams for that exam", async () => {
            const takenExams = await FindAllTakenExamsByExamId(1);

            expect(takenExams).toBeDefined();
            expect(Array.isArray(takenExams)).toBe(true);
            expect(takenExams.length).toBe(1);
            expect(takenExams[0].t_exam_id).toBe(1);
            expect(takenExams[0].exam_id).toBe(1);
            expect(takenExams[0].taken_by_user_id).toBe(3);
            expect(takenExams[0].score).toBe(100);
        });

        it("given an invalid examId should return an empty array", async () => {
            const takenExams = await FindAllTakenExamsByExamId(999);

            expect(takenExams).toBeDefined();
            expect(Array.isArray(takenExams)).toBe(true);
            expect(takenExams.length).toBe(0);
        });
    });


    // Insert series:
    // CreateTakenExam tests
    describe("Create a new taken exam", () => {
        it("should create a new taken exam with required fields", async () => {
            const score = 85;
            const graderId = 1;
            const beGradedUserId = 2;
            const examId = 1;
            const userCourseTag = "User2's CustomTag_1";

            const result = await CreateTakenExam(
                score, graderId, beGradedUserId, examId, userCourseTag
            );

            expect(result).toBeDefined();
            expect(result.t_exam_id).toBe(2); // Should be next counter ID after seed
            expect(result.exam_id).toBe(1);
            expect(result.taken_by_user_id).toBe(2);
            expect(result.taken_user_course_tag).toBe("User2's CustomTag_1");
            expect(result.score).toBe(85);
            expect(result.graded_by_user_id).toBe(1);
        });

    });

    // Update series:
    // UpdateTakenExam tests
    describe("Update an existing taken exam", () => {
        it("should update an existing taken exam", async () => {
            const t_exam_id = 1;
            const newScore = 90;
            const graderId = 2;
            const beGradedUserId = 3;
            const examId = 1;

            const result = await UpdateTakenExam(
                t_exam_id, newScore, graderId, beGradedUserId, examId
            );

            expect(result).toBe(true);

            // Verify update by retrieving the exam
            const updatedExams = await FindProjectTakenExamByUserIdAssId(beGradedUserId, examId);
            expect(updatedExams[0].score).toBe(90);
            expect(updatedExams[0].graded_by_user_id).toBe(2);
        });

        it("should return false when updating a non-existent taken exam", async () => {
            const t_exam_id = 999;
            const newScore = 80;
            const graderId = 2;
            const beGradedUserId = 3;
            const examId = 1;

            const result = await UpdateTakenExam(
                t_exam_id, newScore, graderId, beGradedUserId, examId
            );

            expect(result).toBe(false);
        });
    });
});
