import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import {
    GetTakenExamsInCourse,
    GetOneStudentTakenExamsInCourse,
    GetTakenExamInExam,
    GradeExam
} from '@/services/TakenExamApi.js'

describe('Taken Exam Test', () => {
    beforeAll(async () => {
        await WaitForBackendReady()
    });

    beforeEach(async () => {
        await ResetBackendDatabase()
    });

    // Get
    // testing GetTakenExamsInCourse
    describe("GetTakenExamsInCourse integration test", async () => {
        it("given a courseId, get each students' name and their taken exams(with percentage)", async () => {
            const data = await GetTakenExamsInCourse(1);
    
            expect(data).toBeDefined();
            expect(data.length).toBeGreaterThanOrEqual(1);
            expect(data[0].name).toBe("User 3");

            expect(data[0].taken_exams).toBeDefined();
            expect(data[0].taken_exams.length).toBeGreaterThanOrEqual(1);
            expect(data[0].taken_exams[0].exam_id).toBe(1);
            expect(data[0].taken_exams[0].score).toBe(100);
            expect(data[0].taken_exams[0].percentage).toBe(0.1);
        });
    });

    // testing GetOneStudentTakenExamsInCourse
    describe("GetOneStudentTakenExamsInCourse integration test", async () => {
        it("given a courseId and a userId, get student's name and their taken exams(with percentage)", async () => {
            const data = await GetOneStudentTakenExamsInCourse(1, 3);
    
            expect(data).toBeDefined();
            expect(data.name).toBe("User 3");

            expect(data.taken_exams).toBeDefined();
            expect(data.taken_exams.length).toBeGreaterThanOrEqual(1);
            expect(data.taken_exams[0].exam_id).toBe(1);
            expect(data.taken_exams[0].score).toBe(100);
            expect(data.taken_exams[0].percentage).toBe(0.1);
        });
    });
    
    // testing GetTakenExamInExam
    describe("GetTakenExamInExam integration test", async () => {
        it("given an examId, get all taken exams for that exam", async () => {
            const data = await GetTakenExamInExam(1);
            
            expect(data).toBeDefined();
            const takenExam = data.takenExams;

            expect(Array.isArray(takenExam)).toBe(true);
            expect(takenExam.length).toBeGreaterThanOrEqual(1);
            const firstTakenExam = takenExam[0];
            expect(firstTakenExam.t_exam_id).toBe(1);
            expect(firstTakenExam.exam_id).toBe(1);
            expect(firstTakenExam.taken_by_user_id).toBe(3);
            expect(firstTakenExam.score).toBe(100);
            expect(firstTakenExam.graded_by_user_id).toBe(1);
        });
        
    });

    // Post

    // testing GradeExam
    describe("GradeExam integration test", async () => {
        it("should grade an existing exam successfully", async () => {
            // Update the existing taken exam
            const score = 95;
            const graderId = 2;
            const beGradedUserId = 3;
            const takenExamId = 1;
            const examId = 1;
            
            const data = await GradeExam(score, graderId, beGradedUserId, takenExamId, examId);
            
            expect(data).toBeDefined();
            expect(data.updated).toBe(true);
        });
        
        it("should create a new taken exam when grading a student without existing submission", async () => {
            // Create a new taken exam (user 2 hasn't taken the exam yet)
            const score = 85;
            const graderId = 1;
            const beGradedUserId = 2;
            const examId = 1;
            // No takenExamId provided to simulate new submission
            
            const data = await GradeExam(score, graderId, beGradedUserId, undefined, examId);
            
            expect(data).toBeDefined();
            expect(data.taken_by_user_id).toBe(beGradedUserId);
            expect(data.score).toBe(score);
            expect(data.graded_by_user_id).toBe(graderId);
            expect(data.exam_id).toBe(examId);
        });
        
    });
    // Put

    // Delete
});
