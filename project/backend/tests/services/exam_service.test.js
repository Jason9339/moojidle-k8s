import mongoose from "mongoose";

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    FindExamsByCourseId,
    AddExamByCourseId,
    FindExamById
} from '#src/services/exam_service.js';

describe('Exam Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('FindExamsByCourseId', () => {
        it('應該根據 course_id 找到所有考試', async () => {
            // course_id 1 is seeded in your test data
            const exams = await FindExamsByCourseId(1);
            expect(exams).toBeDefined();
            expect(Array.isArray(exams)).toBe(true);
            expect(exams.length).toBeGreaterThan(0);
            expect(exams[0]).toHaveProperty('exam_id');
            expect(exams[0]).toHaveProperty('in_course_id', 1);
        });

        it('找不到考試時應返回空陣列', async () => {
            const exams = await FindExamsByCourseId(9999);
            expect(Array.isArray(exams)).toBe(true);
            expect(exams.length).toBe(0);
        });
    });

    describe('AddExamByCourseId', () => {
        it('應該成功新增考試', async () => {
            const examData = {
                in_course_id: 1,
                create_by_user_id: 1,
                exam_name: "New Exam",
                start_date: new Date("2025-02-01T00:00:00.000Z"),
                end_date: new Date("2025-02-01T03:00:00.000Z"),
                create_date: new Date("2025-01-20T00:00:00.000Z"),
                max_score: 100,
                percentage: 0.2,
                description: "This is a new exam.",
                attachments: []
            };

            const result = await AddExamByCourseId(examData);
            expect(result).not.toBeNull();
            expect(result.insertedId).toBeDefined();

            // Get the exam_id you just inserted
            const insertedExam = await mongoose.connection.db.collection('exams').findOne({ _id: result.insertedId });
            expect(insertedExam).toBeDefined();

            // Now use FindExamById with the correct exam_id
            const found = await FindExamById(insertedExam.exam_id);
            expect(found).toBeDefined();
            expect(found.exam_name).toBe("New Exam");
        });
    });

    describe('FindExamById', () => {
        it('應該根據 exam_id 找到考試', async () => {
            // exam_id 1 is seeded in your test data
            const exam = await FindExamById(1);
            expect(exam).toBeDefined();
            expect(exam.exam_id).toBe(1);
            expect(exam.exam_name).toBe("Exam 1 for Course 1");
        });

        it('找不到考試時應返回 null', async () => {
            const exam = await FindExamById(9999);
            expect(exam).toBeNull();
        });
    });
});