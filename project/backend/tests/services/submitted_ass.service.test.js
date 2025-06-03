import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    FindSubAssById,
    FindProjectSubAssignByUserIdAssId,
    FindSubAssByAssAndUser,
    InsertSubAss,
    UpdateSubAssById,
    DeleteSubAssById,

    FindSubmissionsByAssignmentId,
    UpdateReviewAssignmentSubmission,

} from '#src/services/submitted_ass_service.js';

describe('Submitted Assignments Service Test', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('FindSubAssById', () => {
        // 存在的 ID
        it('should find submitted assignment by valid ID', async () => {
            const result = await FindSubAssById(1);

            expect(result).toBeDefined();
            expect(result.s_ass_id).toBe(1);
            expect(result.ass_id).toBe(1);
            expect(result.submit_by_user_id).toBe(3);
            expect(result.submit_user_course_tag).toBe("User3's CustomTag_1");
            expect(result.description).toBe("This is the submission for Assignment 1 by User 3.");
        });

        // 不存在的 ID
        it('should return null when submitted assignment does not exist', async () => {
            const result = await FindSubAssById(999);

            expect(result).toBeNull();
        });

        // 可以處理字串參數
        it('should handle string ID parameter', async () => {
            const result = await FindSubAssById('1');

            expect(result).toBeDefined();
            expect(result.s_ass_id).toBe(1);
        });
    });

    // testing FindProjectSubAssignByUserIdAssId
    describe("Find all versions of HW (with no description and attachments) submitted by an user)", () => {
        it("given a valid ass_id and user_id", async () => {
            const subAssigns = await FindProjectSubAssignByUserIdAssId(3, 1);

            expect(subAssigns).toBeDefined();
            expect(subAssigns.length).toBe(1);
            expect(subAssigns[0].s_ass_id).toBe(1);
            expect(subAssigns[0].ass_id).toBe(1);
            expect(subAssigns[0].submit_by_user_id).toBe(3);
            expect(subAssigns[0].submit_user_course_tag).toBe("User3's CustomTag_1");
            expect(subAssigns[0].submit_date).toStrictEqual(new Date("2025-01-14T00:00:00.000Z"));
            expect(subAssigns[0].score).toBe(100);
            expect(subAssigns[0].graded_by_user_id).toBe(2);

            expect(subAssigns[0].description).toBeUndefined();
            expect(subAssigns[0].attachments).toBeUndefined();
        });

        it("given an invalid ass_id", async () => {
            const subAssigns = await FindProjectSubAssignByUserIdAssId(3, 100);

            expect(subAssigns.length).toBe(0);
        });

        it("given an invalid user_id", async () => {
            const subAssigns = await FindProjectSubAssignByUserIdAssId(300, 1);

            expect(subAssigns.length).toBe(0);
        });
    });

    describe('FindSubAssByAssAndUser', () => {
        // 存在的 assignment ID 和 user ID
        it('should find submissions by valid assignment ID and user ID', async () => {
            const result = await FindSubAssByAssAndUser(1, 3);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0].s_ass_id).toBe(1);
            expect(result[0].ass_id).toBe(1);
            expect(result[0].submit_by_user_id).toBe(3);
        });

        // 存在的 assignment ID 和 user ID，但沒有提交記錄
        it('should return empty array when no submissions found', async () => {
            const result = await FindSubAssByAssAndUser(1, 1);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        // 不存在的 assignment ID
        it('should return empty array when assignment does not exist', async () => {
            const result = await FindSubAssByAssAndUser(999, 3);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        // 可以處理字串參數
        it('should handle string parameters', async () => {
            const result = await FindSubAssByAssAndUser('1', '3');

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0].s_ass_id).toBe(1);
        });
    });

    describe('InsertSubAss', () => {
        it('should successfully insert a new submission', async () => {
            const newSubmission = {
                s_ass_id: 2,
                ass_id: 1,
                submit_by_user_id: 1,
                submit_user_course_tag: "User1's Test Tag",
                submit_date: new Date(),
                attachments: [
                    {
                        filename: "test_submission.pdf",
                        path_to_file: "/uploads/submitted_assignment/test_submission.pdf",
                        size: 1024
                    }
                ],
                description: "Test submission for User 1"
            };

            const result = await InsertSubAss(newSubmission);

            expect(result).toBe(true);

            // 驗證插入是否成功
            const insertedSubmission = await FindSubAssById(2);
            expect(insertedSubmission).toBeDefined();
            expect(insertedSubmission.s_ass_id).toBe(2);
            expect(insertedSubmission.submit_by_user_id).toBe(1);
            expect(insertedSubmission.description).toBe("Test submission for User 1");
        });

        it('should successfully insert submission without attachments', async () => {
            const newSubmission = {
                s_ass_id: 3,
                ass_id: 1,
                submit_by_user_id: 2,
                submit_user_course_tag: "User2's Test Tag",
                submit_date: new Date(),
                attachments: [],
                description: "Test submission without files"
            };

            const result = await InsertSubAss(newSubmission);

            expect(result).toBe(true);

            // 驗證插入是否成功
            const insertedSubmission = await FindSubAssById(3);
            expect(insertedSubmission).toBeDefined();
            expect(insertedSubmission.s_ass_id).toBe(3);
            expect(insertedSubmission.attachments).toEqual([]);
        });
    });

    describe('UpdateSubAssById', () => {
        // 存在的 ID
        it('should successfully update submission details', async () => {
            const newAttachments = [
                {
                    filename: "updated_file.pdf",
                    path_to_file: "/uploads/submitted_assignment/updated_file.pdf",
                    size: 2048
                }
            ];
            const updateTime = new Date();

            const result = await UpdateSubAssById(
                1,
                "Updated Tag",
                newAttachments,
                "Updated description",
                updateTime
            );

            expect(result).toBe(1); // modifiedCount 應該是 1

            // 驗證更新是否成功
            const updatedSubmission = await FindSubAssById(1);
            expect(updatedSubmission).toBeDefined();
            expect(updatedSubmission.submit_user_course_tag).toBe("Updated Tag");
            expect(updatedSubmission.description).toBe("Updated description");
            expect(updatedSubmission.attachments).toEqual(newAttachments);
            expect(updatedSubmission.submit_date).toEqual(updateTime);
        });

        // 存在的 ID，沒有附件
        it('should successfully update submission with empty attachments', async () => {
            const updateTime = new Date();
            
            const result = await UpdateSubAssById(
                1,
                "Updated Tag 2",
                [],
                "No attachments",
                updateTime
            );

            expect(result).toBe(1);

            // 驗證更新是否成功
            const updatedSubmission = await FindSubAssById(1);
            expect(updatedSubmission).toBeDefined();
            expect(updatedSubmission.submit_user_course_tag).toBe("Updated Tag 2");
            expect(updatedSubmission.attachments).toEqual([]);
            expect(updatedSubmission.description).toBe("No attachments");
            expect(updatedSubmission.submit_date).toEqual(updateTime);
        });

        // 不存在的 ID
        it('should return 0 when submission does not exist', async () => {
            const updateTime = new Date();
            
            const result = await UpdateSubAssById(
                999,
                "Nonexistent Tag",
                [],
                "This should not update",
                updateTime
            );

            expect(result).toBe(0); // modifiedCount 應該是 0
        });

        // 可以處理字串參數
        it('should handle string ID parameter', async () => {
            const updateTime = new Date();
            
            const result = await UpdateSubAssById(
                '1',
                "String ID Tag",
                [],
                "Testing string ID",
                updateTime
            );

            expect(result).toBe(1);

            // 驗證更新是否成功
            const updatedSubmission = await FindSubAssById(1);
            expect(updatedSubmission.submit_user_course_tag).toBe("String ID Tag");
            expect(updatedSubmission.submit_date).toEqual(updateTime);
        });
    });

    describe('DeleteSubAssById', () => {
        it('should successfully delete submission', async () => {
            // 先插入一個測試用的提交記錄
            const testSubmission = {
                s_ass_id: 5,
                ass_id: 1,
                submit_by_user_id: 2,
                submit_user_course_tag: "To Delete Tag",
                submit_date: new Date(),
                description: "This will be deleted"
            };

            await InsertSubAss(testSubmission);

            // 確認插入成功
            const insertedSubmission = await FindSubAssById(5);
            expect(insertedSubmission).toBeDefined();

            // 刪除提交記錄
            const deleteResult = await DeleteSubAssById(5);
            expect(deleteResult).toBe(1); // deletedCount 應該是 1

            // 驗證刪除是否成功
            const deletedSubmission = await FindSubAssById(5);
            expect(deletedSubmission).toBeNull();
        });

        // 不存在的 ID
        it('should return 0 when submission does not exist', async () => {
            const result = await DeleteSubAssById(999);

            expect(result).toBe(0); // deletedCount 應該是 0
        });

        // 可以處理字串參數
        it('should handle string ID parameter', async () => {
            // 先插入一個測試用的提交記錄
            const testSubmission = {
                s_ass_id: 6,
                ass_id: 1,
                submit_by_user_id: 3,
                submit_user_course_tag: "String Delete Tag",
                submit_date: new Date(),
                description: "This will be deleted with string ID"
            };

            await InsertSubAss(testSubmission);

            // 使用字串 ID 刪除
            const deleteResult = await DeleteSubAssById('6');
            expect(deleteResult).toBe(1);

            // 驗證刪除是否成功
            const deletedSubmission = await FindSubAssById(6);
            expect(deletedSubmission).toBeNull();
        });
    });

    describe("GetSubmissionsByAssignmentId", () => {
        it('應該成功獲取繳交作業的資訊', async () => {
            const assignmentId = 1;
            const result = await FindSubmissionsByAssignmentId(assignmentId);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);

            const result_0 = result[0]; // 取第一筆資料進行驗證

            expect(result_0.s_ass_id).toBe(1);
            expect(result_0.ass_id).toBe(1);
            expect(result_0.submit_by_user_id).toBe(3);
            expect(result_0.submit_user_course_tag).toBe("User3's CustomTag_1");
            expect(result_0.submit_date).toEqual(new Date("2025-01-14T00:00:00.000Z"));
            expect(result_0.score).toBe(100);
            expect(result_0.graded_by_user_id).toBe(2);
            expect(result_0.attachments).toBeDefined();
            expect(Array.isArray(result_0.attachments)).toBe(true);
            expect(result_0.attachments.length).toBe(1);
            expect(result_0.attachments[0].filename).toBe("submitted_assignment_1_file_1.pdf");
            expect(result_0.description).toBe("This is the submission for Assignment 1 by User 3.");
        });

        it('當作業不存在時應該返回空陣列', async () => {
            const assignmentId = 999;
            const result = await FindSubmissionsByAssignmentId(assignmentId);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
    });

    describe("ReviewAssignmentSubmissionService", () => {
        it('應該成功修改繳交作業的分數', async () => {
            const submitAssignmentId = 1;
            const score = 95;
            const graderId = 1;

            const result = await UpdateReviewAssignmentSubmission(submitAssignmentId, score, graderId);

            expect(result).toBeDefined();
            expect(result.updated).toBe(true);

            // 驗證分數確實被更新
            const submissions = await FindSubmissionsByAssignmentId(1);
            const updatedSubmission = submissions.find(sub => sub.s_ass_id === 1);
            expect(updatedSubmission.score).toBe(95);
            expect(updatedSubmission.graded_by_user_id).toBe(1);
        });
    });
});