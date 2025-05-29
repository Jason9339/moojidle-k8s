import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { GetAssignmentSubmissionTime } from '../../src/services/assignment_service.js';

// 測試前請確保測試資料庫有 submitted_ass 資料

describe('GetAssignmentSubmissionTime', () => {
    let db;
    beforeAll(async () => {
        // 連接測試資料庫
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moojidle_test');
        }
        db = mongoose.connection.db;
    });

    beforeEach(async () => {
        // 先清除，確保乾淨
        await db.collection('submitted_ass').deleteMany({ ass_id: 1, submit_by_user_id: 3 });
        // 插入一筆測試資料（根據 seed.js 格式）
        await db.collection('submitted_ass').insertOne({
            s_ass_id: 1,
            ass_id: 1,
            submit_by_user_id: 3,
            submit_user_course_tag: "User3's CustomTag_1",
            submit_date: new Date("2025-01-14T00:00:00.000Z"),
            score: 100,
            graded_by_user_id: 2,
            attachments: [
                {
                    filename: "submitted_assignment_1_file_1.pdf",
                    url: "http://example.com/assignments/course_1/assignment_1_file_1.pdf"
                }
            ],
            description: "This is the submission for Assignment 1 by User 3."
        });
    });

    afterEach(async () => {
        await db.collection('submitted_ass').deleteMany({ ass_id: 1, submit_by_user_id: 3 });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('應該回傳正確的繳交時間（有繳交）', async () => {
        // 測試資料庫有 ass_id: 1, submit_by_user_id: 3
        const result = await GetAssignmentSubmissionTime(1, 3);
        expect(result).not.toBeNull();
        expect(new Date(result).toString()).not.toBe('Invalid Date');
    });

    it('未繳交時應回傳 null', async () => {
        // ass_id: 999, submit_by_user_id: 999 不存在
        const result = await GetAssignmentSubmissionTime(999, 999);
        expect(result).toBeNull();
    });
});
