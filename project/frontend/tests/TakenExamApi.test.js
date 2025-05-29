import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import {
    GetTakenExamsInCourse,
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
    
    // Post

    // Put

    // Delete
});