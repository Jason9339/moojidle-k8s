import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import {
    GetTheAssignSubAssForOneStuednt,
    GetSubAssInCourse,
    GetOneStudentSubAssInCourse,
    GetAssignmentSubmissions,
    GradeAssignment,
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

    describe('GetAssignmentSubmissions 整合測試', () => {
        it('應該成功從後端獲取作業提交狀況', async () => {
            // 根據 seed 數據，assignment_id: 1 存在
            const assignmentId = 1

            // Act
            const submissionData = await GetAssignmentSubmissions(assignmentId)

            // Assert
            expect(submissionData).toBeDefined()
            expect(submissionData).toHaveProperty('submissions')
            expect(submissionData).toHaveProperty('nonSubmittingStudents')
            expect(submissionData).toHaveProperty('studentStatusList')
            expect(submissionData).toHaveProperty('submittedStudents')

            // 驗證提交資料結構
            expect(Array.isArray(submissionData.submissions)).toBe(true)
            expect(Array.isArray(submissionData.nonSubmittingStudents)).toBe(true)
            expect(Array.isArray(submissionData.studentStatusList)).toBe(true)
            expect(Array.isArray(submissionData.submittedStudents)).toBe(true)

            // 根據 seed 數據，User 3 已提交作業
            if (submissionData.submissions.length > 0) {
                const submission = submissionData.submissions[0]
                expect(submission).toHaveProperty('s_ass_id')
                expect(submission).toHaveProperty('ass_id', 1)
                expect(submission).toHaveProperty('submit_by_user_id')
                expect(submission).toHaveProperty('score')
                expect(submission).toHaveProperty('submit_date')
                expect(submission).toHaveProperty('description')
                expect(submission).toHaveProperty('attachments')
                expect(Array.isArray(submission.attachments)).toBe(true)
            }
        })

        it('當作業ID不存在時應該拋出錯誤', async () => {
            const nonExistentAssignmentId = 999

            // Act & Assert
            await expect(GetAssignmentSubmissions(nonExistentAssignmentId))
                .rejects.toThrow()
        })

        it('當傳入無效的作業ID時應該拋出錯誤', async () => {
            const invalidAssignmentId = null

            // Act & Assert
            await expect(GetAssignmentSubmissions(invalidAssignmentId))
                .rejects.toThrow()
        })
    })

    describe('GradeAssignment 整合測試', () => {
        it('應該成功評分作業提交', async () => {
            // 根據 seed 數據，s_ass_id: 1 存在
            const submitAssignmentId = 1
            const score = 95
            const graderId = 1

            // Act
            const result = await GradeAssignment(graderId, submitAssignmentId, score)

            // Assert
            expect(result).toBeDefined()
            expect(result).toHaveProperty('message', '作業評分成功')
            expect(result).toHaveProperty('updated', true)

            // 驗證分數確實被更新 - 重新獲取提交資料確認
            const submissionData = await GetAssignmentSubmissions(1)
            const updatedSubmission = submissionData.submissions.find(
                sub => sub.s_ass_id === submitAssignmentId
            )
            expect(updatedSubmission).toBeDefined()
            expect(updatedSubmission.score).toBe(score)
            expect(updatedSubmission.graded_by_user_id).toBe(graderId)
        })

        it('應該能夠重複評分同一份作業', async () => {
            const submitAssignmentId = 1
            const firstScore = 80
            const secondScore = 90
            const graderId = 1

            // 第一次評分
            const firstResult = await GradeAssignment(graderId, submitAssignmentId, firstScore)
            expect(firstResult.message).toBe('作業評分成功')

            // 第二次評分
            const secondResult = await GradeAssignment(graderId, submitAssignmentId, secondScore)
            expect(secondResult.message).toBe('作業評分成功')

            // 驗證最新分數
            const submissionData = await GetAssignmentSubmissions(1)
            const updatedSubmission = submissionData.submissions.find(
                sub => sub.s_ass_id === submitAssignmentId
            )
            expect(updatedSubmission.score).toBe(secondScore)
        })

        it('當作業提交不存在時應該拋出錯誤', async () => {
            const nonExistentSubmissionId = 999
            const score = 85
            const graderId = 1

            // Act & Assert
            await expect(GradeAssignment(nonExistentSubmissionId, score, graderId))
                .rejects.toThrow()
        })

        it('當分數為負數時應該拋出錯誤', async () => {
            const submitAssignmentId = 1
            const invalidScore = -10
            const graderId = 1

            // Act & Assert
            await expect(GradeAssignment(submitAssignmentId, invalidScore, graderId))
                .rejects.toThrow()
        })

        it('當分數超過100時應該拋出錯誤', async () => {
            const submitAssignmentId = 1
            const invalidScore = 150
            const graderId = 1

            // Act & Assert
            await expect(GradeAssignment(submitAssignmentId, invalidScore, graderId))
                .rejects.toThrow()
        })

        it('當缺少必要參數時應該拋出錯誤', async () => {
            // 測試缺少 submitAssignmentId
            await expect(GradeAssignment(null, 85, 1))
                .rejects.toThrow()

            // 測試缺少 score
            await expect(GradeAssignment(1, null, 1))
                .rejects.toThrow()

            // 測試缺少 graderId
            await expect(GradeAssignment(1, 85, null))
                .rejects.toThrow()
        })

        it('應該正確處理邊界分數值', async () => {
            const submitAssignmentId = 1
            const graderId = 1

            // 測試最低分數 0
            const minResult = await GradeAssignment(graderId, submitAssignmentId, 0)
            expect(minResult.message).toBe('作業評分成功')

            // 測試最高分數 100
            const maxResult = await GradeAssignment(graderId, submitAssignmentId, 100)
            expect(maxResult.message).toBe('作業評分成功')

            // 驗證最終分數
            const submissionData = await GetAssignmentSubmissions(1)
            const updatedSubmission = submissionData.submissions.find(
                sub => sub.s_ass_id === submitAssignmentId
            )
            expect(updatedSubmission.score).toBe(100)
        })
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