import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'


import {GetAssignmentSubmissions, GradeAssignment} from '@/services/AssignmentApi.js'

describe('前端 AssignmentApi 整合測試', () => {
    beforeAll(async () => {
        // 確認後端服務器連接
        await WaitForBackendReady()

        console.log('🎯 前端 AssignmentApi 整合測試環境準備完成')
    })

    beforeEach(async () => {
        // 每個測試前重置後端資料庫
        await ResetBackendDatabase()
    })

    describe('GetAssignmentSubmissions 整合測試', () => {
        it('應該成功從後端獲取作業提交狀況', async () => {
            // 根據 seed 數據，assignment_id: 1 存在
            const assignmentId = 1

            // Act
            const submissionData = await GetAssignmentSubmissions(assignmentId)

            // Assert
            expect(submissionData).toBeDefined()
            expect(submissionData).toHaveProperty('submissions')
            expect(submissionData).toHaveProperty('nonSubmittingStudents')
            expect(submissionData).toHaveProperty('studentStatusList')
            expect(submissionData).toHaveProperty('submittedStudents')

            // 驗證提交資料結構
            expect(Array.isArray(submissionData.submissions)).toBe(true)
            expect(Array.isArray(submissionData.nonSubmittingStudents)).toBe(true)
            expect(Array.isArray(submissionData.studentStatusList)).toBe(true)
            expect(Array.isArray(submissionData.submittedStudents)).toBe(true)

            // 根據 seed 數據，User 3 已提交作業
            if (submissionData.submissions.length > 0) {
                const submission = submissionData.submissions[0]
                expect(submission).toHaveProperty('s_ass_id')
                expect(submission).toHaveProperty('ass_id', 1)
                expect(submission).toHaveProperty('submit_by_user_id')
                expect(submission).toHaveProperty('score')
                expect(submission).toHaveProperty('submit_date')
                expect(submission).toHaveProperty('description')
                expect(submission).toHaveProperty('attachments')
                expect(Array.isArray(submission.attachments)).toBe(true)
            }
        })

        it('當作業ID不存在時應該拋出錯誤', async () => {
            const nonExistentAssignmentId = 999

            // Act & Assert
            await expect(GetAssignmentSubmissions(nonExistentAssignmentId))
                .rejects.toThrow()
        })

        it('當傳入無效的作業ID時應該拋出錯誤', async () => {
            const invalidAssignmentId = null

            // Act & Assert
            await expect(GetAssignmentSubmissions(invalidAssignmentId))
                .rejects.toThrow()
        })
    })

    describe('GradeAssignment 整合測試', () => {
        it('應該成功評分作業提交', async () => {
            // 根據 seed 數據，s_ass_id: 1 存在
            const submitAssignmentId = 1
            const score = 95
            const graderId = 1

            // Act
            const result = await GradeAssignment(graderId,submitAssignmentId, score)

            // Assert
            expect(result).toBeDefined()
            expect(result).toHaveProperty('message', '作業評分成功')
            expect(result).toHaveProperty('updated', true)

            // 驗證分數確實被更新 - 重新獲取提交資料確認
            const submissionData = await GetAssignmentSubmissions(1)
            const updatedSubmission = submissionData.submissions.find(
                sub => sub.s_ass_id === submitAssignmentId
            )
            expect(updatedSubmission).toBeDefined()
            expect(updatedSubmission.score).toBe(score)
            expect(updatedSubmission.graded_by_user_id).toBe(graderId)
        })

        it('應該能夠重複評分同一份作業', async () => {
            const submitAssignmentId = 1
            const firstScore = 80
            const secondScore = 90
            const graderId = 1

            // 第一次評分
            const firstResult = await GradeAssignment(graderId,submitAssignmentId, firstScore)
            expect(firstResult.message).toBe('作業評分成功')

            // 第二次評分
            const secondResult = await GradeAssignment(graderId,submitAssignmentId, secondScore)
            expect(secondResult.message).toBe('作業評分成功')

            // 驗證最新分數
            const submissionData = await GetAssignmentSubmissions(1)
            const updatedSubmission = submissionData.submissions.find(
                sub => sub.s_ass_id === submitAssignmentId
            )
            expect(updatedSubmission.score).toBe(secondScore)
        })

        it('當作業提交不存在時應該拋出錯誤', async () => {
            const nonExistentSubmissionId = 999
            const score = 85
            const graderId = 1

            // Act & Assert
            await expect(GradeAssignment(nonExistentSubmissionId, score, graderId))
                .rejects.toThrow()
        })

        it('當分數為負數時應該拋出錯誤', async () => {
            const submitAssignmentId = 1
            const invalidScore = -10
            const graderId = 1

            // Act & Assert
            await expect(GradeAssignment(submitAssignmentId, invalidScore, graderId))
                .rejects.toThrow()
        })

        it('當分數超過100時應該拋出錯誤', async () => {
            const submitAssignmentId = 1
            const invalidScore = 150
            const graderId = 1

            // Act & Assert
            await expect(GradeAssignment(submitAssignmentId, invalidScore, graderId))
                .rejects.toThrow()
        })

        it('當缺少必要參數時應該拋出錯誤', async () => {
            // 測試缺少 submitAssignmentId
            await expect(GradeAssignment(null, 85, 1))
                .rejects.toThrow()

            // 測試缺少 score
            await expect(GradeAssignment(1, null, 1))
                .rejects.toThrow()

            // 測試缺少 graderId
            await expect(GradeAssignment(1, 85, null))
                .rejects.toThrow()
        })

        it('應該正確處理邊界分數值', async () => {
            const submitAssignmentId = 1
            const graderId = 1

            // 測試最低分數 0
            const minResult = await GradeAssignment(graderId,submitAssignmentId, 0)
            expect(minResult.message).toBe('作業評分成功')

            // 測試最高分數 100
            const maxResult = await GradeAssignment(graderId,submitAssignmentId, 100)
            expect(maxResult.message).toBe('作業評分成功')

            // 驗證最終分數
            const submissionData = await GetAssignmentSubmissions(1)
            const updatedSubmission = submissionData.submissions.find(
                sub => sub.s_ass_id === submitAssignmentId
            )
            expect(updatedSubmission.score).toBe(100)
        })
    })
})

