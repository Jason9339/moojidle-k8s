import mongoose from 'mongoose';

async function InsertNotification(notificationData) {
    try {
        const counter = await mongoose.connection.db.collection('counter').findOne();
            if (!counter) {
                throw new Error("Counter document not found. Please initialize your counter collection.");
            }
        const nextNotificationId = counter.notification + 1;
        
        const date = new Date();

        const notification = {
            n_id: nextNotificationId,
            event_id : notificationData.event_id,
            event_category : notificationData.event_category,
            context : notificationData.context,
            notified_date : date
        };


        const result = await mongoose.connection.db.collection('notification').insertOne(notification)
        result.n_id = nextNotificationId;

        await mongoose.connection.db.collection('counter').updateOne(
            {},
            { $inc: { notification: 1 } }
        );

        return result;

    } catch (err) {
        throw new Error("Failed to create notification: " + err.message);
    }
}

async function InsertNotified(notifiedData) {
    try {
        const notified = {
            n_id: notifiedData.n_id,
            user_id : notifiedData.user_id,
            is_read : false
        };

        const result = await mongoose.connection.db.collection('notified').insertOne(notified)

        return result;

    } catch (err) {
        throw new Error("Failed to create notified: " + err.message);
    }
}

async function FindNotificationById(notificationID) {
    try {
        const notification = await mongoose.connection.db.collection('notification').findOne({ n_id: notificationID });
        return notification;
    } catch (err) {
        throw new Error("Failed to fetch notification: " + err.message);
    }
}

async function SendNotify(notificationData) {
    try {
        const counter = await mongoose.connection.db.collection('counter').findOne();
        if (!counter) {
            throw new Error("Counter document not found. Please initialize your counter collection.");
        }

        const nextNotificationId = counter.notification + 1;

        const date = new Date();
        const notification = {
            n_id: nextNotificationId,
            event_id: notificationData.event_id,
            event_category: notificationData.event_category,
            context: notificationData.context,
            notified_date: date
        };

        await mongoose.connection.db.collection('notification').insertOne(notification);
        await mongoose.connection.db.collection('counter').updateOne({}, { $inc: { notification: 1 } });

        const notifiedInsertions = notificationData.notified_users.map(user => {
            const notifiedData = {
                n_id: nextNotificationId,
                user_id: user.user_id,
                is_read: false
            };
            return mongoose.connection.db.collection('notified').insertOne(notifiedData);
        });

        const notifiedResults = await Promise.all(notifiedInsertions);

        return {
            notification_id: nextNotificationId,
            insertedNotification: notification,
            notifiedUsers: notifiedResults.map((res, i) => ({
                ...notificationData.notified_users[i],
                result: res
            }))
        };

    } catch (err) {
        throw new Error("Failed to create notification: " + err.message);
    }
}

async function FindNotifiedByUserId(userID) {
    try {
        const notifieds = await mongoose.connection.db.collection('notified').find({ user_id: userID }).toArray();;
        return notifieds;
    } catch (err) {
        throw new Error("Failed to fetch user's notified: " + err.message);
    }
}

async function DeleteNotifiedById(notificationData) {
    try {
        const notificationID = notificationData.n_id;
        const userID = notificationData.user_id;
        const result = await mongoose.connection.db.collection('notified').deleteOne({
            n_id: notificationID,
            user_id: userID
        });
        return result;
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};

async function NotificationReaded(notifiedData) {
    try {
        const notificationID = notifiedData.n_id;
        const userID = notifiedData.user_id;
        const result = await mongoose.connection.db.collection('notified').updateOne(
            {
                n_id: notificationID,
                user_id: userID
            },
            {
                $set: {
                    is_read: true
                }
            }
        );
        return result;
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};

export {
    InsertNotification,
    InsertNotified,
    FindNotificationById,
    FindNotifiedByUserId,
    DeleteNotifiedById,
    SendNotify,
    NotificationReaded
}