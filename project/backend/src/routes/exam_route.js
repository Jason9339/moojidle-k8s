import express from 'express';
import {
    GetUpcomingExamsByUserId,
    GetCourseExams,
    UploadExam,
    DownloadExam,
    DeleteExam
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
router.get('/:courseId', GetCourseExams);

// POST /exams/course/:courseId/upload - 支援多檔案上傳
router.post('/course/:courseId/upload', uploadMultipleWithMulter, UploadExam, MulterErrorHandling);

// GET /exams/download
router.get('/download/download', DownloadExam);

// DELETE /exams/delete
router.delete('/delete', DeleteExam);


export default router;