import express from 'express';
import { 
    GetToDoAssignmentsByUserId,
    GetCourseAssignments 
} from '#src/controllers/assignment_controller.js';

const router = express.Router();

// entry point http://localhost:PORT/assignment

// TODO
// this route is not working at ALL, not in the scope of refacting the code
router.get('/todo', GetToDoAssignmentsByUserId);

router.get('/course/:courseId', GetCourseAssignments);


export default router;