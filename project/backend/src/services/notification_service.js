import mongoose from 'mongoose';

async function InsertNotificcation(event_id, event_category, context, notified_date) {
    try {
        const counter = await mongoose.connection.db.collection('counter').findOne();
        const nextNotificationId = counter.notification + 1;

        const notification = {
            n_id: nextNotificationId,
            event_id,
            event_category,
            context,
            notified_date
        };

        const result = await mongoose.connection.db.collection('notification').insertOne(notification)

        await mongoose.connection.db.collection('counter').updateOne(
            {},
            { $inc: { notification: 1 } }
        );

        return result;

    } catch (err) {
        throw new Error("Failed to create notification: " + err.message);
    }
}

async function InsertNotified(n_id, user_id) {
    try {
        const notified = {
            n_id: n_id,
            user_id : user_id,
            is_read : false
        };

        const result = await mongoose.connection.db.collection('notified').insertOne(notified)

        return result;

    } catch (err) {
        throw new Error("Failed to create notified: " + err.message);
    }
}

export {
    InsertNotificcation,
    InsertNotified
}