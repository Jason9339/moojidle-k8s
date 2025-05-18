import express from 'express';
const postRouter = express.Router();
import { GetPostContent, LeaveComment, PostDeleter, CommendDeleter, GetOverviewPosts, AddPosts } from '#src/controllers/post_controllers.js'

postRouter.get("/content/:id", GetPostContent);
postRouter.post("/commend", LeaveComment);
postRouter.delete("/delete/:id", PostDeleter);
postRouter.post("/deletecommend", CommendDeleter);
postRouter.get("/get-overview-posts/:inBoardId", GetOverviewPosts);


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
postRouter.get("/get-overview-posts/:inBoardId", GetOverviewPosts);

//  add a new post
//  the example:
// {
//     "post_by_user_id": 7,
//     "post_user_custom_tags": ["助教", "公告"],
//     "description": "這是測試貼文內容",
//     "title": "這是測試標題",
//     "public": true
// }
postRouter.post("/create-post", AddPosts);

export default postRouter;
