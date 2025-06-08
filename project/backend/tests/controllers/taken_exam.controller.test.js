import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    GetAllStudentsProjectedTakenExam,
    GetStudentProjectedTakenExam,
    GetTakenExamsByExamId,
    GradeExam
} from '#src/controllers/taken_exams_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';

describe('Taken Exams Controller Test', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    // Get
    // testing GetAllStudentsProjectedTakenExam
    describe("get all students'(name) taken exams' grade(percentage) in a course", async () => {
        it("given valid courseId", async () => {
            const req = createMockReq({}, { courseId: '1' });
            const res = createMockRes();

            await GetAllStudentsProjectedTakenExam(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const data = res.send.mock.calls[0][0];

            expect(data).toBeDefined();
            expect(data.length).toBe(1);

            expect(data[0].user_id).toBeDefined();
            expect(data[0].user_id).toBe(3);
            expect(data[0].name).toBeDefined();
            expect(data[0].name).toBe("User 3");

            expect(data[0].taken_exams).toBeDefined();
            expect(data[0].taken_exams.length).toBe(1);
            expect(data[0].taken_exams[0].score).toBe(100);
            expect(data[0].taken_exams[0].max_score).toBe(100);
            expect(data[0].taken_exams[0].percentage).toBe(0.1);
        });

        it("given an invalid courseId", async () => {
            const req = createMockReq({}, { courseId: '100' });
            const res = createMockRes();

            await GetAllStudentsProjectedTakenExam(req, res);

            expect(res.status).toBeCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("course not found while finding taken exams");
        })
    });

    // testing GetStudentProjectedTakenExam
    describe("get all student's (name) taken exams' grade(percentage) in a course", async () => {
        it("given valid courseId and userId", async () => {
            const req = createMockReq({}, { courseId: '1', userId: '3' });
            const res = createMockRes();

            await GetStudentProjectedTakenExam(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const data = res.send.mock.calls[0][0];

            expect(data).toBeDefined();
            expect(data.user_id).toBeDefined();
            expect(data.user_id).toBe(3);
            expect(data.name).toBeDefined();
            expect(data.name).toBe("User 3");

            expect(data.taken_exams).toBeDefined();
            expect(data.taken_exams.length).toBe(1);
            expect(data.taken_exams[0].score).toBe(100);
            expect(data.taken_exams[0].max_score).toBe(100);
            expect(data.taken_exams[0].percentage).toBe(0.1);
        });

        it("given an invalid courseId", async () => {
            const req = createMockReq({}, { courseId: '100', userId: '3' });
            const res = createMockRes();

            await GetStudentProjectedTakenExam(req, res);

            expect(res.status).toBeCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("course not found while finding taken exams for the student");
        });

        it("given an invalid userId", async () => {
            const req = createMockReq({}, { courseId: '1', userId: '300' });
            const res = createMockRes();

            await GetStudentProjectedTakenExam(req, res);

            expect(res.status).toBeCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("can't find this student in the course");
        });
    });

        // GetTakenExamsByExamId tests
    describe("get taken exams by exam ID", async () => {
        it("given valid exam ID with taken exams", async () => {
            const req = createMockReq({}, { examId: '1' });
            const res = createMockRes();

            await GetTakenExamsByExamId(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data.takenExams).toBeDefined();
            expect(data.students).toBeDefined();
            expect(data.takenExams.length).toBeGreaterThan(0);
            expect(data.students.length).toBeGreaterThan(0);
        });

        it("given invalid exam ID", async () => {
            const req = createMockReq({}, { examId: '999' });
            const res = createMockRes();

            await GetTakenExamsByExamId(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send.mock.calls[0][0]).toBe("Exam not found");
        });

        it("given invalid exam ID format", async () => {
            const req = createMockReq({}, { examId: 'not-a-number' });
            const res = createMockRes();

            await GetTakenExamsByExamId(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send.mock.calls[0][0]).toBe("Invalid exam ID");
        });
    });

    // GradeExam tests


    // Post

    describe("grade an exam", async () => {
        it("should create a new taken exam when takenExamId is not provided", async () => {
            const req = createMockReq({
                score: 95,
                graderId: 1
            }, { examId: '1', beGradedUserId: '2' });
            const res = createMockRes();

            await GradeExam(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data.exam_id).toBe(1);
            expect(data.taken_by_user_id).toBe(2);
            expect(data.score).toBe(95);
            expect(data.graded_by_user_id).toBe(1);
        });

        it("should update an existing taken exam when takenExamId is provided", async () => {
            const req = createMockReq({
                score: 90,
                graderId: 1,
                takenExamId: 1
            }, { examId: '1', beGradedUserId: '3' });
            const res = createMockRes();

            await GradeExam(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data.updated).toBe(true);
            expect(data.message).toBe("Taken exam updated successfully");
        });

        it("should fail to update non-existent taken exam", async () => {
            const req = createMockReq({
                score: 90,
                graderId: 1,
                takenExamId: 999
            }, { examId: '1', beGradedUserId: '3' });
            const res = createMockRes();

            await GradeExam(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data.updated).toBe(false);
            expect(data.message).toBe("Taken exam not found or update failed");
        });
    });
    // Put

    // Delete

}); 
