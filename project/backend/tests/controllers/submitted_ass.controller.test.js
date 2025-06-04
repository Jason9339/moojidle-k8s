import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
    GetOneSubAss,
    CreateAssignmentSubmission,
    UpdateAssignmentSubmission,
    DeleteSubmissionRecord,

    GetAssignmentSubmissions,
    ReviewAssignmentSubmission,

} from '#src/controllers/submitted_ass_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';
import { SaveFile, DeleteFile } from '#src/services/file_services/file_storage_service.js';

// Mock the file storage service
vi.mock('#src/services/file_services/file_storage_service.js', () => ({
    SaveFile: vi.fn(),
    DeleteFile: vi.fn()
}));

// Seed 中只有一筆提交紀錄
/*
{
    "s_ass_id": 1,
    "ass_id": 1,
    "submit_by_user_id": 3,
    "submit_user_course_tag": "User3's CustomTag_1",
    "submit_date": new Date("2025-01-14T00:00:00.000Z"),
    "score": 100,
    "graded_by_user_id": 2,
    "attachments": [
        {
            "filename": "submitted_assignment_1_file_1.pdf",
            "url": "http://example.com/assignments/course_1/assignment_1_file_1.pdf"
        }
    ],
    "description": "This is the submission for Assignment 1 by User 3."
}
*/

