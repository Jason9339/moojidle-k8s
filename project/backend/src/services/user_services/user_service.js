import mongoose from "mongoose"

// Fetch all user data from the database
async function FindOneUserById(user_id) {
    let result;
    
    try {
        result = await mongoose.connection.db.collection('user').findOne(
            // { _id: mongoose.Types.ObjectId.createFromHexString(user_id) }
            { user_id: parseInt(user_id) }
        );
    } catch (err) {
        console.log(err);
    }

    return result;
}

export {
    FindOneUserById,
}