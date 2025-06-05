import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { GetCourseExams, UploadExam, DownloadExam } from '#src/controllers/exam_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';

describe('Exam Controller', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('GetCourseExams', () => {
        it('應該成功獲取課程考試', async () => {
            // Arrange
            const req = createMockReq({}, { courseId: 1 });
            const res = createMockRes();

            // Act
            await GetCourseExams(req, res);

            // Assert
            expect(res.json).toHaveBeenCalled();
            const exams = res.json.mock.calls[0][0];
            expect(Array.isArray(exams)).toBe(true);
            expect(exams.length).toBeGreaterThan(0);
            expect(exams[0]).toHaveProperty('id');
            expect(exams[0]).toHaveProperty('name');
        });

        it('應該返回 500 當 courseId 不存在', async () => {
            const req = createMockReq({}, { courseId: 9999 });
            const res = createMockRes();

            await GetCourseExams(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
        });
    });

    describe('UploadExam', () => {
        it('應該成功上傳考試（無附件）', async () => {
            const req = createMockReq(
                {
                    createByUserId: 1,
                    examName: "Controller Test Exam",
                    startDate: "2025-03-01T00:00:00.000Z",
                    endDate: "2025-03-01T03:00:00.000Z",
                    description: "Controller test exam description",
                    maxScore: 100,
                    percentage: 0.2
                },
                { courseId: 1 }
            );
            req.files = [];

            const res = createMockRes();

            await UploadExam(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining("考試上傳成功"),
                filesCount: 0
            }));
        });

        it('應該處理缺少必要欄位', async () => {
            const req = createMockReq({}, { courseId: 1 });
            req.files = [];
            const res = createMockRes();

            await UploadExam(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
        });
    });

    describe('DownloadExam', () => {
        it('應該返回 400 當缺少 path 參數', () => {
            const req = createMockReq({}, {}, { });
            const res = createMockRes();

            DownloadExam(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Missing path parameter" });
        });

        it('應該返回 404 當檔案不存在', async () => {
            const req = createMockReq({}, {}, { path: '/not/exist/file.pdf' });
            const res = createMockRes();

            // Mock fs.access to always call callback with error
            const fs = require('fs');
            const originalAccess = fs.access;
            fs.access = (filePath, mode, cb) => cb(new Error('not found'));

            // Use a Promise to wait for the async assertions
            await new Promise((resolve) => {
                res.status.mockImplementation((code) => {
                    expect(code).toBe(404);
                    return res;
                });
                res.json.mockImplementation((obj) => {
                    expect(obj).toHaveProperty('message', 'File not found');
                    // Restore fs.access after test
                    fs.access = originalAccess;
                    resolve();
                });

                DownloadExam(req, res);
            });
        });
    });
});