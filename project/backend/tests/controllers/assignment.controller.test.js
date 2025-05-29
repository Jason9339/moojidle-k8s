import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    GetProjectedAssignmentsInCourse,

    UpdateAssignmentScore,
} from '#src/controllers/assignment_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';

describe('Assignment Controller Test', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    // Get
    // testing GetProjectedAssignmentsInCourse
    describe("get the simple assignments data (mainly score & percentage) from course", async () => {
        it("given valid courseId", async () => {
            const req = createMockReq({}, { courseId: '1' });
            const res = createMockRes();

            await GetProjectedAssignmentsInCourse(req, res);

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

            await GetProjectedAssignmentsInCourse(req, res);

            expect(res.status).toBeCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("course not found while finding simple assignments");
        })
    });

    // Post

    // Put
    // testing UpdateAssignmentScore
    describe("update score & percentage for a assignment", async () => {
        it("given valid payload and param", async () => {
            const req = createMockReq({
                max_score: 120,
                percentage: 0.3
            }, { assId: '1' });
            const res = createMockRes();

            await UpdateAssignmentScore(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("Update successful!");
        });

        it("given an invalid param", async () => {
            const req = createMockReq({
                max_score: 120,
                percentage: 0.3
            }, { assId: '5' });
            const res = createMockRes();

            await UpdateAssignmentScore(req, res);

            expect(res.status).toHaveBeenCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("assignment not found");
        });

        it("given an invalid payload (including empty ones)", async () => {
            const req = createMockReq({
                max_score: "hihi",
                percentage: "hello"
            }, { assId: '1' });
            const res = createMockRes();

            await UpdateAssignmentScore(req, res);

            expect(res.status).toHaveBeenCalledWith(400);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("invalid assignment Data");
        });
    });

    // Delete

}); 