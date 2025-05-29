import express from 'express';
import { 
    GetToDoAssignmentsByUserId,
    GetCourseAssignments,
    GetAssignmentSubmissionTimeController,
    UploadAssignment,
    DownloadAssignment,
    DeleteAssignment
} from '#src/controllers/assignment_controller.js';

import { 
    uploadWithMulter, 
    MulterErrorHandling 
} from '#src/utils/multer_config.js';

const router = express.Router();

// entry point http://localhost:PORT/assignment

// TODO
// this route is not working at ALL, not in the scope of refacting the code
router.get('/todo', GetToDoAssignmentsByUserId);

router.get('/course/:courseId', GetCourseAssignments);

router.get('/:assignmentId/submission-time', GetAssignmentSubmissionTimeController);

router.get('/:assignmentId/submission-time', GetAssignmentSubmissionTimeController);

// POST /assignment/course/:courseId/upload
router.post('/course/:courseId/upload', uploadWithMulter, UploadAssignment, MulterErrorHandling);

// GET /assignment/download
router.get('/download', DownloadAssignment);

// DELETE /assignment/delete
router.delete('/delete', DeleteAssignment);

export default router;