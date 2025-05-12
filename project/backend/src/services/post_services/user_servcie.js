import mongoose from "mongoose";

async function FindUserNameByID(userId) {
    try {
        const user = await mongoose.connection.db.collection('user').findOne(
            { user_id: userId }, {
            projection: { name: 1, _id: 0 }
        }
        );
        return user.name;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
    }
}


export { FindUserNameByID }