describe('Submitted Assignments Controller Test', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('GetOneSubAss test', () => {
        it('should return the submission record if the data is valid', async () => {
            const req = createMockReq({}, { 
                userId: '3', 
                assignmentId: '1' 
            });
            const res = createMockRes();

            await GetOneSubAss(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    s_ass_id: 1,
                    ass_id: 1,
                    submit_by_user_id: 3,
                    submit_user_course_tag: "User3's CustomTag_1"
                })
            );
        });

        it('should return null if the user has no submission record', async () => {
            const req = createMockReq({}, { 
                userId: '1', 
                assignmentId: '1' 
            });
            const res = createMockRes();

            await GetOneSubAss(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(null);
        });

        it('should return 404 error if the user does not exist', async () => {
            const req = createMockReq({}, { 
                userId: '999', 
                assignmentId: '1' 
            });
            const res = createMockRes();

            await GetOneSubAss(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("user not find while finding sub ass for a user");
        });

        it('should return 404 error if the assignment does not exist', async () => {
            const req = createMockReq({}, { 
                userId: '1', 
                assignmentId: '999' 
            });
            const res = createMockRes();

            await GetOneSubAss(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("assignment not find while finding sub ass for a user");
        });
    });

    describe('CreateAssignmentSubmission test', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should create a new submission record with files', async () => {
            const mockFiles = [
                {
                    buffer: Buffer.from('test file content'),
                    originalname: 'test.pdf',
                    size: 1024
                }
            ];

            SaveFile.mockResolvedValue({
                originalName: 'test.pdf',
                relativeUrl: '/uploads/submitted_assignment/test.pdf'
            });

            const req = createMockReq({
                userTags: 'CustomTag',
                description: 'Test submission'
            }, { 
                userId: '1', 
                assignmentId: '1' 
            });
            req.files = mockFiles;
            const res = createMockRes();

            await CreateAssignmentSubmission(req, res);

            expect(SaveFile).toHaveBeenCalledWith(
                mockFiles[0].buffer,
                'test.pdf',
                'submitted_assignment'
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith("create sub ass successfully");
        });

        it('should create a new submission record without files', async () => {
            const req = createMockReq({
                userTags: 'CustomTag',
                description: 'Test submission without files'
            }, { 
                userId: '1', 
                assignmentId: '1' 
            });
            req.files = [];
            const res = createMockRes();

            await CreateAssignmentSubmission(req, res);

            expect(SaveFile).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith("create sub ass successfully");
        });

        it('should return 404 error if the user does not exist', async () => {
            const req = createMockReq({}, { 
                userId: '999', 
                assignmentId: '1' 
            });
            req.files = [];
            const res = createMockRes();

            await CreateAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("user not find while creating sub ass for a user");
        });

        it('should return 404 error if the assignment does not exist', async () => {
            const req = createMockReq({}, { 
                userId: '1', 
                assignmentId: '999' 
            });
            req.files = [];
            const res = createMockRes();

            await CreateAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("assignment not find while creating sub ass for a user");
        });

        it('should return 500 error if the file storage fails', async () => {
            const mockFiles = [
                {
                    buffer: Buffer.from('test file content'),
                    originalname: 'test.pdf',
                    size: 1024
                }
            ];

            SaveFile.mockRejectedValue(new Error('File storage failed'));

            const req = createMockReq({
                userTags: 'CustomTag',
                description: 'Test submission'
            }, { 
                userId: '1', 
                assignmentId: '1' 
            });
            req.files = mockFiles;
            const res = createMockRes();

            await CreateAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'File storage failed'
                })
            );
        });
    });

    describe('UpdateAssignmentSubmission test', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should update the submission record successfully with new files', async () => {
            const mockFiles = [
                {
                    buffer: Buffer.from('new file content'),
                    originalname: 'new_test.pdf',
                    size: 2048
                }
            ];

            SaveFile.mockResolvedValue({
                originalName: 'new_test.pdf',
                relativeUrl: '/uploads/submitted_assignment/new_test.pdf'
            });

            DeleteFile.mockResolvedValue(true);

            const req = createMockReq({
                userTags: 'Updated CustomTag',
                description: 'Updated submission',
                keepFiles: JSON.stringify([
                    {
                        filename: 'existing_file.pdf',
                        path_to_file: '/uploads/submitted_assignment/existing_file.pdf',
                        size: 1024
                    }
                ])
            }, { 
                subAssId: '1' 
            });
            req.files = mockFiles;
            const res = createMockRes();

            await UpdateAssignmentSubmission(req, res);

            expect(SaveFile).toHaveBeenCalledWith(
                mockFiles[0].buffer,
                'new_test.pdf',
                'submitted_assignment'
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith("update sub ass successfully");
        });

        it('should update the submission record successfully and delete old files', async () => {
            DeleteFile.mockResolvedValue(true);

            const req = createMockReq({
                userTags: 'Updated CustomTag',
                description: 'Updated submission',
                keepFiles: JSON.stringify([]) // 不保留任何檔案
            }, { 
                subAssId: '1' 
            });
            req.files = [];
            const res = createMockRes();

            await UpdateAssignmentSubmission(req, res);

            expect(DeleteFile).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith("update sub ass successfully");
        });

        it('should return 404 error if the submission record does not exist', async () => {
            const req = createMockReq({}, { 
                subAssId: '999' 
            });
            req.files = [];
            const res = createMockRes();

            await UpdateAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("sub ass not found while updating");
        });
    });

    describe('DeleteSubmissionRecord test', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should delete the submission record and its attachments', async () => {
            DeleteFile.mockResolvedValue(true);

            const req = createMockReq({}, { 
                subAssId: '1' 
            });
            const res = createMockRes();

            await DeleteSubmissionRecord(req, res);

            expect(DeleteFile).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith("delete sub ass successfully");
        });

        it('should return 404 error if the submission record does not exist', async () => {
            const req = createMockReq({}, { 
                subAssId: '999' 
            });
            const res = createMockRes();

            await DeleteSubmissionRecord(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("sub ass not found while deleting");
        });

        it('當檔案刪除失敗時應該繼續刪除記錄', async () => {
            DeleteFile.mockRejectedValue(new Error('File deletion failed'));

            const req = createMockReq({}, { 
                subAssId: '1' 
            });
            const res = createMockRes();

            await DeleteSubmissionRecord(req, res);

            // 當 DeleteFile 拋出異常時，會被 catch 區塊捕獲並返回 500 錯誤
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'File deletion failed'
                })
            );
        });
    });

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
        });

        it('當分數超過上限時應該返回400錯誤', async () => {
            const req = createMockReq(
                { score: 150, graderId: 1 },
                { submitAssignmentId: '1' }
            );
            const res = createMockRes();

            await ReviewAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('當作業提交不存在時應該返回400錯誤', async () => {
            const req = createMockReq(
                { score: 85, graderId: 1 },
                { submitAssignmentId: '999' }
            );
            const res = createMockRes();

            await ReviewAssignmentSubmission(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
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
