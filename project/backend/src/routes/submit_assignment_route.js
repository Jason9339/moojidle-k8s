import express from 'express';

import {  
    GetAssignmentSubmissions,
    ReviewAssignmentSubmission
} from "#src/controllers/submit_assignment_controller.js";

const router = express.Router();

// get the course assignment Submissions Status
router.get("/:assignmentId/submissions", GetAssignmentSubmissions);

router.patch("/review/:submitAssignmentId", ReviewAssignmentSubmission);

export default router;
