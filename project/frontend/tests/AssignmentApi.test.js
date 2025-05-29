import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import { GetSimpleCourseAssignments, UpdateAssignmentScore } from '@/services/AssignmentApi.js'

describe('AssignmentApi Test', () => {
    beforeAll(async () => {
        await WaitForBackendReady()
    });

    beforeEach(async () => {
        await ResetBackendDatabase()
    });

    // Get
    // testing GetSimpleCourseAssignments
    describe("GetSimpleCourseAssignments integration test", async () => {
        it("given a courseId, get assignment's name, max score, percentage", async () => {
            const data = await GetSimpleCourseAssignments(1);
    
            expect(data).toBeDefined();
            expect(data.length).toBeGreaterThanOrEqual(1);
            expect(data[0].ass_name).toBe("Assignment 1 for Course 1");
            expect(data[0].max_score).toBe(100);
            expect(data[0].percentage).toBe(0.1);
        });
    });
    
    // Post

    // Put
    // testing UpdateAssignmentScore
    describe("UpdateAssignmentScore integration test", async () => {
        it("given a assId and payload, see if successful", async () => {
            const payload = {
                max_score: 120,
                percentage: 0.5
            };
            const result = await UpdateAssignmentScore(1, payload);
    
            expect(result).toBeDefined();
            expect(result).toBe("Update successful!");
        });
    });

    // Delete
});