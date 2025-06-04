import express from 'express';
import { 
    GetOneSubAss,
    GetAllStudentsProjectedSubAssign,
    GetStudentProjectedSubAssign,
    CreateAssignmentSubmission,
    UpdateAssignmentSubmission,
    DeleteSubmissionRecord,
    DownloadSubmittedAss,

    GetAssignmentSubmissions,
    ReviewAssignmentSubmission
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
router.get('/assignment/:assignmentId/user/:userId', GetOneSubAss);

// frontend gives courseId
// backend gives back submitted-ass for each student
// [
//     {
//         "user_id": 1,
//         "name": "User 1",
//         "student_id": 3099,
//         "sub_ass": [
//             null,
//             {
//                 "_id": "6833477cabd712151dd862fa",
//                 "s_ass_id": 7,
//                 "ass_id": 2,
//                 "submit_by_user_id": 1,
//                 "submit_user_course_tag": "StudentTag_1",
//                 "submit_date": "2025-01-22T00:00:00.000Z",
//                 "score": 6,
//                 "graded_by_user_id": 3
//             },
//   ...
router.get("/in-course/:courseId", GetAllStudentsProjectedSubAssign);

// frontend gives courseId and userId
// backend gives back submitted-ass for that student
// {
//     "user_id": 1,
//     "name": "User 1",
//     "student_id": 3099,
//     "sub_ass": [
//         null,
//         {
//             "_id": "6833477cabd712151dd862fa",
//             "s_ass_id": 7,
//             "ass_id": 2,
//             "submit_by_user_id": 1,
//             "submit_user_course_tag": "StudentTag_1",
//             "submit_date": "2025-01-22T00:00:00.000Z",
//             "score": 6,
//             "graded_by_user_id": 3
//         },
//     ]
// }
//
router.get("/in-course/:courseId/user/:userId", GetStudentProjectedSubAssign);

// posters:
// frontend gives assId and userId
// frontend gives form data of:
// formData.append("userTags", userTags);
// formData.append("description", description);
// formData.append("uploadFile", files);
router.post('/submit-to/:assignmentId/user/:userId', uploadMultipleWithMulter, CreateAssignmentSubmission, MulterErrorHandling);

// putters:
// frontend gives subAssId
// frontend gives form data of:
// formData.append("userTags", userTags);
// formData.append("description", description);
// formData.append("uploadFile", files);
router.put('/sub-assign-id/:subAssId', uploadMultipleWithMulter, UpdateAssignmentSubmission, MulterErrorHandling);

// deleters:
// frontend gives subAssId
router.delete('/sub-assign-id/:subAssId', DeleteSubmissionRecord);

router.get('/download', DownloadSubmittedAss);

router.get("/:assignmentId/submissions", GetAssignmentSubmissions);

router.patch("/review/:submitAssignmentId", ReviewAssignmentSubmission);

export default router;