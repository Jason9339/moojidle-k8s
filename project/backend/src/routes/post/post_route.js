import express from 'express';
const post_router = express.Router();

import {
    GetPostData,
    GetPostListByCourse
} from '#src/controllers/post_controller.js';

post_router.get('/:id', GetPostData);
post_router.get("/course/:id", GetPostListByCourse);

export default post_router;


