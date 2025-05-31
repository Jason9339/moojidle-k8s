import express from 'express';
import {
    GetUpcomingExamsByUserId,
    CourseExams,
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
router.get('/:courseId', CourseExams);

// 取得某課程所有考試
router.get('/:courseId', CourseExams);

// POST /assignment/course/:courseId/upload - 支援多檔案上傳
router.post('/course/:courseId/upload', uploadMultipleWithMulter, UploadExam, MulterErrorHandling);

// GET /assignment/download
router.get('/download', DownloadExam);

// DELETE /assignment/delete
router.delete('/delete', DeleteExam);


export default router;