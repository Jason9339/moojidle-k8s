import express from 'express';

const post_board_router = express.Router();

import { GetBoardData } from '#src/controllers/post_controller.js';


post_board_router.get('/:id', GetBoardData);

export default post_board_router;


