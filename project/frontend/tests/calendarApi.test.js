import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import { GetCalendarEventsByUserId } from '@/services/CalendarApi.js'

describe('前端 Calendar API 整合測試', () => {
    beforeAll(async () => {
        // 確認後端服務器連接
        await WaitForBackendReady()

        console.log('🎯 前端整合測試環境準備完成')
    })

    beforeEach(async () => {
        // 每個測試前重置後端資料庫
        await ResetBackendDatabase()
    })

    describe('GetCalendarEvents 整合測試', () => {
        it('應該成功從後端獲取用戶資料', async () => {
            // 這個測試使用後端預設的測試用戶
            const userId = 1

            // Act
            const data = await GetCalendarEventsByUserId(userId)

            // Assert
            expect(data).toBeDefined();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeGreaterThan(0);
        })
    })

}
)
