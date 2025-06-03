import mongoose from 'mongoose';

import GetNextCounterId from '#src/utils/get_next_counter_id.js'

async function FindNotificationById(notificationID) {
    try {
        const notification = await mongoose.connection.db.collection('notification').findOne({ n_id: notificationID });
        return notification;
    } catch (err) {
        throw new Error("Failed to fetch notification: " + err.message);
    }
}

async function SendNotification(notificationData) {
    try {
        const nextNotificationId = await GetNextCounterId("notification");
        const date = new Date();
        const notification = {
            n_id: nextNotificationId,
            event_id: notificationData.event_id,
            event_category: notificationData.event_category,
            context: notificationData.context,
            notified_date: date
        };

        const result = await mongoose.connection.db.collection('notification').insertOne(notification);
        notification.result = result;
        return {notification};

    } catch (err) {
        throw new Error("Failed to create notification: " + err.message);
    }
}

async function SendNotified(notification_id, users) {
    try {
        const notifiedInsertions = users.map(user => {
            const notifiedData = {
                n_id: notification_id,
                user_id: user.user_id,
                is_read: false
            };
            return mongoose.connection.db.collection('notified').insertOne(notifiedData);
        });

        const notifiedResults = await Promise.all(notifiedInsertions);

        return notifiedResults;

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
    FindNotificationById,
    FindNotifiedByUserId,
    DeleteNotifiedById,
    SendNotification,
    SendNotified,
    NotificationReaded
}