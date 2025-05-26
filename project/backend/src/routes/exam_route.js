import express from 'express';
import {
    GetUpcomingExamsByUserId,
    GetExamsByCourseId
} from '#src/controllers/exam_controller.js';

const router = express.Router();

// entry point http://localhost:PORT/exams

// 取得即將到來的考試/活動
router.get('/coming', GetUpcomingExamsByUserId);

// frontend gives course_id
// backend gives the max score and % of each exam:
router.get("/get-all/:courseId", GetExamsByCourseId);

export default router;