import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import {
    GetTheAssignSubAssForOneStuednt,
    GetSubAssInCourse,
    GetOneStudentSubAssInCourse,
    CreateSubAssign,
    UpdateSubAssign,
    DeleteSubAss
} from '@/services/SubmittedAssignApi.js'

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

describe('Submitted Assignment Test', () => {
    beforeAll(async () => {
        await WaitForBackendReady()
    });

    beforeEach(async () => {
        await ResetBackendDatabase()
    });

    describe('GetTheAssignSubAssForOneStuednt integration test', () => {
        it('should return the submitted assignment for one student', async () => {
            // 使用 tests/seed 資料（已有提交記錄）
            const assignmentId = 1;
            const userId = 3;

            const result = await GetTheAssignSubAssForOneStuednt(assignmentId, userId);

            expect(result).toBeDefined();
            expect(result.s_ass_id).toBe(1);
            expect(result.ass_id).toBe(1);
            expect(result.submit_by_user_id).toBe(3);
            expect(result.submit_user_course_tag).toBe("User3's CustomTag_1");
            expect(result.score).toBe(100);
            expect(result.graded_by_user_id).toBe(2);
            expect(Array.isArray(result.attachments)).toBe(true);
            expect(result.attachments.length).toBeGreaterThan(0);
            expect(result.description).toBe("This is the submission for Assignment 1 by User 3.");
        });

        it('should return null when there is no submission record', async () => {
            // 不存在的提交紀錄，應該返回 null
            const assignmentId = 1;
            const userId = 1;

            const result = await GetTheAssignSubAssForOneStuednt(assignmentId, userId);

            expect(result).toBeNull();
        });

        it('should throw error when user does not exist', async () => {
            const assignmentId = 1;
            const nonExistentUserId = 999;

            await expect(
                GetTheAssignSubAssForOneStuednt(assignmentId, nonExistentUserId)
            ).rejects.toThrow();
        });

        it('should throw error when assignment does not exist', async () => {
            const nonExistentAssignmentId = 999;
            const userId = 1;

            await expect(
                GetTheAssignSubAssForOneStuednt(nonExistentAssignmentId, userId)
            ).rejects.toThrow();
        });
    });

    // testing GetSubAssInCourse
    describe("GetSubAssInCourse integration test", async () => {
        it("given a courseId, get each students' name and their submitted assigns(with percentage)", async () => {
            const data = await GetSubAssInCourse(1);
    
            expect(data).toBeDefined();
            expect(data.length).toBeGreaterThanOrEqual(1);
            expect(data[0].name).toBe("User 3");

            expect(data[0].sub_ass).toBeDefined();
            expect(data[0].sub_ass.length).toBeGreaterThanOrEqual(1);
            expect(data[0].sub_ass[0].ass_id).toBe(1);
            expect(data[0].sub_ass[0].score).toBe(100);
            expect(data[0].sub_ass[0].percentage).toBe(0.1);
        });
    });

    // testing GetOneStudentSubAssInCourse
    describe("GetOneStudentSubAssInCourse integration test", async () => {
        it("given a courseId and a userId, get student's name and their submitted assigns(with percentage)", async () => {
            const data = await GetOneStudentSubAssInCourse(1, 3);
    
            expect(data).toBeDefined();
            expect(data.name).toBe("User 3");

            expect(data.sub_ass).toBeDefined();
            expect(data.sub_ass.length).toBeGreaterThanOrEqual(1);
            expect(data.sub_ass[0].ass_id).toBe(1);
            expect(data.sub_ass[0].score).toBe(100);
            expect(data.sub_ass[0].percentage).toBe(0.1);
        });
    });

    describe('CreateSubAssign integration test', () => {
        it('should create a submission record successfully', async () => {
            const assignmentId = 1;
            const submitByUserId = 1;
            
            const formData = new FormData();
            formData.append("userTags", "Test User Tag");
            formData.append("description", "這是測試提交的描述");
            
            // 模擬文件上傳(會真的上傳到 backend/uploads/ 中)
            const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
            formData.append("uploadFile", testFile);

            const result = await CreateSubAssign(assignmentId, submitByUserId, formData);

            expect(result).toBe("create sub ass successfully");
        });

        it('should throw error when user does not exist', async () => {
            const assignmentId = 1;
            const nonExistentUserId = 999;
            
            const formData = new FormData();
            formData.append("userTags", "Test User Tag");
            formData.append("description", "測試描述");

            await expect(
                CreateSubAssign(assignmentId, nonExistentUserId, formData)
            ).rejects.toThrow();
        });

        it('should throw error when assignment does not exist', async () => {
            const nonExistentAssignmentId = 999;
            const submitByUserId = 1;
            
            const formData = new FormData();
            formData.append("userTags", "Test User Tag");
            formData.append("description", "測試描述");

            await expect(
                CreateSubAssign(nonExistentAssignmentId, submitByUserId, formData)
            ).rejects.toThrow();
        });
    });

    describe('UpdateSubAssign integration test', () => {
        it('should update the submission record successfully', async () => {
            const subAssId = 1;
            
            // 不保留原有文件，並上傳新文件
            const formData = new FormData();
            formData.append("description", "這是更新後的描述");
            formData.append("keepFiles", JSON.stringify([]));
            
            // 添加新文件
            const testFile = new File(['updated content'], 'updated.txt', { type: 'text/plain' });
            formData.append("uploadFile", testFile);

            const result = await UpdateSubAssign(subAssId, formData);

            expect(result).toBe("update sub ass successfully");
        });

        it('should update the submission record successfully and keep some of the original files', async () => {
            const subAssId = 1;
            
            // 更新作業 description ，保留原有上傳檔案
            const formData = new FormData();
            formData.append("description", "保留部分文件的更新");
            
            const keepFiles = [{
                filename: "submitted_assignment_1_file_1.pdf",
                url: "http://example.com/assignments/course_1/assignment_1_file_1.pdf"
            }];
            formData.append("keepFiles", JSON.stringify(keepFiles));

            const result = await UpdateSubAssign(subAssId, formData);

            expect(result).toBe("update sub ass successfully");
        });

        it('should throw error when submission record does not exist', async () => {
            const nonExistentSubAssId = 999;
            
            const formData = new FormData();
            formData.append("description", "測試描述");

            await expect(
                UpdateSubAssign(nonExistentSubAssId, formData)
            ).rejects.toThrow();
        });
    });

    describe('DeleteSubAssign integration test', () => {
        it('should delete the submission record successfully', async () => {
            const subAssId = 1;

            const result = await DeleteSubAss(subAssId);

            expect(result).toBe("delete sub ass successfully");
        });

        it('should throw error when submission record does not exist', async () => {
            const nonExistentSubAssId = 999;

            await expect(
                DeleteSubAss(nonExistentSubAssId)
            ).rejects.toThrow();
        });

        it('should not be able to get the submission record after deletion', async () => {
            const subAssId = 1;
            const assignmentId = 1;
            const userId = 3;

            // 先確認提交記錄存在
            let result = await GetTheAssignSubAssForOneStuednt(assignmentId, userId);
            expect(result).not.toBeNull();

            // 刪除提交記錄
            await DeleteSubAss(subAssId);

            // 再次查詢應該返回null
            result = await GetTheAssignSubAssForOneStuednt(assignmentId, userId);
            expect(result).toBeNull();
        });
    });
});