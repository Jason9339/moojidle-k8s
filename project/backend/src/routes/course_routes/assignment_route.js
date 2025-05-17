import express from 'express';
import { GetToDoAssignments, GetToDoAssignmentsByUserId, GetCourseAssignments } from '#src/controllers/course_controllers/assignment_controller.js';

const router = express.Router();

// GET /assignment/todo
router.get('/todo', GetToDoAssignmentsByUserId);

// GET /assignment/course/:courseId
router.get('/course/:courseId', GetCourseAssignments);


export default router;