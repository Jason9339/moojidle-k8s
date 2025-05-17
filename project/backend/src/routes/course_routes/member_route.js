// /course/member


import express from 'express';
const router = express.Router();

import {  
    GetCourseMembers,
    SwitchCharacter,
    InviteStudent,
    CanUserEditAnnouncements
} from '#src/controllers/course_controllers/course_members_controller.js';

import {
    GetIdViaInviteCode,
} from '#src/controllers/course_controllers/course_controller.js';

router.get("/:courseId", GetCourseMembers)
router.post("/switch/:userId/:courseId", SwitchCharacter)
router.post("/add/:courseId", InviteStudent) // 手動加入學生
router.get("/invite/:code", GetIdViaInviteCode) // 邀請碼
router.get("/can_edit/:userId/:courseId", CanUserEditAnnouncements);






export default router;
