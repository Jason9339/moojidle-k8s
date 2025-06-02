import express from 'express';
import { 
    GetAssignmentSubmission,
    CreateAssignmentSubmission,
    UpdateAssignmentSubmission,
    //DeleteSubmittedFile,
    DeleteSubmissionRecord
} from '#src/controllers/submitted_ass_controller.js';

import { 
    uploadMultipleWithMulter,
    MulterErrorHandling 
} from '#src/utils/multer_config.js';

const router = express.Router();

// entry point http://localhost:PORT/submitted-assignment


// 取得學生提交
router.get('/:assignmentId/submissions/:userId', GetAssignmentSubmission);

// 建立提交
router.post('/:assignmentId/submissions/:userId', CreateAssignmentSubmission);

// 更新提交
router.put('/:assignmentId/submissions/:userId', UpdateAssignmentSubmission);

// 刪除提交
router.delete('/:assignmentId/submissions/:userId', DeleteSubmissionRecord);

// 刪除學生提交的檔案
//router.delete('/:assignmentId/submit-file', DeleteSubmittedFile);

// 學生繳交作業 - 支援多檔案上傳
//目前沒有處理檔案，先不使用multer
//router.post('/:assignmentId/submit', uploadMultipleWithMulter, CreateAssignmentSubmission, MulterErrorHandling);
//router.put('/:assignmentId/submit', uploadMultipleWithMulter, UpdateAssignmentSubmission, MulterErrorHandling);

export default router;
