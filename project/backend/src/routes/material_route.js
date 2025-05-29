import express from 'express';
import { 
    GetCourseFiles, 
    UpdateCourseMaterials, 
    DeleteCourseMaterial,
    UploadCourseMaterial,
    DownloadMaterial,
    DeleteMaterial
} from '#src/controllers/material_controller.js';

import { 
    uploadWithMulter, 
    MulterErrorHandling 
} from '#src/utils/multer_config.js';

const router = express.Router();

// entry point http://localhost:PORT/material

// GET /material/course/:courseId/materials
router.get('/course/:courseId/materials', GetCourseFiles);

// POST /material/course/:courseId/materials
router.post('/course/:courseId/materials', UpdateCourseMaterials);

// POST /material/course/:courseId/upload
router.post('/course/:courseId/upload', uploadWithMulter, UploadCourseMaterial, MulterErrorHandling);

// DELETE /material/course/:courseId/materials/:materialId
router.delete('/course/:courseId/materials/:materialId', DeleteCourseMaterial);

// GET /material/download
router.get('/download', DownloadMaterial);

// DELETE /material/delete
router.delete('/delete', DeleteMaterial);

export default router;
