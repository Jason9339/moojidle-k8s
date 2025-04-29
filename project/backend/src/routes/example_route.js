import express from 'express';
const router = express.Router();

import { GetExampleData } from '#src/controllers/example_controller.js';

// the route address start from:
// http://localhost:PORT/example

// frontend gives nothing and backend sends a string
// axios are expected to get a string:
//          
//      the result queried from mongoDB
//

router.get("/", GetExampleData);

export default router;