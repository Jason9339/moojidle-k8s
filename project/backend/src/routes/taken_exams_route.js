import express from 'express';
const router = express.Router();

import { GetAllStudentsProjectedTakenExam, GetStudentProjectedTakenExam } from '#src/controllers/taken_exams_controller.js';

// entry point http://localhost:PORT/taken-exam

// frontend gives courseId
// backend gives back taken_exams for each student
// [
//     {
//         "user_id": 1,
//         "name": "User 1",
//         "student_id": 3099,
//         "taken_exams": [
//             {
//                 "exam_name": "Exam 1 for Course 1",
//                 "percentage": 0.1
//             },
//             {
//                 "exam_name": "Exam 2 for Course 1",
//                 "percentage": 0.1
//             },
//             {
//                 "exam_name": "Exam 3 for Course 1",
//                 "percentage": 0.1
//             }
//         ]
//     },
// .............
router.get("/in-course/:courseId", GetAllStudentsProjectedTakenExam);


// frontend gives courseId and userId
// backend gives back taken_eaxm for that student
// {
//     "user_id": 1,
//     "name": "User 1",
//     "student_id": 3099,
//     "taken_exams": [
//         {
//             "exam_name": "Exam 1 for Course 1",
//             "percentage": 0.1
//         },
//         {
//             "exam_name": "Exam 2 for Course 1",
//             "percentage": 0.1
//         },
//         {
//             "exam_name": "Exam 3 for Course 1",
//             "percentage": 0.1
//         }
//     ]
// }
//
router.get("/in-course/:courseId/user/:userId", GetStudentProjectedTakenExam);

export default router;
