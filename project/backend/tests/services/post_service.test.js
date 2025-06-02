import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    UpdatePostById
} from '#src/services/post_services.js';

describe('Post Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('UpdatePostById', () => {
        it('應該成功更新討論版名稱', async () => {
            
            const postID = 1; // 假設存在的討論版 ID
            const result = await EditDiscussionBoardService(boardID, boardName);
            expect(result).toBe(1);
        });

        it('當討論版不存在時應該拋出錯誤', async () => {
            const boardID = 9999; // 假設不存在的討論版 ID
            const boardName = '不存在的討論版名稱';
            const result = await EditDiscussionBoardService(boardID, boardName);
            expect(result).toBe(0);
        });
    });
});
