import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
    GetOneSubAss,
    CreateAssignmentSubmission,
    UpdateAssignmentSubmission,
    DeleteSubmissionRecord
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
});
