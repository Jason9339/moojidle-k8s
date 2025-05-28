import express from 'express';
import {
    GetToDoAssignmentsByUserId,
    GetCourseAssignments,
    GetProjectedAssignmentsInCourse,

    UpdateAssignmentScore
} from '#src/controllers/assignment_controller.js';

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
router.get("/in-course/:courseId", GetProjectedAssignmentsInCourse);

// frontend gives assId and payload of:
// {
//     max_score: newMaxScore,
//     percentage: newPercentage
// }
router.put("/update-score/:assId", UpdateAssignmentScore);

export default router;