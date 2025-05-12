// /course/member


import express from 'express';
const router = express.Router();

import {  
    getCourseMembers,
    switchCharacter,
    inviteStudent,
    getIdViaInviteCode 
} from '#src/controllers/course_members_controller.js';


router.get("/:courseId", getCourseMembers)
router.post("/switch/:userId/:courseId", switchCharacter)
router.post("/add/:courseId", inviteStudent) // 手動加入學生
router.get("/invite/:code", getIdViaInviteCode) // 邀請碼







export default router;
