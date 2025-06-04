import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    GetProjectedExamsByCourseId,

    UpdateExamScore
} from '#src/controllers/exam_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';

describe('Exam Controller Test', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    // Get
    // testing GetProjectedExamsByCourseId
    describe("get the simple exams data (mainly score & percentage) from course", async () => {
        it("given valid courseId", async () => {
            const req = createMockReq({}, { courseId: '1' });
            const res = createMockRes();

            await GetProjectedExamsByCourseId(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data.length).toBeGreaterThan(0);
            for(let i = 0; i < data.length; i ++){
                expect(data[i].max_score).toBeDefined();
                expect(data[i].max_score).toBe(100);
                expect(data[i].percentage).toBeDefined();
                expect(data[i].percentage).toBe(0.1);
            }
        });

        it("given an invalid courseId", async () => {
            const req = createMockReq({}, { courseId: '100' });
            const res = createMockRes();

            await GetProjectedExamsByCourseId(req, res);

            expect(res.status).toBeCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("course not found while finding simplified exams");
        })
    });

    // Post

    // Put
    // testing UpdateExamScore
    describe("update score & percentage for an exam", async () => {
        it("given valid payload and param", async () => {
            const req = createMockReq({
                max_score: 120,
                percentage: 0.3
            }, { examId: '1' });
            const res = createMockRes();

            await UpdateExamScore(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("Update successful!");
        });

        it("given an invalid param", async () => {
            const req = createMockReq({
                max_score: 120,
                percentage: 0.3
            }, { examId: '5' });
            const res = createMockRes();

            await UpdateExamScore(req, res);

            expect(res.status).toHaveBeenCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("exam not found");
        });

        it("given an invalid payload (including empty ones)", async () => {
            const req = createMockReq({
                max_score: "hihi",
                percentage: "hello"
            }, { assId: '1' });
            const res = createMockRes();

            await UpdateExamScore(req, res);

            expect(res.status).toHaveBeenCalledWith(400);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("invalid exam Data");
        });
    });

    // Delete

}); 