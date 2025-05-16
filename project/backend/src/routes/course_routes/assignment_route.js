import express from 'express';
import { getTodoAssignments } from '#src/controllers/course_controllers/assignment_controller.js';

const router = express.Router();

// 取得待辦作業列表
router.get('/todo', getTodoAssignments);

export default router;