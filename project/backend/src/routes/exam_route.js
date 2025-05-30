import express from 'express';
import {
    GetUpcomingExamsByUserId,
    CourseExams,
    AddExam,
    UploadExamAttachment,
    DownloadExamAttachment,
    DeleteExamAttachment
    // getComingExams
} from '#src/controllers/exam_controller.js';

import {
    uploadMultipleWithMulter,
    MulterErrorHandling
} from '#src/utils/multer_config.js';

const router = express.Router();

// entry point http://localhost:PORT/exams

// 取得即將到來的考試/活動
router.get('/coming', GetUpcomingExamsByUserId);
// get all couses exams
router.get('/:courseId', CourseExams);

// 取得某課程所有考試
router.get('/:courseId', CourseExams);

// 新增考試
router.post('/', AddExam);

// 上傳考試附件
router.post('/:examId/upload', uploadMultipleWithMulter, UploadExamAttachment, MulterErrorHandling);
// 下載考試附件
router.get('/download', DownloadExamAttachment);
// 刪除考試附件
router.delete('/delete', DeleteExamAttachment);


export default router;