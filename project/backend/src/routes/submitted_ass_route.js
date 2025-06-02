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


// getters:
// frontend gives assId and userId
// backend gives: null if nothing submitted
// {
//     "s_ass_id": 7,
//     "ass_id": 2,
//     "submit_by_user_id": 1,
//     "submit_user_course_tag": "StudentTag_1",
//     "submit_date": "2025-01-22T00:00:00.000Z",
//     "score": 6,
//     "graded_by_user_id": 3,
//     "attachments": [
//         {
//             "filename": "submitted_assignment_7_file_1.pdf",
//             "url": "http://example.com/assignments/course_1/assignment_7_file_1.pdf"
//         },
//     ],
//     "description": "This is the submission for Assignment 2 by User 1."
// }
router.get('/assignment/:assignmentId/user/:userId', GetAssignmentSubmission);

// posters:
// frontend gives form data of:
// formData.append("userTags", userTags);
// formData.append("description", description);
// formData.append("uploadFile", files);
router.post('/submit-to/:assignmentId/user/:userId', uploadMultipleWithMulter, CreateAssignmentSubmission, MulterErrorHandling);

// putters:
router.put('/:assignmentId/submissions/:userId', UpdateAssignmentSubmission);

// deleters:
// frontend gives assId and userId
// TODO right now the seed is not in the same pace of real case,
// in seed, we can have 1 person submit 2 times, and keep the record
// but in application, we only want 1
router.delete('/assignment/:assignmentId/submissions/:userId', DeleteSubmissionRecord);

export default router;
