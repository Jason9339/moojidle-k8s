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

async function FindUserdataByID(userId) {
    try {
        const user = await mongoose.connection.db.collection('user').findOne(
            { user_id: userId }, {
            projection: { path_to_profile_pic: 2, name: 1, _id: 0 }
        }
        );
        return user;
    } catch (err) {
        throw new Error("Failed to fetch post: " + err.message);
    }
}


export { FindUserNameByID, FindUserdataByID }
