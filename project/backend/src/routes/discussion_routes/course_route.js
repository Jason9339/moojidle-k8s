import express from 'express';
const router = express.Router();

import { 
    GetUserCourse 
} from '#src/controllers/discussion_controllers/course_controller.js';

// This route is used to get all the courses of a user by user id
// Example response:
// [
//     {
//         course_id : 1,
//         course_name : "course 1",
//     },
//     {
//         course_id : 2,
//         course_name  : "course 2",
//     },
//     {
//         course_id : 3,
//         course_name  : "course 3",
//     },
//     {
//         course_id : 4,
//         course_name  : "course 4",
//     }
// ]
router.get("/:userid", GetUserCourse);

export default router;