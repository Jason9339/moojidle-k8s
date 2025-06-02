import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import { EditPost } from '@/services/PostApi.js'

describe('前端 PostApi 整合測試', () => {
    beforeAll(async () => {
        // 確認後端服務器連接
        await WaitForBackendReady()

        console.log('🎯 前端整合測試環境準備完成')
    })

    beforeEach(async () => {
        // 每個測試前重置後端資料庫
        await ResetBackendDatabase()
    })

    describe('EditPost 整合測試', () => {
        it('應該成功編輯文章', async () => {
            const postID = 1
            const postContent = {
                title: "Updated Post Title",
                description: "This is the updated content of the post."
            }

            // Act
            const result = await EditPost(postID, postContent)
            // Assert
            expect(result).toBeDefined()
            expect(result.message).toBe("成功更新貼文")
        })
    })
})