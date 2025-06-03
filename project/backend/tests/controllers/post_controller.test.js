import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    EditPost,
} from '#src/controllers/post_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';

describe('Post Controller', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('EditPost', () => {
        it('應該成功編輯貼文', async () => {
            const req = createMockReq(
                {
                    title: '更新後的貼文標題',
                    description: '更新後的貼文內容',
                    public: true
                },
                {
                    id: 1
                }
            );
            const res = createMockRes();

            await EditPost(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: "成功更新貼文"
            });
        });
        it('不存在該貼文', async () => {
            const req = createMockReq(
                {
                    title: '更新後的貼文標題',
                    description: '更新後的貼文內容',
                    public: true
                },
                {
                    id: undefined
                }
            );
            const res = createMockRes();

            await EditPost(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                error: "Invalid post_id"
            });
        });
        it('無效的貼文標題或內容', async () => {
            const req = createMockReq(
                {
                    title: '',
                    description: '更新後的貼文內容',
                    public: true
                },
                {
                    id: 1
                }
            );
            const res = createMockRes();

            await EditPost(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                error: "Title and description are required and cannot be empty."
            });
        });
    });
});