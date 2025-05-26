import express from 'express';
const router = express.Router();

import { GetAllStudentsProjectedTakenExam } from '#src/controllers/taken_exams_controller.js';

// entry point http://localhost:PORT/taken-exam

// frontend gives courseId
// backend gives back submitted-ass for each student

router.get("/in-course/:courseId", GetAllStudentsProjectedTakenExam);

export default router;
