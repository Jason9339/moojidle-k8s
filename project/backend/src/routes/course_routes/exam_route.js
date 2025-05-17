import express from 'express';
import {
    GetUpcomingExamsByUserId
    // getComingExams
} from '#src/controllers/course_controllers/exam_controller.js';

const router = express.Router();

// 取得即將到來的考試/活動
router.get('/coming', GetUpcomingExamsByUserId);

export default router;