import express from 'express';
import {
    GetUpcomingExamsByUserId,
    GetProjectedExamsByCourseId,
    GetCourseExams,
    DownloadExam,

    UpdateExamScore,
    UploadExam,
    // DeleteExam
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
// router.delete('/delete', DeleteExam);


// frontend gives course_id
// backend gives the max score and % of each exam:
// [
//     {
//         "_id": "6833477cabd712151dd862c7",
//         "exam_id": 9,
//         "in_course_id": 4,
//         "create_by_user_id": 1,
//         "exam_name": "Exam 9 for Course 4",
//         "start_date": "2025-01-15T00:00:00.000Z",
//         "end_date": "2025-01-15T03:00:00.000Z",
//         "create_date": "2025-01-01T00:00:00.000Z",
//         "max_score": 100,
//         "percentage": 0.1
//     },
//      ...............
// ]
router.get("/in-course/:courseId", GetProjectedExamsByCourseId);

// frontend gives assId and payload of:
// {
//     max_score: newMaxScore,
//     percentage: newPercentage
// }
router.put("/update-score/:examId", UpdateExamScore);

export default router;