import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import {
    GetSubAssInCourse,
} from '@/services/SubmittedAssignApi.js'

describe('Submitted Assignment Test', () => {
    beforeAll(async () => {
        await WaitForBackendReady()
    });

    beforeEach(async () => {
        await ResetBackendDatabase()
    });

    // Get
    // testing GetSubAssInCourse
    describe("GetSubAssInCourse integration test", async () => {
        it("given a courseId, get each students' name and thier submitted assigns(with percentage)", async () => {
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
    
    // Post

    // Put

    // Delete
});