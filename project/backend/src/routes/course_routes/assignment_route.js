import express from 'express';
import { GetToDoAssignments, GetToDoAssignmentsByUserId, getCourseAssignments } from '#src/controllers/course_controllers/assignment_controller.js';

const router = express.Router();

// 取得待辦作業列表
router.get('/todo', GetToDoAssignmentsByUserId);

// 取得特定課程的作業
router.get('/:courseId/assignments', getCourseAssignments);

export default router;