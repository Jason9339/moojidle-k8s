import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { GetAssignmentSubmissionTimeController } from '#src/controllers/assignment_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';

describe('GetAssignmentSubmissionTimeController', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moojidle_test');
        }
        await mongoose.connection.db.collection('submitted_ass').insertOne({
            s_ass_id: 1,
            ass_id: 1,
            submit_by_user_id: 3,
            submit_user_course_tag: "User3's CustomTag_1",
            submit_date: new Date("2025-01-14T00:00:00.000Z"),
            score: 100,
            graded_by_user_id: 2,
            attachments: [],
            description: "This is the submission for Assignment 1 by User 3."
        });
    });
    afterAll(async () => {
        await mongoose.connection.db.collection('submitted_ass').deleteMany({ ass_id: 1, submit_by_user_id: 3 });
        await mongoose.disconnect();
    });

    it('應該取得繳交時間（有繳交）', async () => {
        const req = createMockReq({}, { assignmentId: '1' }, { userId: '3' });
        const res = createMockRes();
        await GetAssignmentSubmissionTimeController(req, res);
        expect(res.json).toHaveBeenCalled();
        const data = res.json.mock.calls[0][0];
        expect(data.submitTime).toBeDefined();
        expect(new Date(data.submitTime).toString()).not.toBe('Invalid Date');
    });

    it('未繳交時應回傳 null', async () => {
        const req = createMockReq({}, { assignmentId: '999' }, { userId: '999' });
        const res = createMockRes();
        await GetAssignmentSubmissionTimeController(req, res);
        expect(res.json).toHaveBeenCalled();
        const data = res.json.mock.calls[0][0];
        expect(data.submitTime).toBeNull();
    });
});
