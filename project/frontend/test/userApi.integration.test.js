import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
    waitForBackendReady,
    resetBackendDatabase,
    BACKEND_URL
} from './setup.js'
import axios from 'axios'

// 模擬 ApiClient 指向測試後端
const testApiClient = axios.create({
    baseURL: BACKEND_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 模擬 ApiClient
vi.doMock('@/ApiClient.js', () => ({
    default: testApiClient
}))

// 動態導入 UserApi（在模擬之後）
const { GetUserDataById, GetUserTagsById, UpdateUserPassword } = await import('@/services/UserApi.js')

// 額外的測試輔助 API 客戶端
const helperApiClient = axios.create({
    baseURL: BACKEND_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

describe('前端 UserApi 整合測試', () => {
    beforeAll(async () => {
        // 確認後端服務器連接
        await waitForBackendReady()

        console.log('🎯 前端整合測試環境準備完成')
    })

    beforeEach(async () => {
        // 每個測試前重置後端資料庫
        await resetBackendDatabase()

        // 設置前端 API 客戶端指向測試後端
        // 這裡模擬前端在測試環境中的 API 配置
        global.process.env.VITE_API_BASE_URL = BACKEND_URL
    })

    describe('GetUserDataById 整合測試', () => {
        it('應該成功從後端獲取用戶資料', async () => {
            // 這個測試使用後端預設的測試用戶
            const userId = 1

            // Act - 使用前端 UserApi 調用
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

    describe('API 基礎設置測試', () => {
        it('前端 API 客戶端應該正確配置', async () => {
            // 檢查環境變數是否正確設置
            expect(process.env.VITE_API_BASE_URL).toBe(BACKEND_URL)

            // 測試直接 API 調用
            const response = await helperApiClient.get('/health')
            expect(response.status).toBe(200)
            expect(response.data).toHaveProperty('status', 'ok')
        })
    })
}) 