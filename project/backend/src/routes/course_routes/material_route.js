import express from 'express';
import { GetCourseFiles, UpdateCourseMaterials, DeleteCourseMaterial } from '#src/controllers/course_controllers/material_controller.js';

const router = express.Router();

// 取得特定課程的檔案
router.get('/:courseId/files', GetCourseFiles);
router.get('/:courseId/materials', GetCourseFiles); // files 的別名

// 更新課程教材
router.post('/:courseId/materials', UpdateCourseMaterials);
// 刪除課程教材
router.delete('/:courseId/materials/:materialId', DeleteCourseMaterial);

export default router;
