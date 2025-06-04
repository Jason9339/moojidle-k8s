import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import { GetCourseAssignments, GetSimpleCourseAssignments, UpdateAssignmentScore } from '@/services/AssignmentApi.js'

describe('AssignmentApi Test', () => {
    beforeAll(async () => {
        await WaitForBackendReady()
    });

    beforeEach(async () => {
        await ResetBackendDatabase()
    });

    // Get
    // testing GetCourseAssignments
    describe('GetCourseAssignments 整合測試', () => {
        it('應該成功從後端獲取課程的作業資料', async () => {
            const courseId = 1

            // Act
            const assignments = await GetCourseAssignments(courseId)

            // Assert
            expect(assignments).toBeDefined()
            expect(Array.isArray(assignments)).toBe(true)
            expect(assignments.length).toBeGreaterThan(0)

            const assignment = assignments[0]
            expect(assignment.id).toBe(1)
            expect(assignment.name).toBe('Assignment 1 for Course 1')
            expect(assignment.description).toBe('This is the description for Assignment 1.')
            expect(Array.isArray(assignment.attachments)).toBe(true)
            expect(assignment.dueDate).toBeDefined()
            expect(assignment.startDate).toBeDefined()
            expect(typeof assignment.week).toBe('number')
        })

    });

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