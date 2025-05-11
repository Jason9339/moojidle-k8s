// /course/member


import express from 'express';
const router = express.Router();

import {  
    getCourseMembers,
    switchCharacter,
    manualInviteStudent
} from '#src/controllers/course_members_controller.js';


router.get("/:courseId", getCourseMembers)
router.post("/switch/:userId/:courseId", switchCharacter)
router.post("/add/:courseId", manualInviteStudent) // 手動加入學生







export default router;
