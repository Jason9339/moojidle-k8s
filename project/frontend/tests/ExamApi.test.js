import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import {
    GetSimpleExams,
    UpdateExamScore,
} from '@/services/ExamApi.js'

describe('ExamApi Test', () => {
    beforeAll(async () => {
        await WaitForBackendReady()
    });

    beforeEach(async () => {
        await ResetBackendDatabase()
    });

    // Get
    // testing GetSimpleExams
    describe("GetSimpleExams integration test", async () => {
        it("given a courseId, get exam's name, max score, percentage", async () => {
            const data = await GetSimpleExams(1);
    
            expect(data).toBeDefined();
            expect(data.length).toBeGreaterThanOrEqual(1);
            expect(data[0].exam_name).toBe("Exam 1 for Course 1");
            expect(data[0].max_score).toBe(100);
            expect(data[0].percentage).toBe(0.1);
        });
    });
    
    // Post

    // Put
    // testing UpdateExamScore
    describe("UpdateExamScore integration test", async () => {
        it("given a assId and payload, see if successful", async () => {
            const payload = {
                max_score: 120,
                percentage: 0.5
            };
            const result = await UpdateExamScore(1, payload);
    
            expect(result).toBeDefined();
            expect(result).toBe("Update successful!");
        });
    });

    // Delete
});