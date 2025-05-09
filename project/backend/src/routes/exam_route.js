import express from 'express';
import { getComingExams } from '#src/controllers/exam_controller.js';

const router = express.Router();

// 取得即將到來的考試/活動
router.get('/coming', getComingExams);

export default router;