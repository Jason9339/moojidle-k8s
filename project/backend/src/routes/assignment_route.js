import express from 'express';
import { 
    GetToDoAssignmentsByUserId,
    GetCourseAssignments,
    GetAssignmentSubmissions,
    UploadAssignment,
    DownloadAssignment,
    DeleteAssignment,
    ReviewAssignmentSubmission
} from '#src/controllers/assignment_controller.js';

import { 
    uploadWithMulter, 
    uploadMultipleWithMulter,
    MulterErrorHandling 
} from '#src/utils/multer_config.js';

const router = express.Router();

// entry point http://localhost:PORT/assignment

// TODO
// this route is not working at ALL, not in the scope of refacting the code
router.get('/todo', GetToDoAssignmentsByUserId);

router.get('/course/:courseId', GetCourseAssignments);

// get the course assignment Submissions Status
router.get("/:assignmentId/submissions", GetAssignmentSubmissions);

router.patch("/review/:submitAssignmentId", ReviewAssignmentSubmission);

// POST /assignment/course/:courseId/upload - 支援多檔案上傳
router.post('/course/:courseId/upload', uploadMultipleWithMulter, UploadAssignment, MulterErrorHandling);

// GET /assignment/download
router.get('/download', DownloadAssignment);

// DELETE /assignment/delete
router.delete('/delete', DeleteAssignment);

export default router;
