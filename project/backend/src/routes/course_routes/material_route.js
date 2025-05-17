import express from 'express';
import { getCourseFiles, updateCourseMaterials, deleteCourseMaterial } from '#src/controllers/course_controllers/material_controller.js';

const router = express.Router();

// 取得特定課程的檔案
router.get('/:courseId/files', getCourseFiles);
router.get('/:courseId/materials', getCourseFiles); // files 的別名

// 更新課程教材
router.post('/:courseId/materials', updateCourseMaterials);
// 刪除課程教材
router.delete('/:courseId/materials/:materialId', deleteCourseMaterial);

export default router;
