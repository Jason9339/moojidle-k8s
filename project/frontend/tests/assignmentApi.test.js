import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import { 
    GetCourseAssignments
} from '@/services/AssignmentApi.js'

describe('前端 AssignmentApi 整合測試', () => {
    beforeAll(async () => {
        await WaitForBackendReady()
        console.log('🎯 前端整合測試環境準備完成')
    })

    beforeEach(async () => {
        await ResetBackendDatabase()
    })

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

    })
})