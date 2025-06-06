import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditCourse } from '#src/controllers/course_controller';
import { EditCourseName } from '#src/services/course_service.js';

// mock service
vi.mock('#src/services/course_service.js', () => ({
    EditCourseName: vi.fn()
}));

describe('EditCourse Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '1' },
            body: { name: '新課程名稱' }
        };
        res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        };
    });

    it('應成功更新課程名稱並回傳 200 和更新後資料', async () => {
        const fakeCourse = {
            course_id: 1,
            name: '新課程名稱',
            description: '',
        };
        EditCourseName.mockResolvedValue(fakeCourse);

        await EditCourse(req, res);

        expect(EditCourseName).toHaveBeenCalledWith(1, '新課程名稱');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(fakeCourse);
    });

    it('若缺少更新資料應回傳 400', async () => {
        req.body = {};

        await EditCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ message: 'Lack of update Data.' });
    });

    it('若 service 拋錯應回傳 500 並附帶錯誤訊息', async () => {
        EditCourseName.mockRejectedValue(new Error('Course not found'));

        await EditCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: 'Failed to Edit course',
            error: 'Course not found'
        });
    });
});
