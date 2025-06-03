import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    EditDiscussionBoard
} from '#src/controllers/discussion_board_controller.js';
import { createMockReq, createMockRes } from '../test-utils.js';

describe('User Controller', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('EditDiscussionBoard', () => {
        it('應該成功編輯討論版', async () => {
            const req = createMockReq(
                {
                    board_name: 'Updated Discussion Board'
                },
                {
                    boardId: 1
                }
            );
            const res = createMockRes();

            await EditDiscussionBoard(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true, message: "討論版名稱已更新"
            });
        });
    });
    it('不存在該討論版', async () => {
        const req = createMockReq(
            {
                board_name: 'Updated Discussion Board'
            },
            {
                boardId: undefined
            }
        );
        const res = createMockRes();

        await EditDiscussionBoard(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false, message: "無效的 board_id"
        });
    });
    it('無效的討論版名稱', async () => {
        const req = createMockReq(
            {
                board_name: ''
            },
            {
                boardId: 1
            }
        );
        const res = createMockRes();

        await EditDiscussionBoard(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false, message: "請提供新的討論版名稱"
        });
    }
    );
});      