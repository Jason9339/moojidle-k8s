import express from 'express';

const post_user_router = express.Router();

import { GetUserData } from '#src/controllers/post_controller.js';


post_user_router.get('/:id', GetUserData);

export default post_user_router;


