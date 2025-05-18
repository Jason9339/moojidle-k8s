import express from 'express';
import { GetCourseFiles, UpdateCourseMaterials, DeleteCourseMaterial } from '#src/controllers/course_controllers/material_controller.js';

const router = express.Router();

// entry point http://localhost:PORT/material

// GET /material/course/:courseId/files
router.get('/course/:courseId/files', GetCourseFiles);
router.get('/course/:courseId/materials', GetCourseFiles); // alias

// POST /material/course/:courseId/materials
router.post('/course/:courseId/materials', UpdateCourseMaterials);

// DELETE /material/course/:courseId/materials/:materialId
router.delete('/course/:courseId/materials/:materialId', DeleteCourseMaterial);


export default router;
