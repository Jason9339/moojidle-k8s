import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    UpdatePostById
} from '#src/services/post_services.js';

describe('Post Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('UpdatePostById', () => {
        it('應該成功更新貼文資訊', async () => {
            const postID = 1; // 假設存在的貼文 ID
            const post = {
                title: '更新後的貼文標題',
                description: '更新後的貼文內容',
                post_tags: [
                    {
                        "tag_name": "test"
                    }
                    ,

                    {
                        "tag_name": "test2"
                    }
                ],
                post_user_custom_tags: [
                    {
                        "tag_name": "test user tag"
                    }
                ]
            };
            const result = await UpdatePostById(postID, post);
            expect(result).toBe(1);
        });
        it('當貼文不存在時應該返回 0', async () => {
            const postID = 9999; // 假設不存在的貼文 ID
            const post = {
                title: '不存在的貼文標題',
                description: '不存在的貼文內容'
            };
            const result = await UpdatePostById(postID, post);
            expect(result).toBe(0);
        });

    });
});
