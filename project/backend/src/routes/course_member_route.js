import express from 'express';
const router = express.Router();

import {  
    GetCourseMembers,
    SwitchCharacter,
    InviteStudent,
    IsAssistantOrTeacher,
} from '#src/controllers/course_members_controller.js';

// entry point http://localhost:PORT/course/member

// getters
// frontend gives courseId
// returns:
// {
//     "students": [
//         {
//             "user_id": 12,
//             "name": "User 12",
//             "contact_ways": [
//                 {
//                     "approach": "email",
//                     "details": "user45@example.com"
//                 }
//             ],
//             "email": "user12@example.com",
//             "student_id": 9331
//         }
//     ],
//     "assistants": [
//         {
//             "user_id": 3,
//             "name": "User 3",
//             "contact_ways": [
//  .........
router.get("/:courseId", GetCourseMembers);
router.get("/can_edit/:userId/:courseId", IsAssistantOrTeacher);

// posters
router.post("/switch/:userId/:courseId", SwitchCharacter);
router.post("/add/:courseId", InviteStudent);

// putters

// deletors

export default router;
