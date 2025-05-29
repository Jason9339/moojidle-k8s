import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    GetAllStudentsProjectedSubAssign,
    GetStudentProjectedSubAssign
} from '#src/controllers/submitted_ass_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';

describe('Submitted Assignments Controller Test', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    // Get
    // testing GetAllStudentsProjectedSubAssign
    describe("get all students'(name) submitted assignments' grade(percentage) in a course", async () => {
        it("given valid courseId", async () => {
            const req = createMockReq({}, { courseId: '1' });
            const res = createMockRes();

            await GetAllStudentsProjectedSubAssign(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const data = res.send.mock.calls[0][0];

            expect(data).toBeDefined();
            expect(data.length).toBe(1);

            expect(data[0].user_id).toBeDefined();
            expect(data[0].user_id).toBe(3);
            expect(data[0].name).toBeDefined();
            expect(data[0].name).toBe("User 3");

            expect(data[0].sub_ass).toBeDefined();
            expect(data[0].sub_ass.length).toBe(1);
            expect(data[0].sub_ass[0].score).toBe(100);
            expect(data[0].sub_ass[0].percentage).toBe(0.1);
        });

        it("given an invalid courseId", async () => {
            const req = createMockReq({}, { courseId: '100' });
            const res = createMockRes();

            await GetAllStudentsProjectedSubAssign(req, res);

            expect(res.status).toBeCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("course not found while finding submitted assignments");
        })
    });

    // testing GetStudentProjectedSubAssign
    describe("get the student's (name) submitted assignments' grade(percentage) in a course", async () => {
        it("given valid courseId and userId", async () => {
            const req = createMockReq({}, { courseId: '1', userId: '3' });
            const res = createMockRes();

            await GetStudentProjectedSubAssign(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            const data = res.send.mock.calls[0][0];

            expect(data).toBeDefined();
            expect(data.user_id).toBeDefined();
            expect(data.user_id).toBe(3);
            expect(data.name).toBeDefined();
            expect(data.name).toBe("User 3");

            expect(data.sub_ass).toBeDefined();
            expect(data.sub_ass.length).toBe(1);
            expect(data.sub_ass[0].score).toBe(100);
            expect(data.sub_ass[0].percentage).toBe(0.1);
        });

        it("given an invalid courseId", async () => {
            const req = createMockReq({}, { courseId: '100', userId: '3' });
            const res = createMockRes();

            await GetStudentProjectedSubAssign(req, res);

            expect(res.status).toBeCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("course not found while finding submitted assignments for a student");
        });

        it("given an invalid userId", async () => {
            const req = createMockReq({}, { courseId: '1', userId: '300' });
            const res = createMockRes();

            await GetStudentProjectedSubAssign(req, res);

            expect(res.status).toBeCalledWith(404);

            const data = res.send.mock.calls[0][0];
            expect(data).toBeDefined();
            expect(data).toBe("can't find this student in the course");
        });
    });

    // Post

    // Put

    // Delete

}); 