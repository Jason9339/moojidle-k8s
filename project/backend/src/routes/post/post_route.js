import express from 'express';
const post_router = express.Router();

import {GetPostData} from '#src/controllers/post_controller.js';

post_router.get('/:id', GetPostData);

export default post_router;


