// /course/member


import express from 'express';
const router = express.Router();

import {  
    getCourseMembers,
    switchCharacter
} from '#src/controllers/course_members_controller.js';


router.get("/:courseId", getCourseMembers)
router.post("/switch/:userId/:courseId", switchCharacter)






export default router;
