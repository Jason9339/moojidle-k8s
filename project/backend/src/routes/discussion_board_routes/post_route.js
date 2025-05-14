import express from 'express';
const postRouter = express.Router();
import { GetPostContent, Commender, PostDeleter, CommendDeleter } from '#src/controllers/discussion_board_controllers/post_controller.js'

postRouter.get("/content/:id", GetPostContent);
postRouter.post("/commend", Commender);
postRouter.delete("/delete/:id", PostDeleter);
postRouter.post("/deletecommend", CommendDeleter);

export default postRouter;
