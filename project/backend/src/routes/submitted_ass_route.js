import express from 'express';
import { 
    GetAssignmentSubmissionTimeController,
    SubmitAssignment,
    GetAssignmentSubmission,
    DeleteSubmittedFile,
    DeleteSubmissionRecord
} from '#src/controllers/submitted_ass_controller.js';

import { 
    uploadMultipleWithMulter,
    MulterErrorHandling 
} from '#src/utils/multer_config.js';

const router = express.Router();

// entry point http://localhost:PORT/submitted-assignment

// 取得作業繳交時間
router.get('/:assignmentId/submission-time', GetAssignmentSubmissionTimeController);

// 取得單一作業的繳交紀錄
router.get('/:assignmentId/submission', GetAssignmentSubmission);

// 學生繳交作業 - 支援多檔案上傳
router.post('/:assignmentId/submit', uploadMultipleWithMulter, SubmitAssignment, MulterErrorHandling);

// 刪除學生提交的檔案
router.delete('/:assignmentId/submit-file', DeleteSubmittedFile);

// 完全刪除學生的作業提交記錄
router.delete('/:assignmentId/submission', DeleteSubmissionRecord);

export default router;
