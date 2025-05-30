import express from 'express';
import {
    GetUpcomingExamsByUserId,
    CourseExams,
    // getComingExams
} from '#src/controllers/exam_controller.js';

const router = express.Router();

// entry point http://localhost:PORT/exams

// 取得即將到來的考試/活動
router.get('/coming', GetUpcomingExamsByUserId);
// get all couses exams
router.get('/:courseId', CourseExams);

export default router;