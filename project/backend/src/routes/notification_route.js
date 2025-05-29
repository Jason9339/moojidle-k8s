import express from 'express';
const notificationRouter = express.Router();

import { 
    GetNotified,
    NotifiedDeleter
} from '#src/controllers/notification_controller.js'

notificationRouter.get("/get-notification/:id", GetNotified);
notificationRouter.delete("/delete-notified/", NotifiedDeleter);

export default notificationRouter;
