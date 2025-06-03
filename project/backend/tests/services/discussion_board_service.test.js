import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    UpdateDiscussionBoardService
} from '#src/services/discussion_board_service.js';

describe('Discussion Board Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('UpdateDiscussionBoardService', () => {
        it('應該成功更新討論版名稱', async () => {
            const boardID = 1; // 假設存在的討論版 ID
            const boardName = '更新後的討論版名稱';

            
            const result = await UpdateDiscussionBoardService(boardID, boardName);
            expect(result).toBe(1);
        });

        it('當討論版不存在時應該拋出錯誤', async () => {
            const boardID = 9999; // 假設不存在的討論版 ID
            const boardName = '不存在的討論版名稱';
            const result = await UpdateDiscussionBoardService(boardID, boardName);
            expect(result).toBe(0);
        });
    });
});
