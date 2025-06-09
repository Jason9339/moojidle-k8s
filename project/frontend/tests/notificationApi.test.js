import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import {
    GetnotificationData,
    DeleteNotification,
    ReadNotification
} from '@/services/NotificationApi.js'

describe('前端 Notification 整合測試', () => {
    beforeAll(async () => {
        // 確認後端服務器連接
        await WaitForBackendReady()

        console.log('🎯 前端整合測試環境準備完成')
    })

    beforeEach(async () => {
        // 每個測試前重置後端資料庫
        await ResetBackendDatabase()
    })

    describe('GetnotificationData 整合測試', () => {
        it('應該成功從後端獲取用戶notified資料array', async () => {
            // 這個測試使用後端預設的測試用戶
            const userId = 2

            // Act
            const notificationData = await GetnotificationData(userId)

            // Assert
            expect(notificationData).toBeDefined()
            expect(Array.isArray(notificationData)).toBe(true)
            expect(notificationData[0].n_id).toBe(1)
            expect(notificationData[0].is_read).toBe(false)
            expect(notificationData[0].notification.n_id).toBe(1)
            expect(notificationData[0].notification.event_id).toBe(1)
            expect(notificationData[0].notification.event_category).toBe("course")
            expect(notificationData[0].notification.context).toBe("Successfully enrolled in a course")
        })
    })

    describe('ReadNotification 整合測試', () => {
        it('應該成功從後端已讀notified', async () => {
            const notifiedData = {
                n_id: 1,
                user_id: 2
            }

            const response = await ReadNotification(notifiedData)


            expect(response).toBeDefined()

            //確認刪除已讀
            const userId = 2
            const notificationData = await GetnotificationData(userId)
            console.log(notificationData)
            expect(notificationData[0].is_read).toBe(true)
        })
    })

    describe('DeleteNotification 整合測試', () => {
        it('應該成功從後端刪除notified', async () => {
            // 這個測試使用後端預設的測試用戶
            const notifiedData = {
                n_id: 1,
                user_id: 2
            }

            // Act
            const response = await DeleteNotification(notifiedData)

            // Assert
            expect(response).toBeDefined()

            //確認刪除
            const userId = 2
            const notificationData = await GetnotificationData(userId)
            console.log(notificationData)
            expect(notificationData).toEqual([])
        })
    })
}) 
