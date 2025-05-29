import { 
    FindNotifiedByUserId,
    FindNotificationById
} from '#src/services/notification_service.js'

async function GetNotified(req, res, next) {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).send({ error: "Invalid user_id" });
        }

        const notifiedData = await FindNotifiedByUserId(userId);
        if (!notifiedData) {
            return res.status(404).send({ error: "Post Not Found" });
        }

        for (const notification of notifiedData) {
            const id = notification.n_id;
            const result = await FindNotificationById(id);

            if (!result) {
                return res.status(404).send({ error: "Notification Not found" });
            }
            notification.notification = result;
        }

        res.status(200).send(notifiedData);
    } catch (err) {
        next(err);
    }
}

export {
    GetNotified
}