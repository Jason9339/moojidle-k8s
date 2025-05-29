import { 
    FindNotifiedByUserId,
    FindNotificationById,
    DeleteNotifiedById,
    SendNotify
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

async function NotifiedDeleter(req, res){
        try {
        const { n_id, user_id } = req.body;
        if (isNaN(n_id)) {
            return res.status(400).send({ error: "Invalid n_id" });
        }
        if (isNaN(user_id)) {
            return res.status(400).send({ error: "Invalid user_id" });
        }

        const notifiedData = {
            n_id : n_id,
            user_id : user_id
        }
        const result = await DeleteNotifiedById(notifiedData);

        if (result.error) {
            return res.status(404).send({ error: result.error });
        }

        if(result.deletedCount != 1) {
            return res.status(404).send('Nothing to delete');
        }

        return res.status(200).send({ message: result});

    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "An unexpected error occurred" });
    }
}

async function Notify(req, res) {
    try {
        const { event_id, event_category, context, notified_userId} = req.body;
        console.log(req.body)

        const result = await SendNotify(req.body);

        if (result.error) {
            return res.status(404).send({ error: result.error });
        }

        return res.status(200).send({ message: {result}});

    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "An unexpected error occurred" });
    }
}

export {
    GetNotified,
    NotifiedDeleter,
    Notify
}