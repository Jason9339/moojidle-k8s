import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import { GetUserDataById, GetUserTagsById } from '@/services/UserApi.js'

describe('前端 UserApi 整合測試', () => {
    beforeAll(async () => {
        // 確認後端服務器連接
        await WaitForBackendReady()

        console.log('🎯 前端整合測試環境準備完成')
    })

    beforeEach(async () => {
        // 每個測試前重置後端資料庫
        await ResetBackendDatabase()
    })

    describe('GetUserDataById 整合測試', () => {
        it('應該成功從後端獲取用戶資料', async () => {
            // 這個測試使用後端預設的測試用戶
            const userId = 1

            // Act
            const userData = await GetUserDataById(userId)

            // Assert
            expect(userData).toBeDefined()
            expect(userData.user_id).toBe(1)
            expect(userData.name).toBe('User 1')
            expect(userData.email).toBe('user1@example.com')
            expect(userData.path_to_profile_pic).toBe('/profiles/1.jpg')
            expect(Array.isArray(userData.contact_ways)).toBe(true)
            expect(userData.contact_ways.length).toBeGreaterThan(0)
        })
    })

    describe('GetUserTagsById 整合測試', () => {
        it('應該成功獲取用戶標籤', async () => {
            // 使用預設用戶 ID 1，他已經有標籤
            const userId = 1

            // Act
            const userTags = await GetUserTagsById(userId)

            // Assert
            expect(Array.isArray(userTags)).toBe(true)
            expect(userTags.length).toBeGreaterThan(0)
            expect(userTags[0]).toHaveProperty('user_id', 1)
            expect(userTags[0]).toHaveProperty('user_tag')
        })
    })
}) 