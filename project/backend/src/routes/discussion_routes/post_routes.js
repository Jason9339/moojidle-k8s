import express from 'express';
const router = express.Router();

import { 
    GetOverviewPosts,
} from '#src/controllers/discussion_controllers/post_controllers.js';

// the route address start from:
// http://localhost:PORT/post

// frontend gives discussion board ID and backend sends an array of abjects
// axios are expected to get an object:
//
// [
//     {
//         "_id": "682075190db4344b7ed86290",
//         "post_id": 2,
//         "post_by_user_id": 15,
//         "title": "Post title 2 in Board 2",
//         "description": "This is the content of post 2 in board 2.",
//         "post_date": "2025-01-15T00:00:00.000Z",
//         "public": false,
//         "in_b_id": 2
//     },
//     ......
// ]

router.get("/get-overview-posts/:inBoardId", GetOverviewPosts);

export default router;