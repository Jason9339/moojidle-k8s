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
//         "_id": "6820a7350db4344b7ed8645e",
//         "post_id": 3,
//         "post_by_user_id": 7,
//         "title": "Post title 3 in Board 3",
//         "post_user_custom_tags": [
//             {
//                 "tag_name": "User7's CustomTag_1"
//             }
//         ],
//         "description": "This is the content of post 3....",
//         "post_date": "2025-01-15T00:00:00.000Z",
//         "public": false,
//         "in_b_id": 3,
//         "post_tags": []
//     },
//     ......
// ]
router.get("/get-overview-posts/:inBoardId", GetOverviewPosts);

export default router;