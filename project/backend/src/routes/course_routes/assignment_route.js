import express from 'express';
import { GetToDoAssignments, GetToDoAssignmentsByUserId } from '#src/controllers/course_controllers/assignment_controller.js';

const router = express.Router();

// 取得待辦作業列表
router.get('/todo', GetToDoAssignmentsByUserId);

export default router;