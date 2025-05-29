import express from 'express';
const notificationRouter = express.Router();

import { 
    GetNotified
} from '#src/controllers/notification_controller.js'

notificationRouter.get("/get-notification/:id", GetNotified);

export default notificationRouter;
