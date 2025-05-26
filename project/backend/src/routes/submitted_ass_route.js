import express from 'express';
const router = express.Router();

import {
    GetAllStudentsProjectedSubAssign,
} from '#src/controllers/submitted_ass_controller.js';

// entry point http://localhost:PORT/submitted-ass

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

export default router;
