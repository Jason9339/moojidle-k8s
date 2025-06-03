import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import { EditDiscussionBoard } from '@/services/DiscussionBoardApi.js'

describe('前端 DiscussionBoardApi 整合測試', () => {
    beforeAll(async () => {
        // 確認後端服務器連接
        await WaitForBackendReady()

        console.log('🎯 前端整合測試環境準備完成')
    })

    beforeEach(async () => {
        // 每個測試前重置後端資料庫
        await ResetBackendDatabase()
    })

    describe('EditDiscussionBoard 整合測試', () => {
        it('應該成功編輯討論版', async () => {
            const boardID = 1
            const boardName = "Updated Board Name"

            // Act
            const result = await EditDiscussionBoard(boardID, boardName)

            // Assert
            expect(result).toBeDefined()
            expect(result.success).toBe(true)
            expect(result.message).toBe("討論版名稱已更新")
            
        })
    })
})