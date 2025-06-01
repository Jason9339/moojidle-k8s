import express from 'express';
import {
    GetToDoAssignmentsByUserId,
    GetCourseAssignments,
    GetProjectedAssignmentsInCourse,
    DownloadAssignment,

    UploadAssignment,

    UpdateAssignmentScore,
    
    // DeleteAssignment
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

// frontend gives course_id
// backend gives the max score and % of each assign:
// [
//     {
//         "_id": "6833477cabd712151dd862e3",
//         "ass_id": 1,
//         "in_course_id": 1,
//         "create_by_user_id": 14,
//         "ass_name": "Assignment 1 for Course 1",
//         "create_date": "2025-01-08T00:00:00.000Z",
//         "start_date": "2025-01-08T00:00:00.000Z",
//         "end_date": "2025-01-15T00:00:00.000Z",
//         "max_score": 100,
//         "percentage": 0.1
//     },
//     ................
// ]
router.get("/simple-assigns/in-course/:courseId", GetProjectedAssignmentsInCourse);

// frontend gives assId and payload of:
// {
//     max_score: newMaxScore,
//     percentage: newPercentage
// }
router.put("/update-score/:assId", UpdateAssignmentScore);

// POST /assignment/course/:courseId/upload - 支援多檔案上傳
router.post('/course/:courseId/upload', uploadMultipleWithMulter, UploadAssignment, MulterErrorHandling);

// GET /assignment/download
router.get('/download', DownloadAssignment);

// DELETE /assignment/delete
// router.delete('/delete', DeleteAssignment);

export default router;