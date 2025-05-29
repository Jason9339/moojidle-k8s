import express from 'express';
const notificationRouter = express.Router();

import { 
    GetNotified,
    NotifiedDeleter,
    Notify
} from '#src/controllers/notification_controller.js'

notificationRouter.get("/get-notification/:id", GetNotified);
notificationRouter.delete("/delete-notified/", NotifiedDeleter);
notificationRouter.post("/notify/", Notify);


export default notificationRouter;
