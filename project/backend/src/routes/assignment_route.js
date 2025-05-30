import express from 'express';
import { 
    GetToDoAssignmentsByUserId,
    GetCourseAssignments,
    GetAssignmentSubmissionTimeController,
    UploadAssignment,
    DownloadAssignment,
    DeleteAssignment,
    SubmitAssignment,
    GetAssignmentSubmission,
    DeleteSubmittedFile // 新增：刪除學生提交檔案
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

router.get('/:assignmentId/submission-time', GetAssignmentSubmissionTimeController);

router.get('/:assignmentId/submission', GetAssignmentSubmission); // 新增：取得單一作業的繳交紀錄

// POST /assignment/course/:courseId/upload - 支援多檔案上傳
router.post('/course/:courseId/upload', uploadMultipleWithMulter, UploadAssignment, MulterErrorHandling);

// GET /assignment/download
router.get('/download', DownloadAssignment);

// DELETE /assignment/delete
router.delete('/delete', DeleteAssignment);

// 學生繳交作業 - 支援多檔案上傳
router.post('/:assignmentId/submit', uploadMultipleWithMulter, SubmitAssignment, MulterErrorHandling);

// 刪除學生提交的檔案
router.delete('/:assignmentId/submit-file', DeleteSubmittedFile);

export default router;