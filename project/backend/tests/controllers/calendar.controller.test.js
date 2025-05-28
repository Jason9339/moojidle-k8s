import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createMockReq, createMockRes } from '../test-utils.js';
import { GetCalendarEvents } from '#src/controllers/calendar_controller.js'

describe('Calendar Controller', () => {

    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    describe('Get Calendar Events', () => {
        it('抓取User所有課程的Exam, Assignment', async () => {

            const req = createMockReq({}, {
                userId: '1'
            });
            const res = createMockRes();

            await GetCalendarEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.data).not.toBeNull();
        })


        it('沒有uerId時應該返回400', async () => {
            const req = createMockReq();
            const res = createMockRes();

            await GetCalendarEvents(req, res);


            expect(res.status).toHaveBeenCalledWith(400);


        })


        it('userId不存在，或者user沒任何參與時應該返回404', async () => {
            const req = createMockReq({}, {
                userId: '9999'
            });
            const res = createMockRes();

            await GetCalendarEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith([])


        })
    })

}
)
