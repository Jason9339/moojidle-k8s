import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../main.js';

// 請確保 main.js 有正確 export app

describe('GET /assignment/:assignmentId/submission-time', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moojidle_test');
        }
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('應該取得繳交時間（有繳交）', async () => {
        // 測試資料庫必須有 ass_id:1, submit_by_user_id:15
        const res = await request(app)
            .get('/assignment/1/submission-time')
            .query({ userId: 15 });
        expect(res.status).toBe(200);
        expect(res.body.submitTime).toBeDefined();
        expect(new Date(res.body.submitTime).toString()).not.toBe('Invalid Date');
    });

    it('未繳交時應回傳 null', async () => {
        const res = await request(app)
            .get('/assignment/999/submission-time')
            .query({ userId: 999 });
        expect(res.status).toBe(200);
        expect(res.body.submitTime).toBeNull();
    });
});
