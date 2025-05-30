
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createMockReq, createMockRes } from '../test-utils.js';

import {
    GetAssignmentSubmissions,
    ReviewAssignmentSubmission,
} from "#src/controllers/assignment_controller.js";

describe("Assignment Controller", () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe("GetAssignmentSubmissions", () => {
        it('應該成功獲取作業提交狀況', async () => {
            // 根據 seed 數據，assignment_id: 1 存在於 course_id: 1
            const req = createMockReq({}, { assignmentId: '1' });
            const res = createMockRes();

            await GetAssignmentSubmissions(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            
            const responseData = res.json.mock.calls[0][0];
            
            // 驗證回傳資料結構
            expect(responseData).toHaveProperty('submissions');
            expect(responseData).toHaveProperty('nonSubmittingStudents');
            expect(responseData).toHaveProperty('studentStatusList');
            expect(responseData).toHaveProperty('submittedStudents');

            // 根據 seed 數據驗證具體內容
            // User 3 已提交作業 (s_ass_id: 1)
            expect(Array.isArray(responseData.submissions)).toBe(true);
            expect(responseData.submissions.length).toBe(1);
            
            const submission = responseData.submissions[0];
            expect(submission.s_ass_id).toBe(1);
            expect(submission.ass_id).toBe(1);
            expect(submission.submit_by_user_id).toBe(3);
            expect(submission.submit_user_course_tag).toBe("User3's CustomTag_1");
            expect(submission.score).toBe(100);
            expect(submission.graded_by_user_id).toBe(2);
            expect(submission.description).toBe("This is the submission for Assignment 1 by User 3.");

            // 驗證已提交學生清單
            expect(Array.isArray(responseData.submittedStudents)).toBe(true);
            expect(responseData.submittedStudents.length).toBe(1);
            expect(responseData.submittedStudents[0].user_id).toBe(3);

            // 驗證未提交學生清單 (課程中沒有其他學生，所以應該為空)
            expect(Array.isArray(responseData.nonSubmittingStudents)).toBe(true);

            // 驗證學生狀態清單
            expect(Array.isArray(responseData.studentStatusList)).toBe(true);
        });

        it('當缺少作業ID時應該返回400錯誤', async () => {
            const req = createMockReq({}, {});
            const res = createMockRes();

            await GetAssignmentSubmissions(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "缺少作業ID" });
        });

        it('當作業不存在時應該返回404錯誤', async () => {
            const req = createMockReq({}, { assignmentId: '999' });
            const res = createMockRes();

            await GetAssignmentSubmissions(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "找不到對應的課程" });
        });
    });

    describe("ReviewAssignmentSubmission", () => {
        it('應該成功評分作業提交', async () => {
            // 根據 seed 數據，s_ass_id: 1 存在
            const req = createMockReq(
                { 
                    score: 95,
                    graderId: 1 // User 1 是老師
                },
                { submitAssignmentId: '1' }
            );
            const res = createMockRes();

            await ReviewAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "作業評分成功",
                updated: true
            });

            // 驗證分數確實被更新
            const verifyReq = createMockReq({}, { assignmentId: '1' });
            const verifyRes = createMockRes();
            await GetAssignmentSubmissions(verifyReq, verifyRes);
            
            const verifyData = verifyRes.json.mock.calls[0][0];
            const updatedSubmission = verifyData.submissions.find(sub => sub.s_ass_id === 1);
            expect(updatedSubmission.score).toBe(95);
            expect(updatedSubmission.graded_by_user_id).toBe(1);
        });

        it('當缺少作業提交ID時應該返回400錯誤', async () => {
            const req = createMockReq(
                { score: 90, graderId: 1 },
                {}
            );
            const res = createMockRes();

            await ReviewAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "缺少作業提交ID" });
        });

        it('當缺少評分分數時應該返回400錯誤', async () => {
            const req = createMockReq(
                { graderId: 1 },
                { submitAssignmentId: '1' }
            );
            const res = createMockRes();

            await ReviewAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "缺少評分分數" });
        });

        it('當分數為負數時應該返回400錯誤', async () => {
            const req = createMockReq(
                { score: -10, graderId: 1 },
                { submitAssignmentId: '1' }
            );
            const res = createMockRes();

            await ReviewAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                message: expect.stringContaining("Score must be") 
            });
        });

        it('當分數超過上限時應該返回400錯誤', async () => {
            const req = createMockReq(
                { score: 150, graderId: 1 },
                { submitAssignmentId: '1' }
            );
            const res = createMockRes();

            await ReviewAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                message: expect.stringContaining("Score must be") 
            });
        });

        it('當作業提交不存在時應該返回404錯誤', async () => {
            const req = createMockReq(
                { score: 85, graderId: 1 },
                { submitAssignmentId: '999' }
            );
            const res = createMockRes();

            await ReviewAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "找不到指定的作業提交" });
        });

        it('應該能夠重複評分同一份作業', async () => {
            // 先評分一次
            const req1 = createMockReq(
                { score: 80, graderId: 1 },
                { submitAssignmentId: '1' }
            );
            const res1 = createMockRes();

            await ReviewAssignmentSubmission(req1, res1);
            expect(res1.status).toHaveBeenCalledWith(200);

            // 再評分一次不同分數
            const req2 = createMockReq(
                { score: 90, graderId: 2 }, // User 2 是助教
                { submitAssignmentId: '1' }
            );
            const res2 = createMockRes();

            await ReviewAssignmentSubmission(req2, res2);
            expect(res2.status).toHaveBeenCalledWith(200);

            // 驗證最新分數
            const verifyReq = createMockReq({}, { assignmentId: '1' });
            const verifyRes = createMockRes();
            await GetAssignmentSubmissions(verifyReq, verifyRes);
            
            const verifyData = verifyRes.json.mock.calls[0][0];
            const updatedSubmission = verifyData.submissions.find(sub => sub.s_ass_id === 1);
            expect(updatedSubmission.score).toBe(90);
            expect(updatedSubmission.graded_by_user_id).toBe(2);
        });
    });
});

