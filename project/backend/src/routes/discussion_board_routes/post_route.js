import express from 'express';
const postRouter = express.Router();
import { GetPostContent } from '#src/controllers/discussion_board_controllers/post_controller.js'
// the route address start from:
// http://localhost:3000/post

// [Input ]  postID : int 
// [Output]     
//          {
//              
//              auther_name: "JX",
//              auther_tag : "XJ",
//              course_name: "Computer Graphics",
//              board_name : "Assignment 1"",
//              post_date  : 2025-01-22T00:00:00.000+00:00,
//              comments : [
//                  {
//                     commentator_name : "Nono Huang",
//                     commentator_tag : "backend king",
//                     comment_discription : "Hello, how are you?",
//                     comment_date : 2025-01-15T00:00:00.000+00:00
//                  },
//
//
//                  {
//                     commentator_name : "BSCny",
//                     commentator_tag : "black face",
//                     comment_discription : "Where is your PR?",
//                     comment_date : 2025-01-15T00:00:00.000+00:00
//                  },
//
//
//              ]
//          },
//          ....

postRouter.get("/content/:id", GetPostContent);

export default postRouter;
