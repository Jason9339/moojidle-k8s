import express from 'express';
const router = express.Router();

import { 
    GetUserCourse 
} from '#src/controllers/course_controllers/course_controller.js';


router.get("/:userid", GetUserCourse);

export default router;